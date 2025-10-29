import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import type { Song, User, Reaction } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SongCard from "@/components/SongCard";
import { Music, Heart } from "lucide-react";

interface UserSong {
  song: Song;
  reactionCount: number;
}

interface LikedSongWithPoster {
  reaction: Reaction;
  song: Song;
  poster: User | null;
  reactionCount: number;
}

export default function UserProfile() {
  const [, params] = useRoute("/user/:userId");
  const userId = params?.userId;
  const { user: currentUser } = useAuth();

  const { data: profileUser, isLoading: userLoading } = useQuery<User>({
    queryKey: ['/api/users', userId],
    enabled: !!userId,
  });

  const { data: userSongs = [], isLoading: songsLoading } = useQuery<UserSong[]>({
    queryKey: ['/api/users', userId, 'songs'],
    enabled: !!userId,
  });

  const { data: likedSongs = [], isLoading: likesLoading } = useQuery<LikedSongWithPoster[]>({
    queryKey: ['/api/users', userId, 'reactions'],
    enabled: !!userId,
  });

  if (userLoading || songsLoading || likesLoading) {
    return (
      <div className="min-h-screen pt-16 md:pt-20">
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex items-center gap-6 mb-8">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen pt-16 md:pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">User not found</h1>
          <p className="text-muted-foreground">The user you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const userName = `${profileUser.firstName} ${profileUser.lastName}`;
  const userInitials = userName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen pt-16 md:pt-20 pb-20">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* User Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12">
            <Avatar className="w-24 h-24">
              {profileUser.profileImageUrl && <AvatarImage src={profileUser.profileImageUrl} />}
              <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2" data-testid="text-user-name">
                {userName}
              </h1>
              {profileUser.email && (
                <p className="text-lg text-muted-foreground" data-testid="text-user-email">
                  {profileUser.email}
                </p>
              )}
              <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4" />
                  <span data-testid="text-songs-count">{userSongs.length} songs posted</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span data-testid="text-likes-count">{likedSongs.length} songs liked</span>
                </div>
              </div>
            </div>
          </div>

          {/* Posted Songs Section */}
          {userSongs.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Posted Songs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {userSongs.map(({ song, reactionCount }) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    poster={profileUser}
                    tags={[]}
                    likes={reactionCount}
                    plays={0}
                    currentUserId={currentUser?.id}
                    onPlay={() => console.log('Play:', song.id)}
                    onLike={() => console.log('Like:', song.id)}
                    onShare={() => console.log('Share:', song.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Liked Songs Section */}
          {likedSongs.length > 0 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Liked Songs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {likedSongs.map(({ song, poster, reactionCount }) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    poster={poster ?? undefined}
                    tags={[]}
                    likes={reactionCount}
                    plays={0}
                    isLiked={true}
                    currentUserId={currentUser?.id}
                    onPlay={() => console.log('Play:', song.id)}
                    onLike={() => console.log('Like:', song.id)}
                    onShare={() => console.log('Share:', song.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {userSongs.length === 0 && likedSongs.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">This user hasn't posted or liked any songs yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
