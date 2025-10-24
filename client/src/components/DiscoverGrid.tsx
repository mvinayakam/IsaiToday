import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SongCard from "./SongCard";
import { useState } from "react";
import type { Song, SongStory } from "@shared/schema";

interface DiscoverSong {
  song: Song;
  story?: SongStory;
  tags?: string[];
  likes?: number;
  plays?: number;
  isLiked?: boolean;
}

interface DiscoverGridProps {
  songs: DiscoverSong[];
  currentUserId?: string;
  availableTags?: string[];
  onSongPlay?: (youtubeId: string) => void;
  onSongLike?: (youtubeId: string) => void;
  onSongShare?: (youtubeId: string) => void;
  onTagFilter?: (tag: string) => void;
}

export default function DiscoverGrid({
  songs,
  currentUserId,
  availableTags = [],
  onSongPlay,
  onSongLike,
  onSongShare,
  onTagFilter
}: DiscoverGridProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleTagClick = (tag: string) => {
    const newTag = selectedTag === tag ? null : tag;
    setSelectedTag(newTag);
    onTagFilter?.(tag);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      {availableTags.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filter by tag</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "secondary"}
                className="px-3 py-1.5 cursor-pointer hover-elevate"
                onClick={() => handleTagClick(tag)}
                data-testid={`badge-filter-${tag}`}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {songs.map((item) => (
          <SongCard
            key={item.song.youtubeId}
            song={item.song}
            story={item.story}
            tags={item.tags}
            likes={item.likes}
            plays={item.plays}
            isLiked={item.isLiked}
            currentUserId={currentUserId}
            onPlay={() => onSongPlay?.(item.song.youtubeId)}
            onLike={() => onSongLike?.(item.song.youtubeId)}
            onShare={() => onSongShare?.(item.song.youtubeId)}
          />
        ))}
      </div>

      {songs.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">No songs found</p>
        </div>
      )}
    </div>
  );
}
