import { Heart, ListPlus, Share2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface SongOfTheDayProps {
  youtubeId: string;
  title: string;
  artist: string;
  story?: string;
  tags?: string[];
  likes?: number;
  isLiked?: boolean;
  onLike?: () => void;
  onAddToPlaylist?: () => void;
  onShare?: () => void;
}

export default function SongOfTheDay({
  youtubeId,
  title,
  artist,
  story,
  tags = [],
  likes = 0,
  isLiked = false,
  onLike,
  onAddToPlaylist,
  onShare
}: SongOfTheDayProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    onLike?.();
  };

  const embedUrl = `https://www.youtube.com/embed/${youtubeId}?controls=1&modestbranding=1`;

  return (
    <div className="max-w-4xl mx-auto py-12 md:py-20 px-4" data-testid="section-song-of-day">
      <div className="text-center mb-8">
        <Badge variant="default" className="mb-4 text-sm px-4 py-1.5">
          Song of the Day
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2" data-testid="text-sotd-title">
          {title}
        </h1>
        <p className="text-xl text-muted-foreground mb-4" data-testid="text-sotd-artist">{artist}</p>
        
        {story && (
          <div className="max-w-2xl mx-auto">
            <p className="text-sm font-medium text-muted-foreground mb-2">Why I love this song</p>
            <p className="text-lg leading-relaxed" data-testid="text-sotd-story">
              "{story}"
            </p>
          </div>
        )}
      </div>

      <div className="backdrop-blur-md bg-card/50 border border-white/10 rounded-2xl p-6 md:p-12 shadow-xl">
        <div className="aspect-video rounded-xl overflow-hidden mb-6 bg-muted">
          <iframe
            width="100%"
            height="100%"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            data-testid="iframe-youtube"
          />
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="px-3 py-1 cursor-pointer hover-elevate"
                data-testid={`badge-tag-${tag}`}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="default"
            className="gap-2"
            onClick={handleLike}
            data-testid="button-like-sotd"
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-white' : ''}`} />
            <span>{liked ? 'Liked' : 'Like'} ({likeCount})</span>
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={onAddToPlaylist}
            data-testid="button-add-playlist"
          >
            <ListPlus className="w-4 h-4" />
            <span>Add to Playlist</span>
          </Button>
          <Button
            variant="ghost"
            className="gap-2"
            onClick={onShare}
            data-testid="button-share-sotd"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
