// YouTube metadata fetching utility using oEmbed API

interface YouTubeMetadata {
  title: string;
  artist: string;
  thumbnail: string;
  album?: string;
}

interface OEmbedResponse {
  title: string;
  author_name: string;
  author_url: string;
  type: string;
  height: number;
  width: number;
  version: string;
  provider_name: string;
  provider_url: string;
  thumbnail_height: number;
  thumbnail_width: number;
  thumbnail_url: string;
  html: string;
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

// Fetch metadata from YouTube oEmbed API (no API key required)
export async function fetchYouTubeMetadata(youtubeId: string): Promise<YouTubeMetadata | null> {
  try {
    const videoUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`;
    
    const response = await fetch(oembedUrl);
    
    if (!response.ok) {
      console.error(`oEmbed API returned status ${response.status}`);
      return null;
    }

    const data: OEmbedResponse = await response.json();

    // Extract title and try to parse artist from it
    // Common formats: "Artist - Title", "Title - Artist", "Title by Artist"
    let title = data.title || '';
    let artist = data.author_name || '';
    let album: string | undefined = undefined;

    // Try to parse "Artist - Title" or "Title - Artist" format
    const dashMatch = title.match(/^(.+?)\s*[-–—]\s*(.+)$/);
    if (dashMatch) {
      // Common pattern is "Artist - Song Title"
      // Check if channel name matches either part
      const part1 = dashMatch[1].trim();
      const part2 = dashMatch[2].trim();
      
      if (data.author_name && part1.toLowerCase().includes(data.author_name.toLowerCase())) {
        artist = part1;
        title = part2;
      } else if (data.author_name && part2.toLowerCase().includes(data.author_name.toLowerCase())) {
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

    return {
      title,
      artist,
      album,
      thumbnail: data.thumbnail_url || getYouTubeThumbnail(youtubeId),
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
