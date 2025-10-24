import { Heart, Play, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface SongCardProps {
  youtubeId: string;
  title: string;
  artist: string;
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

  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    onLike?.();
  };

  return (
    <div 
      className="min-w-[240px] max-w-[320px] rounded-xl overflow-hidden backdrop-blur-md bg-card/50 border border-white/10 hover-elevate transition-all duration-200"
      data-testid={`card-song-${youtubeId}`}
    >
      <div className="relative aspect-video rounded-t-xl overflow-hidden bg-muted">
        <img 
          src={thumbnailUrl} 
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Button
          size="icon"
          variant="default"
          className="absolute bottom-2 right-2"
          onClick={onPlay}
          data-testid={`button-play-${youtubeId}`}
        >
          <Play className="w-4 h-4" fill="currentColor" />
        </Button>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-base line-clamp-2 mb-1" data-testid={`text-title-${youtubeId}`}>
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1" data-testid={`text-artist-${youtubeId}`}>
            {artist}
          </p>
        </div>

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
