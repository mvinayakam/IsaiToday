"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SongCard from "./SongCard";
import { useState, useEffect } from "react";
import type { Song, SongStory, Artist, Tag, User } from "@shared/schema";

interface FeedSong {
  song: Song;
  poster?: User;
  story?: SongStory;
  tags?: string[];
  likes?: number;
  plays?: number;
  isLiked?: boolean;
}

interface FeedCarouselProps {
  title: string;
  songs: FeedSong[];
  currentUserId?: string;
  onSeeAll?: () => void;
  onSongPlay?: (youtubeId: string) => void;
  onSongLike?: (youtubeId: string) => void;
  onSongShare?: (youtubeId: string) => void;
}

export default function FeedCarousel({
  title,
  songs,
  currentUserId,
  onSeeAll,
  onSongPlay,
  onSongLike,
  onSongShare
}: FeedCarouselProps) {
  const [openPlayerIndex, setOpenPlayerIndex] = useState<number | null>(null);
  const [playerData, setPlayerData] = useState<{user?: User; artists: string[]; tags: string[]}>({
    artists: [],
    tags: []
  });

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
    <section className="py-8 md:py-12" data-testid={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold" data-testid={`heading-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            {title}
          </h2>
          {onSeeAll && (
            <Button 
              variant="ghost" 
              className="gap-1"
              onClick={onSeeAll}
              data-testid="button-see-all"
            >
              <span>See All</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
          {songs.map((item, index) => (
            <div key={item.song.youtubeId} className="snap-start">
              <SongCard
                song={item.song}
                poster={item.poster}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
