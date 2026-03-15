// YouTube metadata fetching utility
import { google } from 'googleapis';

interface YouTubeMetadata {
  title: string;
  artist: string;
  thumbnail: string;
  album?: string;
  description?: string;
}

function getYouTubeClient() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error('YOUTUBE_API_KEY environment variable is not set');
  }
  return google.youtube({ version: 'v3', auth: apiKey });
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
    console.log('[YouTube] Fetching metadata for video:', youtubeId);
    const youtube = getYouTubeClient();
    
    const response = await youtube.videos.list({
      part: ['snippet'],
      id: [youtubeId],
    });

    console.log('[YouTube] API response status:', response.status);
    if (!response.data.items || response.data.items.length === 0) {
      console.log('[YouTube] No items found in response');
      return null;
    }

    const video = response.data.items[0];
    const snippet = video.snippet;

    if (!snippet) {
      return null;
    }

    // Extract title and try to parse artist from description first, then title
    let title = snippet.title || '';
    let artist = snippet.channelTitle || '';
    let album: string | undefined = undefined;
    const description = snippet.description || '';

    // Parse description for Indian music metadata
    // Common patterns:
    // Song : <title>
    // Movie : <movie name>
    // Singer(s) : <artist>
    // Music Director : <composer>
    if (description) {
      // Try to extract singer from description
      const singerMatch = description.match(/Singers?\s*:\s*(.+?)(?:\n|$)/i);
      if (singerMatch) {
        artist = singerMatch[1].trim();
      }

      // Try to extract song title from description
      const songMatch = description.match(/Song\s*:\s*(.+?)(?:\n|$)/i);
      if (songMatch) {
        title = songMatch[1].trim();
      }

      // Try to extract movie/album from description
      const movieMatch = description.match(/(?:Movie|Film|Album)\s*:\s*(.+?)(?:\n|$)/i);
      if (movieMatch) {
        album = movieMatch[1].trim();
      }
    }

    // If we didn't find artist in description, try parsing from title
    if (artist === snippet.channelTitle) {
      // Try to parse "Artist - Title" or "Title - Artist" format
      const dashMatch = title.match(/^(.+?)\s*[-–—|]\s*(.+)$/);
      if (dashMatch) {
        const part1 = dashMatch[1].trim();
        const part2 = dashMatch[2].trim();
        
        // Check if one part looks like an artist name (shorter, no special chars)
        if (part1.length < part2.length && !part1.match(/\(|\[/)) {
          artist = part1;
          title = part2;
        } else if (part2.length < part1.length && !part2.match(/\(|\[/)) {
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
    }

    console.log('[YouTube] Successfully extracted metadata:', { title, artist, album });
    return {
      title,
      artist,
      album,
      thumbnail: getYouTubeThumbnail(youtubeId),
      description,
    };
  } catch (error: any) {
    console.error('[YouTube] Error fetching metadata:', error.message || error);
    if (error.response) {
      console.error('[YouTube] API error response:', error.response.data);
    }
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
