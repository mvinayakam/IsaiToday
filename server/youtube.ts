// YouTube metadata fetching utility
// Note: For MVP, we're using the basic YouTube thumbnail URL format
// In production, you could integrate YouTube Data API v3 for richer metadata

interface YouTubeMetadata {
  title: string;
  artist: string;
  thumbnail: string;
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

// For MVP: Helper to create metadata from known songs
// In production, you'd call YouTube Data API v3 to fetch real metadata
export function createSongMetadata(youtubeId: string, title: string, artist: string): YouTubeMetadata {
  return {
    title,
    artist,
    thumbnail: getYouTubeThumbnail(youtubeId),
  };
}
