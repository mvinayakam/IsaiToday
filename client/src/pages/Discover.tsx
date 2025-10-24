import DiscoverGrid from "@/components/DiscoverGrid";
import { useQuery } from "@tanstack/react-query";
import type { Song, Tag } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface TrendingSong {
  song: Song;
  reactionCount: number;
}

export default function Discover() {
  const { data: trendingData = [], isLoading: trendingLoading } = useQuery<TrendingSong[]>({
    queryKey: ['/api/discover'],
  });

  const { data: tags = [], isLoading: tagsLoading } = useQuery<Tag[]>({
    queryKey: ['/api/tags'],
  });

  const songs = trendingData.map((item) => ({
    youtubeId: item.song.youtubeId,
    title: item.song.title,
    artist: item.song.artist,
    tags: [],
    likes: item.reactionCount,
    plays: 0,
  }));

  const availableTags = tags.map((tag) => tag.name);

  if (trendingLoading || tagsLoading) {
    return (
      <div className="min-h-screen pt-16 md:pt-20">
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 md:px-6 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Discover</h1>
            <p className="text-lg text-muted-foreground">Explore trending songs from around the world</p>
          </div>
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 md:pt-20">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Discover</h1>
          <p className="text-lg text-muted-foreground">Explore trending songs and discover new favorites</p>
        </div>
        
        {songs.length > 0 ? (
          <DiscoverGrid
            songs={songs}
            availableTags={availableTags}
            onSongPlay={(id) => console.log('Play:', id)}
            onSongLike={(id) => console.log('Like:', id)}
            onSongShare={(id) => console.log('Share:', id)}
            onTagFilter={(tag) => console.log('Filter by:', tag)}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <p className="text-muted-foreground text-center py-12">
              No songs yet. Be the first to add a song!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
