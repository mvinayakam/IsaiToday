import { Heart, Play, Share2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import YouTubePlayerDialog from "./YouTubePlayerDialog";
import EditSongDialog from "./EditSongDialog";
import type { Song, SongStory, Artist, Tag, User } from "@shared/schema";

interface SongCardProps {
  song: Song;
  story?: SongStory;
  currentUserId?: string;
  poster?: User;
  tags?: string[];
  likes?: number;
  plays?: number;
  isLiked?: boolean;
  onLike?: () => void;
  onPlay?: () => void;
  onShare?: () => void;
  // Player control props
  isPlayerOpen?: boolean;
  onPlayerOpenChange?: (open: boolean) => void;
  playerData?: {
    user?: User;
    artists: string[];
    tags: string[];
  };
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export default function SongCard({
  song,
  story,
  currentUserId,
  poster,
  tags = [],
  likes = 0,
  plays = 0,
  isLiked = false,
  onLike,
  onPlay,
  onShare,
  isPlayerOpen = false,
  onPlayerOpenChange,
  playerData,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false
}: SongCardProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [editOpen, setEditOpen] = useState(false);
  const [currentArtists, setCurrentArtists] = useState<string[]>([]);
  const [currentTags, setCurrentTags] = useState<string[]>(tags);

  const thumbnailUrl = `https://img.youtube.com/vi/${song.youtubeId}/maxresdefault.jpg`;
  const canEdit = currentUserId && song.addedBy === currentUserId;

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    onLike?.();
  };

  const handlePlay = () => {
    onPlay?.();
  };

  const handleEdit = async () => {
    // Fetch current artists and tags before opening dialog
    try {
      const [artistsRes, tagsRes] = await Promise.all([
        fetch(`/api/songs/${song.id}/artists`),
        fetch(`/api/songs/${song.id}/tags`)
      ]);
      const artists: Artist[] = await artistsRes.json();
      const songTags: Tag[] = await tagsRes.json();
      
      setCurrentArtists(artists.map(a => a.name));
      setCurrentTags(songTags.map(t => t.name));
      setEditOpen(true);
    } catch (error) {
      console.error("Error fetching song data:", error);
      setEditOpen(true);
    }
  };

  return (
    <div 
      className="min-w-[240px] max-w-[320px] rounded-xl overflow-hidden backdrop-blur-md bg-card/50 border border-white/10 hover-elevate transition-all duration-200"
      data-testid={`card-song-${song.youtubeId}`}
    >
      <div 
        className="relative aspect-video rounded-t-xl overflow-hidden bg-muted cursor-pointer group"
        onClick={handlePlay}
        data-testid={`thumbnail-${song.youtubeId}`}
      >
        <img 
          src={thumbnailUrl} 
          alt={song.title}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
        {canEdit && (
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit();
            }}
            data-testid={`button-edit-${song.youtubeId}`}
          >
            <Edit className="w-4 h-4" />
          </Button>
        )}
        <Button
          size="icon"
          variant="default"
          className="absolute bottom-2 right-2 transition-transform duration-200 group-hover:scale-110"
          onClick={(e) => {
            e.stopPropagation();
            handlePlay();
          }}
          data-testid={`button-play-${song.youtubeId}`}
        >
          <Play className="w-4 h-4" fill="currentColor" />
        </Button>
      </div>
      
      <YouTubePlayerDialog
        open={isPlayerOpen}
        onOpenChange={onPlayerOpenChange || (() => {})}
        youtubeId={song.youtubeId}
        title={song.title}
        song={song}
        story={story}
        user={playerData?.user}
        artists={playerData?.artists || []}
        tags={playerData?.tags || []}
        onNext={onNext}
        onPrevious={onPrevious}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
      />

      <EditSongDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        song={song}
        userStory={story}
        currentArtists={currentArtists}
        currentTags={currentTags}
      />

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-base line-clamp-2 mb-1" data-testid={`text-title-${song.youtubeId}`}>
            {song.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1" data-testid={`text-artist-${song.youtubeId}`}>
            {song.artist}
          </p>
          {poster && (
            <p className="text-xs text-muted-foreground mt-1">
              Posted by{" "}
              <a 
                href={`/user/${poster.id}`}
                className="text-primary hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                data-testid={`link-poster-${song.youtubeId}`}
              >
                {poster.firstName} {poster.lastName}
              </a>
            </p>
          )}
        </div>

        {story?.story && (
          <div className="pt-2 border-t border-white/5">
            <p className="text-sm italic text-muted-foreground line-clamp-2" data-testid={`text-story-${song.youtubeId}`}>
              "{story.story}"
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
            data-testid={`button-like-${song.youtubeId}`}
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
            data-testid={`button-share-${song.youtubeId}`}
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
