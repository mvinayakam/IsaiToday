import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SongCard from "./SongCard";
import type { Song, SongStory } from "@shared/schema";

interface FeedSong {
  song: Song;
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
          {songs.map((item) => (
            <div key={item.song.youtubeId} className="snap-start">
              <SongCard
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
