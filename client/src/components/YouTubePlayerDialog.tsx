import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Song, SongStory, User } from "@shared/schema";

interface YouTubePlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  youtubeId: string;
  title: string;
  song?: Song;
  story?: SongStory;
  user?: User;
  artists?: string[];
  tags?: string[];
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export default function YouTubePlayerDialog({
  open,
  onOpenChange,
  youtubeId,
  title,
  song,
  story,
  user,
  artists = [],
  tags = [],
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false,
}: YouTubePlayerDialogProps) {
  const embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&controls=1&modestbranding=1`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden" data-testid="dialog-youtube-player">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        
        <div className="grid md:grid-cols-5 gap-0 h-full">
          {/* Video Section - 3/5 width */}
          <div className="md:col-span-3 relative bg-black flex items-center justify-center">
            <div className="aspect-video w-full">
              <iframe
                width="100%"
                height="100%"
                src={open ? embedUrl : ""}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                data-testid="iframe-youtube-player"
              />
            </div>

            {/* Navigation Arrows */}
            {hasPrevious && (
              <Button
                size="icon"
                variant="secondary"
                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onPrevious?.();
                }}
                data-testid="button-previous-song"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}
            {hasNext && (
              <Button
                size="icon"
                variant="secondary"
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onNext?.();
                }}
                data-testid="button-next-song"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Story & Metadata Section - 2/5 width */}
          <div className="md:col-span-2 flex flex-col bg-card/95 backdrop-blur-sm overflow-y-auto">
            {/* Header with Close Button */}
            <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-white/10 p-4 flex justify-end z-10">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                data-testid="button-close-player"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Song Title */}
              <div>
                <h2 className="text-2xl font-bold mb-2" data-testid="text-player-title">
                  {title}
                </h2>
                {artists.length > 0 && (
                  <p className="text-lg text-muted-foreground" data-testid="text-player-artists">
                    {artists.join(", ")}
                  </p>
                )}
              </div>

              {/* User Story - Most Important */}
              {story && user && (
                <div className="space-y-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10" data-testid="avatar-story-user">
                      <AvatarImage src={user.profileImageUrl || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium" data-testid="text-story-user-name">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">shared their story</p>
                    </div>
                  </div>
                  <p className="text-base leading-relaxed italic" data-testid="text-player-story">
                    "{story.story}"
                  </p>
                </div>
              )}

              {/* Song Metadata */}
              <div className="space-y-4">
                {song?.album && (
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      Album
                    </h3>
                    <p className="text-sm" data-testid="text-player-album">{song.album}</p>
                  </div>
                )}

                {song?.language && (
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      Language
                    </h3>
                    <p className="text-sm" data-testid="text-player-language">{song.language}</p>
                  </div>
                )}

                {tags.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2" data-testid="container-player-tags">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs" data-testid={`badge-player-tag-${tag}`}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Context */}
              {song?.createdAt && (
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-muted-foreground">
                    Added {new Date(song.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
