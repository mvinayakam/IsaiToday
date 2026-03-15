"use client";

import ProfileSection from "@/components/ProfileSection";
import FeedCarousel from "@/components/FeedCarousel";
import PlaylistCard from "@/components/PlaylistCard";
import CreatePlaylistDialog from "@/components/CreatePlaylistDialog";
import EditProfileDialog from "@/components/EditProfileDialog";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import type { Reaction, Song, Playlist } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { signIn, signOut } from "next-auth/react";

interface ReactionWithSongAndCount {
  reaction: Reaction;
  song: Song;
  reactionCount: number;
}

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

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
        <div className="max-w-md mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Your Profile</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Sign in to view your profile, liked songs, and playlists
          </p>
          <Button size="lg" onClick={() => signIn("google")}>
            Login with Google
          </Button>
        </div>
      </div>
    );
  }

  const name = `${user.firstName} ${user.lastName}`;

  const likedSongs = reactionsWithSongs.map((item) => ({
    song: item.song,
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
            following: 0,
          }}
          onEditProfile={() => setEditDialogOpen(true)}
          onLogout={() => signOut({ callbackUrl: "/" })}
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
          onSeeAll={() => {}}
          onSongPlay={() => {}}
          onSongLike={() => {}}
          onSongShare={() => {}}
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
                  onClick={() => {}}
                  onPlay={() => {}}
                  onMore={() => {}}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No playlists yet. Create your first playlist!</p>
          )}
        </div>
      </section>

      <EditProfileDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        currentFirstName={user.firstName}
        currentLastName={user.lastName}
        currentProfileImageUrl={user.profileImageUrl}
      />
    </div>
  );
}
