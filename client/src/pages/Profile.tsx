import ProfileSection from "@/components/ProfileSection";
import FeedCarousel from "@/components/FeedCarousel";
import PlaylistCard from "@/components/PlaylistCard";
import CreatePlaylistDialog from "@/components/CreatePlaylistDialog";
import { useAuth, getLogoutUrl } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import type { Reaction, Song, Playlist } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface ReactionWithSongAndCount {
  reaction: Reaction;
  song: Song;
  reactionCount: number;
}

export default function Profile() {
  const { user, isAuthenticated } = useAuth();

  const { data: reactionsWithSongs = [], isLoading: reactionsLoading } = useQuery<ReactionWithSongAndCount[]>({
    queryKey: [`/api/users/${user?.id}/reactions`],
    enabled: isAuthenticated && !!user,
  });

  const { data: playlists = [], isLoading: playlistsLoading } = useQuery<Playlist[]>({
    queryKey: ['/api/playlists'],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen pt-16 md:pt-20 flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Please log in to view your profile</p>
      </div>
    );
  }

  const name = `${user.firstName} ${user.lastName}`;
  
  const likedSongs = reactionsWithSongs.map((item) => ({
    youtubeId: item.song.youtubeId,
    title: item.song.title,
    artist: item.song.artist,
    story: "Liked this song",
    sharedBy: name,
    tags: [],
    likes: item.reactionCount,
    plays: 0,
    isLiked: true,
  }));

  return (
    <div className="min-h-screen pt-16 md:pt-20">
      <div className="py-12">
        <ProfileSection
          avatar={user.profileImageUrl ?? undefined}
          name={name}
          email={user.email ?? ""}
          tags={[]}
          stats={{
            songsLiked: reactionsWithSongs.length,
            playlists: playlists.length,
            following: 0
          }}
          onEditProfile={() => console.log('Edit profile')}
          onLogout={() => window.location.href = getLogoutUrl()}
        />
      </div>

      {reactionsLoading ? (
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <Skeleton className="h-64 rounded-lg" />
          </div>
        </div>
      ) : likedSongs.length > 0 ? (
        <FeedCarousel
          title="Recently Liked"
          songs={likedSongs}
          onSeeAll={() => console.log('See all liked')}
          onSongPlay={(id) => console.log('Play:', id)}
          onSongLike={(id) => console.log('Unlike:', id)}
          onSongShare={(id) => console.log('Share:', id)}
        />
      ) : null}

      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-semibold">My Playlists</h2>
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
    </div>
  );
}
