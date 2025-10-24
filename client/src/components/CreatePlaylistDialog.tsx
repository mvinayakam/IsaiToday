import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import type { Song } from "@shared/schema";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface CreatePlaylistDialogProps {
  trigger?: React.ReactNode;
}

export default function CreatePlaylistDialog({ trigger }: CreatePlaylistDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch all songs to check if we have 50+
  const { data: songs = [] } = useQuery<Song[]>({
    queryKey: ['/api/songs'],
  });

  const canCreatePlaylist = songs.length >= 50;
  const songsNeeded = Math.max(0, 50 - songs.length);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter a playlist title",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await apiRequest("POST", "/api/playlists", { title: title.trim() });

      queryClient.invalidateQueries({ queryKey: ["/api/playlists"] });

      toast({
        title: "Success!",
        description: "Your playlist has been created",
      });

      setTitle("");
      setOpen(false);
    } catch (error: any) {
      const errorMessage = error.message || "Failed to create playlist";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const buttonContent = trigger || (
    <Button 
      size="default"
      disabled={!canCreatePlaylist}
      data-testid="button-create-playlist"
    >
      <Plus className="w-4 h-4 mr-2" />
      Create Playlist
    </Button>
  );

  if (!canCreatePlaylist) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span role="presentation" className="inline-block">
            {buttonContent}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Playlist creation requires at least 50 songs</p>
          <p className="text-xs text-muted-foreground mt-1">
            {songsNeeded} more {songsNeeded === 1 ? 'song' : 'songs'} needed ({songs.length}/50)
          </p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {buttonContent}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Playlist</DialogTitle>
          <DialogDescription>
            Give your new playlist a name
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="playlist-title">Playlist Name</Label>
            <Input
              id="playlist-title"
              type="text"
              placeholder="My Awesome Playlist"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="input-playlist-title"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              data-testid="button-submit-playlist"
            >
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
