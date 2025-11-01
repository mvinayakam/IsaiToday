// YouTube metadata fetching utility
import { google } from 'googleapis';

interface YouTubeMetadata {
  title: string;
  artist: string;
  thumbnail: string;
  album?: string;
  description?: string;
}

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=youtube',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('YouTube not connected');
  }
  return accessToken;
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
// Always call this function again to get a fresh client.
async function getUncachableYouTubeClient() {
  const accessToken = await getAccessToken();
  return google.youtube({ version: 'v3', auth: accessToken });
}

export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  // If it's already just an ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }

  return null;
}

export function getYouTubeThumbnail(youtubeId: string): string {
  // Using maxresdefault for best quality
  return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
}

export function getYouTubeEmbedUrl(youtubeId: string): string {
  return `https://www.youtube.com/embed/${youtubeId}?controls=1&modestbranding=1`;
}

// Fetch metadata from YouTube Data API v3
export async function fetchYouTubeMetadata(youtubeId: string): Promise<YouTubeMetadata | null> {
  try {
    const youtube = await getUncachableYouTubeClient();
    
    const response = await youtube.videos.list({
      part: ['snippet'],
      id: [youtubeId],
    });

    if (!response.data.items || response.data.items.length === 0) {
      return null;
    }

    const video = response.data.items[0];
    const snippet = video.snippet;

    if (!snippet) {
      return null;
    }

    // Extract title and try to parse artist from it
    // Common formats: "Artist - Title", "Title - Artist", "Title by Artist"
    let title = snippet.title || '';
    let artist = snippet.channelTitle || '';
    let album: string | undefined = undefined;

    // Try to parse "Artist - Title" or "Title - Artist" format
    const dashMatch = title.match(/^(.+?)\s*[-–—]\s*(.+)$/);
    if (dashMatch) {
      // Common pattern is "Artist - Song Title"
      // Check if channel name matches either part
      const part1 = dashMatch[1].trim();
      const part2 = dashMatch[2].trim();
      
      if (snippet.channelTitle && part1.toLowerCase().includes(snippet.channelTitle.toLowerCase())) {
        artist = part1;
        title = part2;
      } else if (snippet.channelTitle && part2.toLowerCase().includes(snippet.channelTitle.toLowerCase())) {
        artist = part2;
        title = part1;
      } else {
        // Default to part1 as artist, part2 as title
        artist = part1;
        title = part2;
      }
    } else {
      // Try "by Artist" pattern
      const byMatch = title.match(/^(.+?)\s+by\s+(.+)$/i);
      if (byMatch) {
        title = byMatch[1].trim();
        artist = byMatch[2].trim();
      }
    }

    // Check description for album info
    if (snippet.description) {
      const albumMatch = snippet.description.match(/(?:album|from):\s*(.+?)(?:\n|$)/i);
      if (albumMatch) {
        album = albumMatch[1].trim();
      }
    }

    return {
      title,
      artist,
      album,
      thumbnail: getYouTubeThumbnail(youtubeId),
      description: snippet.description || undefined,
    };
  } catch (error) {
    console.error('Error fetching YouTube metadata:', error);
    return null;
  }
}

// For MVP: Helper to create metadata from known songs
// In production, you'd call YouTube Data API v3 to fetch real metadata
export function createSongMetadata(youtubeId: string, title: string, artist: string): YouTubeMetadata {
  return {
    title,
    artist,
    thumbnail: getYouTubeThumbnail(youtubeId),
  };
}
