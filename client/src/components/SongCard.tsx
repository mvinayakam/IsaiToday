import { Heart, Play, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import YouTubePlayerDialog from "./YouTubePlayerDialog";

interface SongCardProps {
  youtubeId: string;
  title: string;
  artist: string;
  story?: string;
  sharedBy?: string;
  tags?: string[];
  likes?: number;
  plays?: number;
  isLiked?: boolean;
  onLike?: () => void;
  onPlay?: () => void;
  onShare?: () => void;
}

export default function SongCard({
  youtubeId,
  title,
  artist,
  story,
  sharedBy,
  tags = [],
  likes = 0,
  plays = 0,
  isLiked = false,
  onLike,
  onPlay,
  onShare
}: SongCardProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [playerOpen, setPlayerOpen] = useState(false);

  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    onLike?.();
  };

  const handlePlay = () => {
    setPlayerOpen(true);
    onPlay?.();
  };

  return (
    <div 
      className="min-w-[240px] max-w-[320px] rounded-xl overflow-hidden backdrop-blur-md bg-card/50 border border-white/10 hover-elevate transition-all duration-200"
      data-testid={`card-song-${youtubeId}`}
    >
      <div 
        className="relative aspect-video rounded-t-xl overflow-hidden bg-muted cursor-pointer group"
        onClick={handlePlay}
        data-testid={`thumbnail-${youtubeId}`}
      >
        <img 
          src={thumbnailUrl} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
        <Button
          size="icon"
          variant="default"
          className="absolute bottom-2 right-2 transition-transform duration-200 group-hover:scale-110"
          onClick={(e) => {
            e.stopPropagation();
            handlePlay();
          }}
          data-testid={`button-play-${youtubeId}`}
        >
          <Play className="w-4 h-4" fill="currentColor" />
        </Button>
      </div>
      
      <YouTubePlayerDialog
        open={playerOpen}
        onOpenChange={setPlayerOpen}
        youtubeId={youtubeId}
        title={title}
      />

      <div className="p-4 space-y-3">
        <div>
          {sharedBy && (
            <p className="text-xs text-muted-foreground mb-1">
              Shared by {sharedBy}
            </p>
          )}
          <h3 className="font-semibold text-base line-clamp-2 mb-1" data-testid={`text-title-${youtubeId}`}>
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1" data-testid={`text-artist-${youtubeId}`}>
            {artist}
          </p>
        </div>

        {story && (
          <div className="pt-2 border-t border-white/5">
            <p className="text-sm italic text-muted-foreground line-clamp-2" data-testid={`text-story-${youtubeId}`}>
              "{story}"
            </p>
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs px-2 py-0"
                data-testid={`badge-tag-${tag}`}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2 border-t border-white/5">
          <Button
            size="sm"
            variant="ghost"
            className="gap-1.5 px-2"
            onClick={handleLike}
            data-testid={`button-like-${youtubeId}`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-primary text-primary' : ''}`} />
            <span className="text-xs">{likeCount}</span>
          </Button>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Play className="w-4 h-4" />
            <span className="text-xs">{plays}</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="ml-auto px-2"
            onClick={onShare}
            data-testid={`button-share-${youtubeId}`}
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
