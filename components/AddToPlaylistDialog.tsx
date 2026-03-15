"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Music, Loader2 } from "lucide-react";
import type { Playlist } from "@shared/schema";
import CreatePlaylistDialog from "./CreatePlaylistDialog";

interface AddToPlaylistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  songId: string;
  songTitle: string;
}

export default function AddToPlaylistDialog({ 
  open, 
  onOpenChange, 
  songId, 
  songTitle 
}: AddToPlaylistDialogProps) {
  const { toast } = useToast();
  const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false);

  // Fetch user's playlists
  const { data: playlists = [], isLoading } = useQuery<Playlist[]>({
    queryKey: ['/api/playlists'],
    enabled: open,
    refetchOnMount: 'always',
    staleTime: 0,
  });

  // Add song to playlist mutation
  const addToPlaylistMutation = useMutation({
    mutationFn: async (playlistId: string) => {
      // Get the current playlist to calculate the next order
      const response = await fetch(`/api/playlists/${playlistId}/songs`);
      const existingSongs = await response.json();
      const nextOrder = existingSongs.length;

      return await apiRequest("POST", `/api/playlists/${playlistId}/songs`, {
        songId,
        order: nextOrder,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/playlists'] });
      toast({
        title: "Added to playlist",
        description: `"${songTitle}" has been added to your playlist`,
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add song to playlist",
        variant: "destructive",
      });
    },
  });

  const handleAddToPlaylist = (playlistId: string) => {
    addToPlaylistMutation.mutate(playlistId);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add to Playlist</DialogTitle>
            <DialogDescription>
              Choose a playlist for "{songTitle}"
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : playlists.length > 0 ? (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-2">
                  {playlists.map((playlist) => (
                    <button
                      key={playlist.id}
                      onClick={() => handleAddToPlaylist(playlist.id)}
                      disabled={addToPlaylistMutation.isPending}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border hover-elevate active-elevate-2 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                      data-testid={`button-playlist-${playlist.id}`}
                    >
                      <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0">
                        <Music className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{playlist.title}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  You don't have any playlists yet
                </p>
              </div>
            )}

            <div className="pt-4 border-t">
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => {
                  setCreatePlaylistOpen(true);
                  onOpenChange(false);
                }}
                data-testid="button-create-new-playlist"
              >
                <Plus className="w-4 h-4" />
                Create New Playlist
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CreatePlaylistDialog 
        open={createPlaylistOpen}
        onOpenChange={setCreatePlaylistOpen}
        onSuccess={() => {
          // Re-open AddToPlaylistDialog after successful playlist creation
          setTimeout(() => onOpenChange(true), 100);
        }}
      />
    </>
  );
}
