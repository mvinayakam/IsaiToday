"use client";

import { Music2, Play, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlaylistCardProps {
  id: string;
  title: string;
  songCount: number;
  coverImage?: string;
  onClick?: () => void;
  onPlay?: () => void;
  onMore?: () => void;
}

export default function PlaylistCard({
  id,
  title,
  songCount,
  coverImage,
  onClick,
  onPlay,
  onMore
}: PlaylistCardProps) {
  return (
    <div
      className="min-w-[200px] max-w-[280px] rounded-xl backdrop-blur-md bg-card/50 border border-white/10 overflow-hidden hover-elevate transition-all duration-200 cursor-pointer"
      onClick={onClick}
      data-testid={`card-playlist-${id}`}
    >
      <div className="relative aspect-square bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
        {coverImage ? (
          <img src={coverImage} alt={title} className="w-full h-full object-cover" />
        ) : (
          <Music2 className="w-16 h-16 text-primary/50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <Button
          size="icon"
          variant="default"
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onPlay?.();
          }}
          data-testid={`button-play-playlist-${id}`}
        >
          <Play className="w-4 h-4" fill="currentColor" />
        </Button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate mb-1" data-testid={`text-playlist-title-${id}`}>
              {title}
            </h3>
            <p className="text-sm text-muted-foreground" data-testid={`text-playlist-count-${id}`}>
              {songCount} {songCount === 1 ? 'song' : 'songs'}
            </p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="w-8 h-8"
            onClick={(e) => {
              e.stopPropagation();
              onMore?.();
            }}
            data-testid={`button-more-playlist-${id}`}
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
