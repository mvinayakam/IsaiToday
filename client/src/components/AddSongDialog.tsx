import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Album, Language, Artist, Tag } from "@shared/schema";

interface AddSongDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }

  return null;
}

export default function AddSongDialog({ trigger, open: externalOpen, onOpenChange: externalOnOpenChange }: AddSongDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Use external state if provided, otherwise use internal state
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [title, setTitle] = useState("");
  const [album, setAlbum] = useState("");
  const [language, setLanguage] = useState("");
  const [artistInput, setArtistInput] = useState("");
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [story, setStory] = useState("");
  
  const [albumSuggestions, setAlbumSuggestions] = useState<Album[]>([]);
  const [languageSuggestions, setLanguageSuggestions] = useState<Language[]>([]);
  const [artistSuggestions, setArtistSuggestions] = useState<Artist[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<Tag[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const { toast } = useToast();

  // Automatically fetch metadata when YouTube URL changes
  useEffect(() => {
    const fetchMetadata = async () => {
      const youtubeId = extractYouTubeId(youtubeUrl);
      if (!youtubeId) return;

      setIsFetchingMetadata(true);
      try {
        const response = await fetch(`/api/youtube/metadata?url=${encodeURIComponent(youtubeUrl)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch metadata');
        }
        
        const metadata = await response.json();
        let fieldsUpdated = false;
        
        // Only auto-fill if fields are empty - use functional setters to check latest values
        setTitle(prev => {
          if (!prev && metadata.title) {
            fieldsUpdated = true;
            return metadata.title;
          }
          return prev;
        });
        
        setSelectedArtists(prev => {
          if (prev.length === 0 && metadata.artist) {
            fieldsUpdated = true;
            return [metadata.artist];
          }
          return prev;
        });
        
        setAlbum(prev => {
          if (!prev && metadata.album) {
            fieldsUpdated = true;
            return metadata.album;
          }
          return prev;
        });

        if (fieldsUpdated) {
          toast({
            title: "Metadata loaded!",
            description: "We've automatically filled in the song details from YouTube",
          });
        }
      } catch (error) {
        console.error('Error fetching YouTube metadata:', error);
        // Silently fail - user can still manually enter data
      } finally {
        setIsFetchingMetadata(false);
      }
    };

    // Debounce the fetch to avoid too many API calls
    const timeoutId = setTimeout(() => {
      if (youtubeUrl) {
        fetchMetadata();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [youtubeUrl]); // toast is stable, safe to omit from deps

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
    
    if (!youtubeUrl || !title || selectedArtists.length === 0 || selectedTags.length === 0 || !story) {
      toast({
        title: "Missing required fields",
        description: "Please fill in YouTube URL, title, at least one artist, at least one tag, and your story",
        variant: "destructive",
      });
      return;
    }

    const youtubeId = extractYouTubeId(youtubeUrl);
    if (!youtubeId) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create song with first artist (backward compatibility)
      const songRes = await apiRequest("POST", "/api/songs", {
        youtubeId,
        title,
        artist: selectedArtists[0],
        album: album.trim() || null,
        language: language.trim() || null,
        thumbnail: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
      });
      const song = await songRes.json();

      // Create/get artists and link them to song
      for (const artistName of selectedArtists) {
        const artistRes = await apiRequest("POST", "/api/artists", { name: artistName });
        const artist = await artistRes.json();
        
        // Link artist to song
        await apiRequest("POST", `/api/songs/${song.id}/artists`, {
          songId: song.id,
          artistId: artist.id,
        }).catch(() => {}); // Ignore if already linked
      }

      // Add story
      await apiRequest("POST", `/api/songs/${song.id}/stories`, { story });

      // Add tags
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
        description: "Your song has been added",
      });

      // Reset form
      setYoutubeUrl("");
      setTitle("");
      setAlbum("");
      setLanguage("");
      setArtistInput("");
      setSelectedArtists([]);
      setTagInput("");
      setSelectedTags([]);
      setStory("");
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add song",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-4xl max-h-[85vh] sm:max-h-[90vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>Add a Song</DialogTitle>
          <DialogDescription>
            Share a song and tell us why you love it
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-2">
          {/* YouTube URL - Spanning across */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="youtube-url">YouTube URL *</Label>
              {isFetchingMetadata && (
                <span className="text-xs text-muted-foreground" data-testid="text-fetching-metadata">
                  Loading metadata...
                </span>
              )}
            </div>
            <Input
              id="youtube-url"
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              data-testid="input-youtube-url"
              disabled={isFetchingMetadata}
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Metadata */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Song Metadata</h3>
              
              <div className="space-y-2">
                <Label htmlFor="title">Song Title *</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter song title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  data-testid="input-title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="album">Album</Label>
                <Input
                  id="album"
                  type="text"
                  placeholder="Enter or select album name"
                  value={album}
                  onChange={(e) => setAlbum(e.target.value)}
                  data-testid="input-album"
                  list="album-suggestions"
                />
                {albumSuggestions.length > 0 && (
                  <datalist id="album-suggestions">
                    {albumSuggestions.map((alb) => (
                      <option key={alb.id} value={alb.name} />
                    ))}
                  </datalist>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Input
                  id="language"
                  type="text"
                  placeholder="Enter or select language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  data-testid="input-language"
                  list="language-suggestions"
                />
                {languageSuggestions.length > 0 && (
                  <datalist id="language-suggestions">
                    {languageSuggestions.map((lang) => (
                      <option key={lang.id} value={lang.name} />
                    ))}
                  </datalist>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="artist">Artists * (Add multiple)</Label>
                <div className="flex gap-2">
                  <Input
                    id="artist"
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
                    data-testid="input-artist"
                    list="artist-suggestions"
                  />
                  <Button
                    type="button"
                    size="icon"
                    onClick={() => addArtist(artistInput)}
                    data-testid="button-add-artist"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {artistSuggestions.length > 0 && (
                  <datalist id="artist-suggestions">
                    {artistSuggestions.map((art) => (
                      <option key={art.id} value={art.name} />
                    ))}
                  </datalist>
                )}
                {selectedArtists.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedArtists.map((artist) => (
                      <Badge key={artist} variant="secondary" className="gap-1 pr-1" data-testid={`badge-artist-${artist}`}>
                        <span>{artist}</span>
                        <button
                          type="button"
                          className="ml-1 rounded-sm hover:bg-secondary-foreground/20 p-0.5"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeArtist(artist);
                          }}
                          data-testid={`button-remove-artist-${artist}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags * (Add at least one)</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
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
                    data-testid="input-tag"
                    list="tag-suggestions"
                  />
                  <Button
                    type="button"
                    size="icon"
                    onClick={() => addTag(tagInput)}
                    data-testid="button-add-tag"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {tagSuggestions.length > 0 && (
                  <datalist id="tag-suggestions">
                    {tagSuggestions.map((tag) => (
                      <option key={tag.id} value={tag.name} />
                    ))}
                  </datalist>
                )}
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTags.map((tag) => (
                      <Badge key={tag} variant="outline" className="gap-1 pr-1" data-testid={`badge-tag-${tag}`}>
                        <span>{tag}</span>
                        <button
                          type="button"
                          className="ml-1 rounded-sm hover:bg-muted p-0.5"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeTag(tag);
                          }}
                          data-testid={`button-remove-tag-${tag}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Story */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Why You Love This Song</h3>
              
              <div className="space-y-2">
                <Label htmlFor="story">Your Story *</Label>
                <Textarea
                  id="story"
                  placeholder="Why do you love this song? What does it mean to you? Share your personal connection, memories, or feelings about this song..."
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  className="min-h-[200px] sm:min-h-[300px] md:min-h-[400px]"
                  data-testid="input-story"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
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
              data-testid="button-submit-song"
            >
              {isSubmitting ? "Adding..." : "Add Song"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
