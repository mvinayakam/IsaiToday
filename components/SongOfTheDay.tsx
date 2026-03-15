"use client";

import { Heart, ListPlus, Share2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Link from "next/link";
import YouTubePlayerDialog from "./YouTubePlayerDialog";
import type { Song, User, SongStory } from "@shared/schema";

interface SongOfTheDayProps {
  song: Song;
  poster?: User;
  story?: string;
  tags?: string[];
  likes?: number;
  isLiked?: boolean;
  onLike?: () => void;
  onAddToPlaylist?: () => void;
  onShare?: () => void;
  currentUserId?: string;
  storyObj?: SongStory;
}

export default function SongOfTheDay({
  song,
  poster,
  story,
  tags = [],
  likes = 0,
  isLiked = false,
  onLike,
  onAddToPlaylist,
  onShare,
  currentUserId,
  storyObj
}: SongOfTheDayProps) {
  const { youtubeId, title, artist } = song;
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [playerOpen, setPlayerOpen] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    onLike?.();
  };

  const handlePlay = () => {
    setPlayerOpen(true);
  };

  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;

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
        
        {poster && (
          <div className="mb-4">
            <Link href={`/user/${poster.id}`} prefetch={false} className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid={`link-sotd-poster-${poster.id}`}>
              Posted by {poster.firstName} {poster.lastName}
            </Link>
          </div>
        )}
        
        {story && (
          <div className="max-w-2xl mx-auto">
            <p className="text-sm font-medium text-muted-foreground mb-2">Why I love this song</p>
            <p className="text-lg leading-relaxed" data-testid="text-sotd-story">
              "{story}"
            </p>
          </div>
        )}
      </div>

      <YouTubePlayerDialog
        open={playerOpen}
        onOpenChange={setPlayerOpen}
        youtubeId={youtubeId}
        title={title}
        song={song}
        story={storyObj}
        user={poster}
        artists={[artist]}
        tags={tags}
        currentUserId={currentUserId}
      />

      <div className="backdrop-blur-md bg-card/50 border border-white/10 rounded-2xl p-6 md:p-12 shadow-xl">
        <div 
          className="aspect-video rounded-xl overflow-hidden mb-6 bg-muted cursor-pointer group relative"
          onClick={handlePlay}
          data-testid="thumbnail-sotd"
        >
          <img 
            src={thumbnailUrl} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
          <Button
            size="icon"
            variant="default"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 transition-transform duration-200 group-hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              handlePlay();
            }}
            data-testid="button-play-sotd"
          >
            <Play className="w-8 h-8" fill="currentColor" />
          </Button>
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
