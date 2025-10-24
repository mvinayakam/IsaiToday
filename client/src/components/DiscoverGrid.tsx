import { Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SongCard from "./SongCard";
import { useState, useEffect } from "react";
import type { Song, SongStory, Artist, Tag, User } from "@shared/schema";

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
  const [openPlayerIndex, setOpenPlayerIndex] = useState<number | null>(null);
  const [playerData, setPlayerData] = useState<{user?: User; artists: string[]; tags: string[]}>({
    artists: [],
    tags: []
  });

  const handleTagClick = (tag: string) => {
    const newTag = selectedTag === tag ? null : tag;
    setSelectedTag(newTag);
    onTagFilter?.(tag);
  };

  // Fetch data when player index changes
  useEffect(() => {
    if (openPlayerIndex !== null && songs[openPlayerIndex]) {
      const currentSong = songs[openPlayerIndex];
      
      const fetchPlayerData = async () => {
        try {
          const promises = [
            fetch(`/api/songs/${currentSong.song.id}/artists`).then(r => r.json()),
            fetch(`/api/songs/${currentSong.song.id}/tags`).then(r => r.json())
          ];
          
          if (currentSong.story?.userId) {
            promises.push(
              fetch(`/api/users/${currentSong.story.userId}`).then(r => r.json())
            );
          }
          
          const results = await Promise.all(promises);
          const artists: Artist[] = results[0];
          const songTags: Tag[] = results[1];
          const user: User | undefined = results[2];
          
          setPlayerData({
            user,
            artists: artists.map(a => a.name),
            tags: songTags.map(t => t.name)
          });
        } catch (error) {
          console.error("Error fetching player data:", error);
        }
      };
      
      fetchPlayerData();
    }
  }, [openPlayerIndex, songs]);

  const handleOpenPlayer = (index: number) => {
    setOpenPlayerIndex(index);
    const song = songs[index];
    if (song) {
      onSongPlay?.(song.song.youtubeId);
    }
  };

  const handleNext = () => {
    if (openPlayerIndex !== null && openPlayerIndex < songs.length - 1) {
      setOpenPlayerIndex(openPlayerIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (openPlayerIndex !== null && openPlayerIndex > 0) {
      setOpenPlayerIndex(openPlayerIndex - 1);
    }
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
        {songs.map((item, index) => (
          <SongCard
            key={item.song.youtubeId}
            song={item.song}
            story={item.story}
            tags={item.tags}
            likes={item.likes}
            plays={item.plays}
            isLiked={item.isLiked}
            currentUserId={currentUserId}
            onPlay={() => handleOpenPlayer(index)}
            onLike={() => onSongLike?.(item.song.youtubeId)}
            onShare={() => onSongShare?.(item.song.youtubeId)}
            isPlayerOpen={openPlayerIndex === index}
            onPlayerOpenChange={(open) => !open && setOpenPlayerIndex(null)}
            playerData={openPlayerIndex === index ? playerData : undefined}
            onNext={songs.length > 1 ? handleNext : undefined}
            onPrevious={songs.length > 1 ? handlePrevious : undefined}
            hasNext={index < songs.length - 1}
            hasPrevious={index > 0}
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
