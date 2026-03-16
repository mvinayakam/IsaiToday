"use client";

import SongOfTheDay from "@/components/SongOfTheDay";
import FeedCarousel from "@/components/FeedCarousel";
import PlaylistCard from "@/components/PlaylistCard";
import AddSongDialog from "@/components/AddSongDialog";
import CreatePlaylistDialog from "@/components/CreatePlaylistDialog";
import AddToPlaylistDialog from "@/components/AddToPlaylistDialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import type { Song, Playlist, Reaction, User, SongStory } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";
import { Plus } from "lucide-react";

interface FeedItem { reaction: Reaction; song: Song; user: User; poster: User | null; story: SongStory | null; }
interface TrendingSong { song: Song; poster: User | null; reactionCount: number; story: SongStory | null; }
interface SongOfDayData { song: Song; poster: User | null; story: import("@shared/schema").SongStory | null; }

export default function Home() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<{ id: string; title: string } | null>(null);

  const { data: songOfDayData, isLoading: sotdLoading } = useQuery<SongOfDayData>({
    queryKey: ["/api/song-of-day"],
  });

  const { data: feedData = [] } = useQuery<FeedItem[]>({ queryKey: ["/api/feed"] });
  const { data: trendingData = [] } = useQuery<TrendingSong[]>({ queryKey: ["/api/discover"] });
  const { data: playlists = [], isLoading: playlistsLoading } = useQuery<Playlist[]>({
    queryKey: ["/api/playlists"],
    enabled: isAuthenticated,
  });

  const handleLikeSong = async (songId: string) => {
    if (!isAuthenticated) { toast({ title: "Login required", description: "Please log in to like songs" }); return; }
    try {
      await apiRequest("POST", `/api/songs/${songId}/reactions`, { type: "like" });
      toast({ title: "Success", description: "Song liked!" });
    } catch {
      toast({ title: "Error", description: "Failed to like song", variant: "destructive" });
    }
  };

  const handleAddToPlaylist = (songId: string, songTitle: string) => {
    if (!isAuthenticated) { toast({ title: "Login required", description: "Please log in" }); return; }
    setSelectedSong({ id: songId, title: songTitle });
    setPlaylistDialogOpen(true);
  };

  if (authLoading || sotdLoading) {
    return <div className="min-h-screen pt-16 md:pt-20 max-w-4xl mx-auto py-20 px-4"><Skeleton className="h-96 rounded-2xl" /></div>;
  }

  const feedSongs = feedData.map(i => ({ song: i.song, poster: i.poster ?? undefined, story: i.story ?? undefined, tags: [], likes: 0, plays: 0 }));
  const trendingSongs = trendingData.map(i => ({ song: i.song, poster: i.poster ?? undefined, story: i.story ?? undefined, tags: [], likes: i.reactionCount, plays: 0 }));

  return (
    <div className="min-h-screen pt-16 md:pt-20">
      {songOfDayData && (
        <SongOfTheDay
          song={songOfDayData.song}
          poster={songOfDayData.poster ?? undefined}
          story={songOfDayData.story?.story ?? ""}
          storyObj={songOfDayData.story ?? undefined}
          tags={[]}
          likes={0}
          isAuthenticated={isAuthenticated}
          onLike={() => handleLikeSong(songOfDayData.song.id)}
          onAddToPlaylist={() => handleAddToPlaylist(songOfDayData.song.id, songOfDayData.song.title)}
          onShare={() => {}}
          currentUserId={user?.id}
        />
      )}

      {!isAuthenticated && (
        <div className="max-w-2xl mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground mb-4">Sign in to like songs, leave comments, and share your own music</p>
          <Button size="lg" onClick={() => signIn("google")}>Sign in with Google</Button>
        </div>
      )}

      {isAuthenticated && (
        <>
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold">Share Your Music</h2>
                <p className="text-muted-foreground mt-1 text-sm">Add a song you love and tell everyone why it matters to you</p>
              </div>
              <AddSongDialog trigger={
                <Button size="sm" className="shrink-0">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Song
                </Button>
              } />
            </div>
          </div>

          <FeedCarousel title="Your Feed" songs={feedSongs} currentUserId={user?.id} onSeeAll={() => {}} onSongPlay={() => {}} onSongLike={() => {}} onSongShare={() => {}} />
          <FeedCarousel title="Trending Now" songs={trendingSongs} currentUserId={user?.id} onSeeAll={() => {}} onSongPlay={() => {}} onSongLike={() => {}} onSongShare={() => {}} />

          <section className="py-8 md:py-12">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-semibold">Your Playlists</h2>
                <CreatePlaylistDialog />
              </div>
              {playlistsLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-lg" />)}
                </div>
              ) : playlists.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {playlists.map(p => <PlaylistCard key={p.id} id={p.id} title={p.title} songCount={0} onClick={() => {}} onPlay={() => {}} onMore={() => {}} />)}
                </div>
              ) : (
                <p className="text-muted-foreground">No playlists yet. Create your first playlist!</p>
              )}
            </div>
          </section>

          {selectedSong && (
            <AddToPlaylistDialog open={playlistDialogOpen} onOpenChange={setPlaylistDialogOpen} songId={selectedSong.id} songTitle={selectedSong.title} />
          )}
        </>
      )}
    </div>
  );
}
