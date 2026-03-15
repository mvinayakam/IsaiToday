"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Album, Language, Artist, Tag, Song, SongStory } from "@shared/schema";

interface EditSongDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  song: Song;
  userStory?: SongStory;
  currentArtists?: string[];
  currentTags?: string[];
}

export default function EditSongDialog({
  open,
  onOpenChange,
  song,
  userStory,
  currentArtists = [],
  currentTags = [],
}: EditSongDialogProps) {
  const [title, setTitle] = useState(song.title);
  const [album, setAlbum] = useState(song.album || "");
  const [language, setLanguage] = useState(song.language || "");
  const [artistInput, setArtistInput] = useState("");
  const [selectedArtists, setSelectedArtists] = useState<string[]>(currentArtists);
  const [tagInput, setTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(currentTags);
  const [story, setStory] = useState(userStory?.story || "");
  
  const [albumSuggestions, setAlbumSuggestions] = useState<Album[]>([]);
  const [languageSuggestions, setLanguageSuggestions] = useState<Language[]>([]);
  const [artistSuggestions, setArtistSuggestions] = useState<Artist[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<Tag[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Reset form when song changes or dialog opens
  useEffect(() => {
    if (open) {
      setTitle(song.title);
      setAlbum(song.album || "");
      setLanguage(song.language || "");
      setSelectedArtists(currentArtists);
      setSelectedTags(currentTags);
      setStory(userStory?.story || "");
    }
  }, [open, song, userStory, currentArtists, currentTags]);

  // Fetch album suggestions
  useEffect(() => {
    if (album.length > 1) {
      fetch(`/api/albums/search?q=${encodeURIComponent(album)}`)
        .then(res => res.json())
        .then(setAlbumSuggestions)
        .catch(() => setAlbumSuggestions([]));
    } else {
      setAlbumSuggestions([]);
    }
  }, [album]);

  // Fetch language suggestions
  useEffect(() => {
    if (language.length > 1) {
      fetch(`/api/languages/search?q=${encodeURIComponent(language)}`)
        .then(res => res.json())
        .then(setLanguageSuggestions)
        .catch(() => setLanguageSuggestions([]));
    } else {
      setLanguageSuggestions([]);
    }
  }, [language]);

  // Fetch artist suggestions
  useEffect(() => {
    if (artistInput.length > 1) {
      fetch(`/api/artists/search?q=${encodeURIComponent(artistInput)}`)
        .then(res => res.json())
        .then(setArtistSuggestions)
        .catch(() => setArtistSuggestions([]));
    } else {
      setArtistSuggestions([]);
    }
  }, [artistInput]);

  // Fetch all tags
  useEffect(() => {
    fetch('/api/tags')
      .then(res => res.json())
      .then(setTagSuggestions)
      .catch(() => setTagSuggestions([]));
  }, []);

  const addArtist = (name: string) => {
    if (name.trim() && !selectedArtists.includes(name.trim())) {
      setSelectedArtists([...selectedArtists, name.trim()]);
      setArtistInput("");
      setArtistSuggestions([]);
    }
  };

  const removeArtist = (name: string) => {
    setSelectedArtists(selectedArtists.filter(a => a !== name));
  };

  const addTag = (name: string) => {
    if (name.trim() && !selectedTags.includes(name.trim())) {
      setSelectedTags([...selectedTags, name.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (name: string) => {
    setSelectedTags(selectedTags.filter(t => t !== name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || selectedArtists.length === 0 || selectedTags.length === 0 || !story) {
      toast({
        title: "Missing required fields",
        description: "Please fill in title, at least one artist, at least one tag, and your story",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Update basic song info
      await apiRequest("PUT", `/api/songs/${song.id}`, {
        title,
        artist: selectedArtists[0], // Keep first artist for backward compatibility
        album: album.trim() || null,
        language: language.trim() || null,
      });

      // Get current artists linked to song
      const currentLinkedArtists = await fetch(`/api/songs/${song.id}/artists`).then(r => r.json());
      const currentArtistNames = currentLinkedArtists.map((a: Artist) => a.name);

      // Remove artists that are no longer selected
      for (const artistName of currentArtistNames) {
        if (!selectedArtists.includes(artistName)) {
          const artist = currentLinkedArtists.find((a: Artist) => a.name === artistName);
          if (artist) {
            await apiRequest("DELETE", `/api/songs/${song.id}/artists/${artist.id}`).catch(() => {});
          }
        }
      }

      // Add new artists
      for (const artistName of selectedArtists) {
        const artistRes = await apiRequest("POST", "/api/artists", { name: artistName });
        const artist = await artistRes.json();
        
        await apiRequest("POST", `/api/songs/${song.id}/artists`, {
          songId: song.id,
          artistId: artist.id,
        }).catch(() => {}); // Ignore if already linked
      }

      // Update story
      if (userStory) {
        await apiRequest("PUT", `/api/songs/${song.id}/stories/${userStory.id}`, { story });
      }

      // Get current tags linked to song
      const currentLinkedTags = await fetch(`/api/songs/${song.id}/tags`).then(r => r.json());
      const currentTagNames = currentLinkedTags.map((t: Tag) => t.name);

      // Remove tags that are no longer selected
      for (const tagName of currentTagNames) {
        if (!selectedTags.includes(tagName)) {
          const tag = currentLinkedTags.find((t: Tag) => t.name === tagName);
          if (tag) {
            await apiRequest("DELETE", `/api/songs/${song.id}/tags/${tag.id}`).catch(() => {});
          }
        }
      }

      // Add new tags
      for (const tagName of selectedTags) {
        const tagRes = await apiRequest("POST", "/api/tags", { name: tagName });
        const tag = await tagRes.json();
        
        await apiRequest("POST", `/api/songs/${song.id}/tags`, {
          songId: song.id,
          tagId: tag.id,
        }).catch(() => {}); // Ignore if already linked
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/songs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/discover"] });
      queryClient.invalidateQueries({ queryKey: ["/api/feed"] });
      queryClient.invalidateQueries({ queryKey: ["/api/song-of-day"] });

      toast({
        title: "Success!",
        description: "Your song has been updated",
      });

      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update song",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Song</DialogTitle>
          <DialogDescription>
            Update your song information and story
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Song Title *</Label>
            <Input
              id="edit-title"
              type="text"
              placeholder="Enter song title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="input-edit-title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-album">Album</Label>
            <Input
              id="edit-album"
              type="text"
              placeholder="Enter or select album name"
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              data-testid="input-edit-album"
              list="edit-album-suggestions"
            />
            {albumSuggestions.length > 0 && (
              <datalist id="edit-album-suggestions">
                {albumSuggestions.map((alb) => (
                  <option key={alb.id} value={alb.name} />
                ))}
              </datalist>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-language">Language</Label>
            <Input
              id="edit-language"
              type="text"
              placeholder="Enter or select language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              data-testid="input-edit-language"
              list="edit-language-suggestions"
            />
            {languageSuggestions.length > 0 && (
              <datalist id="edit-language-suggestions">
                {languageSuggestions.map((lang) => (
                  <option key={lang.id} value={lang.name} />
                ))}
              </datalist>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-artist">Artists * (Add multiple)</Label>
            <div className="flex gap-2">
              <Input
                id="edit-artist"
                type="text"
                placeholder="Type artist name and press Enter"
                value={artistInput}
                onChange={(e) => setArtistInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addArtist(artistInput);
                  }
                }}
                data-testid="input-edit-artist"
                list="edit-artist-suggestions"
              />
              <Button
                type="button"
                size="icon"
                onClick={() => addArtist(artistInput)}
                data-testid="button-edit-add-artist"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {artistSuggestions.length > 0 && (
              <datalist id="edit-artist-suggestions">
                {artistSuggestions.map((art) => (
                  <option key={art.id} value={art.name} />
                ))}
              </datalist>
            )}
            {selectedArtists.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedArtists.map((artist) => (
                  <Badge key={artist} variant="secondary" className="gap-1 pr-1" data-testid={`badge-edit-artist-${artist}`}>
                    <span>{artist}</span>
                    <button
                      type="button"
                      className="ml-1 rounded-sm hover:bg-secondary-foreground/20 p-0.5"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeArtist(artist);
                      }}
                      data-testid={`button-edit-remove-artist-${artist}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-tags">Tags * (Add at least one)</Label>
            <div className="flex gap-2">
              <Input
                id="edit-tags"
                type="text"
                placeholder="Type tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag(tagInput);
                  }
                }}
                data-testid="input-edit-tag"
                list="edit-tag-suggestions"
              />
              <Button
                type="button"
                size="icon"
                onClick={() => addTag(tagInput)}
                data-testid="button-edit-add-tag"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {tagSuggestions.length > 0 && (
              <datalist id="edit-tag-suggestions">
                {tagSuggestions.map((tag) => (
                  <option key={tag.id} value={tag.name} />
                ))}
              </datalist>
            )}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="outline" className="gap-1 pr-1" data-testid={`badge-edit-tag-${tag}`}>
                    <span>{tag}</span>
                    <button
                      type="button"
                      className="ml-1 rounded-sm hover:bg-muted p-0.5"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeTag(tag);
                      }}
                      data-testid={`button-edit-remove-tag-${tag}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-story">Your Story *</Label>
            <Textarea
              id="edit-story"
              placeholder="Why do you love this song? What does it mean to you?"
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="min-h-[100px]"
              data-testid="input-edit-story"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              data-testid="button-edit-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              data-testid="button-edit-submit"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
