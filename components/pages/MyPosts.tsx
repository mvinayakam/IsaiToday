"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import SongCard from "@/components/SongCard";
import type { Song } from "@shared/schema";

interface UserSong {
  song: Song;
  reactionCount: number;
}

export default function MyPosts() {
  const { user, isAuthenticated } = useAuth();

  const { data: userSongs = [], isLoading } = useQuery<UserSong[]>({
    queryKey: ['/api/users', user?.id, 'songs'],
    queryFn: async () => {
      const response = await fetch(`/api/users/${user?.id}/songs`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      return response.json();
    },
    enabled: isAuthenticated && !!user?.id,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-16 md:pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your posts</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 md:pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Posts</h1>
          <p className="text-muted-foreground">
            Songs you've shared with the IsaiToday™ community
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        ) : userSongs.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {userSongs.map(({ song, reactionCount }) => (
              <SongCard
                key={song.id}
                song={song}
                tags={[]}
                likes={reactionCount}
                plays={0}
                currentUserId={user?.id}
                onPlay={() => {}}
                onLike={() => {}}
                onShare={() => {}}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              You haven't posted any songs yet. Share your first song to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
