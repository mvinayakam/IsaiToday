"use client";

import DiscoverGrid from "@/components/DiscoverGrid";
import TagCloud from "@/components/TagCloud";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import type { Song, Tag, SongStory, User } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { signIn } from "next-auth/react";

interface TrendingSong { song: Song; reactionCount: number; story: SongStory | null; poster: User | null; }
interface TagCloudItem { id: string; name: string; count: number; }

export default function Discover() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [selectedCloudTag, setSelectedCloudTag] = useState<string | null>(null);

  const { data: trendingData = [], isLoading: trendingLoading } = useQuery<TrendingSong[]>({ queryKey: ["/api/discover"] });
  const { data: tags = [], isLoading: tagsLoading } = useQuery<Tag[]>({ queryKey: ["/api/tags"] });
  const { data: tagCloud = [] } = useQuery<TagCloudItem[]>({ queryKey: ["/api/tags/cloud"], enabled: isAuthenticated });

  const songs = trendingData.map(i => ({ song: i.song, story: i.story ?? undefined, poster: i.poster ?? undefined, tags: [], likes: i.reactionCount, plays: 0 }));
  const availableTags = tags.map(t => t.name);

  if (authLoading || trendingLoading || tagsLoading) {
    return (
      <div className="min-h-screen pt-16 md:pt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Discover</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-64 rounded-lg" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-16 md:pt-20 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Discover Music</h1>
          <p className="text-lg text-muted-foreground mb-8">Sign in to explore trending songs</p>
          <Button size="lg" onClick={() => signIn("google")}>Sign in with Google</Button>
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

        {tagCloud.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-center">Explore by Tag</h2>
            <TagCloud tags={tagCloud} onTagClick={tag => setSelectedCloudTag(selectedCloudTag === tag ? null : tag)} />
          </div>
        )}

        {songs.length > 0 ? (
          <DiscoverGrid songs={songs} currentUserId={user?.id} availableTags={availableTags} selectedCloudTag={selectedCloudTag}
            onSongPlay={() => {}} onSongLike={() => {}} onSongShare={() => {}} onTagFilter={() => {}} />
        ) : (
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <p className="text-muted-foreground text-center py-12">No songs yet. Be the first to add a song!</p>
          </div>
        )}
      </div>
    </div>
  );
}
