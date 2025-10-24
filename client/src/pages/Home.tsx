import SongOfTheDay from "@/components/SongOfTheDay";
import FeedCarousel from "@/components/FeedCarousel";
import PlaylistCard from "@/components/PlaylistCard";
import AddSongDialog from "@/components/AddSongDialog";
import CreatePlaylistDialog from "@/components/CreatePlaylistDialog";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import type { Song, Playlist, Reaction, User, SongStory } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface FeedItem {
  reaction: Reaction;
  song: Song;
  user: User;
  story: SongStory | null;
}

interface TrendingSong {
  song: Song;
  reactionCount: number;
  story: SongStory | null;
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen pt-16 md:pt-20">
      <div className="max-w-4xl mx-auto py-12 md:py-20 px-4">
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    </div>
  );
}

export default function Home() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const { data: songOfDay, isLoading: sotdLoading } = useQuery<Song>({
    queryKey: ['/api/song-of-day'],
    enabled: isAuthenticated,
  });

  const { data: feedData = [], isLoading: feedLoading } = useQuery<FeedItem[]>({
    queryKey: ['/api/feed'],
  });

  const { data: trendingData = [], isLoading: trendingLoading } = useQuery<TrendingSong[]>({
    queryKey: ['/api/discover'],
  });

  const { data: playlists = [], isLoading: playlistsLoading } = useQuery<Playlist[]>({
    queryKey: ['/api/playlists'],
    enabled: isAuthenticated,
  });

  const handleLikeSong = async (songId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please log in to like songs",
      });
      return;
    }

    try {
      await apiRequest('POST', `/api/songs/${songId}/reactions`, { type: 'like' });
      toast({
        title: "Success",
        description: "Song liked!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like song",
        variant: "destructive",
      });
    }
  };

  if (authLoading || sotdLoading) {
    return <LoadingSkeleton />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-16 md:pt-20 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to IsaiToday™</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Discover and share the stories behind your favorite songs
          </p>
          <Button
            size="lg"
            onClick={() => window.location.href = getLoginUrl()}
            data-testid="button-login"
          >
            Login with Google
          </Button>
        </div>
      </div>
    );
  }

  const feedSongs = feedData.map((item) => ({
    song: item.song,
    story: item.story ?? undefined,
    tags: [],
    likes: 0,
    plays: 0,
  }));

  const trendingSongs = trendingData.map((item) => ({
    song: item.song,
    story: item.story ?? undefined,
    tags: [],
    likes: item.reactionCount,
    plays: 0,
  }));

  return (
    <div className="min-h-screen pt-16 md:pt-20">
      {songOfDay && (
        <SongOfTheDay
          youtubeId={songOfDay.youtubeId}
          title={songOfDay.title}
          artist={songOfDay.artist}
          story="This is your song of the day! Share why you love it."
          tags={[]}
          likes={0}
          onLike={() => handleLikeSong(songOfDay.id)}
          onAddToPlaylist={() => console.log('Add to playlist')}
          onShare={() => console.log('Share SOTD')}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold">Share Your Music</h2>
          <AddSongDialog />
        </div>
        <p className="text-muted-foreground mb-8">
          Add a song you love and tell everyone why it matters to you
        </p>
      </div>

      <FeedCarousel
        title="Your Feed"
        songs={feedSongs}
        currentUserId={user?.id}
        onSeeAll={() => console.log('See all feed')}
        onSongPlay={(id) => console.log('Play:', id)}
        onSongLike={(id) => console.log('Like:', id)}
        onSongShare={(id) => console.log('Share:', id)}
      />

      <FeedCarousel
        title="Trending Now"
        songs={trendingSongs}
        currentUserId={user?.id}
        onSeeAll={() => console.log('See all trending')}
        onSongPlay={(id) => console.log('Play:', id)}
        onSongLike={(id) => console.log('Like:', id)}
        onSongShare={(id) => console.log('Share:', id)}
      />

      {isAuthenticated && (
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-semibold">Your Playlists</h2>
              <CreatePlaylistDialog />
            </div>
            {playlistsLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-32 rounded-lg" />
                ))}
              </div>
            ) : playlists.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {playlists.map((playlist) => (
                  <PlaylistCard
                    key={playlist.id}
                    id={playlist.id}
                    title={playlist.title}
                    songCount={0}
                    onClick={() => console.log('Open playlist:', playlist.id)}
                    onPlay={() => console.log('Play playlist:', playlist.id)}
                    onMore={() => console.log('More options:', playlist.id)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No playlists yet. Create your first playlist!</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
