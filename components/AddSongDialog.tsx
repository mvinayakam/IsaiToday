"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Search, ArrowLeft, Loader2, Link2, Music2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Tag } from "@shared/schema";
import { useDebounce } from "@/hooks/use-debounce";

interface AddSongDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface SearchResult {
  youtubeId: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
}

interface SelectedSong {
  youtubeId: string;
  title: string;
  artist: string;
  thumbnail: string;
  album?: string;
  language?: string;
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  return null;
}

export default function AddSongDialog({ trigger, open: externalOpen, onOpenChange: externalOnOpenChange }: AddSongDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;

  // Step: "search" | "story"
  const [step, setStep] = useState<"search" | "story">("search");

  // Step 1 — search state
  const [query, setQuery] = useState("");
  const [urlMode, setUrlMode] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const debouncedQuery = useDebounce(query, 400);

  // Step 2 — story state
  const [selectedSong, setSelectedSong] = useState<SelectedSong | null>(null);
  const [story, setStory] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<Tag[]>([]);
  const [editTitle, setEditTitle] = useState("");
  const [editArtist, setEditArtist] = useState("");
  const [editAlbum, setEditAlbum] = useState("");
  const [editLanguage, setEditLanguage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const storyRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Search YouTube as user types
  useEffect(() => {
    if (!debouncedQuery.trim() || urlMode) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    fetch(`/api/youtube/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((r) => r.json())
      .then((data) => setSearchResults(Array.isArray(data) ? data : []))
      .catch(() => setSearchResults([]))
      .finally(() => setIsSearching(false));
  }, [debouncedQuery, urlMode]);

  // Load tag suggestions once
  useEffect(() => {
    if (open) {
      fetch("/api/tags").then((r) => r.json()).then(setTagSuggestions).catch(() => {});
    }
  }, [open]);

  // Auto-fetch metadata when URL is pasted
  useEffect(() => {
    if (!urlMode || !youtubeUrl) return;
    const id = extractYouTubeId(youtubeUrl);
    if (!id) return;

    setIsFetchingMetadata(true);
    fetch(`/api/youtube/metadata?url=${encodeURIComponent(youtubeUrl)}`)
      .then((r) => r.json())
      .then((meta) => {
        if (meta.title) {
          selectSong({
            youtubeId: id,
            title: meta.title,
            artist: meta.artist ?? "",
            thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
            album: meta.album,
          });
        }
      })
      .catch(() => {})
      .finally(() => setIsFetchingMetadata(false));
  }, [youtubeUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectSong = (song: SearchResult | SelectedSong) => {
    const sel: SelectedSong = {
      youtubeId: song.youtubeId,
      title: song.title,
      artist: "channelTitle" in song ? (song as SearchResult).channelTitle : (song as SelectedSong).artist,
      thumbnail: song.thumbnail,
      album: "album" in song ? (song as SelectedSong).album : undefined,
    };
    setSelectedSong(sel);
    setEditTitle(sel.title);
    setEditArtist(sel.artist);
    setEditAlbum(sel.album ?? "");
    setEditLanguage("");
    setStep("story");
    setTimeout(() => storyRef.current?.focus(), 100);
  };

  const handleUrlSubmit = () => {
    const id = extractYouTubeId(youtubeUrl);
    if (!id) {
      toast({ title: "Invalid URL", description: "Please enter a valid YouTube URL", variant: "destructive" });
      return;
    }
    if (!isFetchingMetadata && !selectedSong) {
      // Metadata hasn't loaded yet or failed — still proceed with what we have
      selectSong({ youtubeId: id, title: youtubeUrl, channelTitle: "", thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg` });
    }
  };

  const addTag = (name: string) => {
    const t = name.trim();
    if (t && !selectedTags.includes(t)) setSelectedTags([...selectedTags, t]);
    setTagInput("");
  };

  const removeTag = (name: string) => setSelectedTags(selectedTags.filter((t) => t !== name));

  const handleSubmit = async () => {
    if (!selectedSong || !story.trim()) {
      toast({ title: "Missing story", description: "Tell us why you love this song!", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const songRes = await apiRequest("POST", "/api/songs", {
        youtubeId: selectedSong.youtubeId,
        title: editTitle || selectedSong.title,
        artist: editArtist || selectedSong.artist,
        album: editAlbum || null,
        language: editLanguage || null,
        thumbnail: `https://img.youtube.com/vi/${selectedSong.youtubeId}/maxresdefault.jpg`,
      });
      const song = await songRes.json();

      // Artist link
      if (editArtist || selectedSong.artist) {
        const artistRes = await apiRequest("POST", "/api/artists", { name: editArtist || selectedSong.artist });
        const artist = await artistRes.json();
        await apiRequest("POST", `/api/songs/${song.id}/artists`, { songId: song.id, artistId: artist.id }).catch(() => {});
      }

      // Story (required here)
      await apiRequest("POST", `/api/songs/${song.id}/stories`, { story: story.trim() });

      // Tags (optional)
      for (const tagName of selectedTags) {
        const tagRes = await apiRequest("POST", "/api/tags", { name: tagName });
        const tag = await tagRes.json();
        await apiRequest("POST", `/api/songs/${song.id}/tags`, { songId: song.id, tagId: tag.id }).catch(() => {});
      }

      queryClient.invalidateQueries({ queryKey: ["/api/songs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/discover"] });
      queryClient.invalidateQueries({ queryKey: ["/api/feed"] });
      queryClient.invalidateQueries({ queryKey: ["/api/song-of-day"] });

      toast({ title: "Song shared!", description: "Your story is now live." });
      handleClose();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to add song";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep("search");
    setQuery("");
    setUrlMode(false);
    setYoutubeUrl("");
    setSearchResults([]);
    setSelectedSong(null);
    setStory("");
    setTagInput("");
    setSelectedTags([]);
    setEditTitle("");
    setEditArtist("");
    setEditAlbum("");
    setEditLanguage("");
    setOpen(false);
  };

  const storyPlaceholders = [
    "This song takes me back to…",
    "I first heard this when…",
    "This one means a lot because…",
    "Every time this plays, I feel…",
    "Why I love this song…",
  ];
  const placeholder = storyPlaceholders[Math.floor(Math.random() * storyPlaceholders.length)];

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else setOpen(true); }}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">
        {/* ── Step 1: Find the song ── */}
        {step === "search" && (
          <>
            <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
              <DialogTitle className="text-xl">What song do you want to share?</DialogTitle>
            </DialogHeader>

            <div className="px-6 pb-6 flex flex-col gap-4 overflow-y-auto flex-1">
              {!urlMode ? (
                <>
                  {/* Search input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      autoFocus
                      className="pl-9"
                      placeholder="Search by song name, artist…"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    {isSearching && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
                    )}
                  </div>

                  {/* Search results */}
                  {searchResults.length > 0 && (
                    <div className="flex flex-col gap-1">
                      {searchResults.map((r) => (
                        <button
                          key={r.youtubeId}
                          onClick={() => selectSong(r)}
                          className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-colors text-left w-full"
                        >
                          <img
                            src={r.thumbnail}
                            alt={r.title}
                            className="w-16 h-10 rounded object-cover shrink-0 bg-muted"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium line-clamp-1">{r.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{r.channelTitle}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {!isSearching && query.length > 2 && searchResults.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No results — try a different search or paste a URL below.</p>
                  )}

                  {/* Fallback to URL */}
                  <button
                    onClick={() => setUrlMode(true)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto mt-auto pt-2"
                  >
                    <Link2 className="w-4 h-4" />
                    Paste a YouTube URL instead
                  </button>
                </>
              ) : (
                <>
                  {/* URL mode */}
                  <button
                    onClick={() => { setUrlMode(false); setYoutubeUrl(""); }}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to search
                  </button>
                  <div className="space-y-2">
                    <Label htmlFor="yt-url">YouTube URL</Label>
                    <Input
                      id="yt-url"
                      autoFocus
                      placeholder="https://www.youtube.com/watch?v=…"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleUrlSubmit}
                    disabled={!youtubeUrl || isFetchingMetadata}
                    className="w-full"
                  >
                    {isFetchingMetadata ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading song info…</>
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </>
              )}
            </div>
          </>
        )}

        {/* ── Step 2: Tell your story ── */}
        {step === "story" && selectedSong && (
          <>
            <DialogHeader className="px-6 pt-5 pb-3 shrink-0 border-b border-white/5">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStep("search")}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Back to search"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={selectedSong.thumbnail}
                    alt={selectedSong.title}
                    className="w-10 h-7 rounded object-cover shrink-0 bg-muted"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                  <div className="min-w-0">
                    <DialogTitle className="text-base leading-tight line-clamp-1">{editTitle || selectedSong.title}</DialogTitle>
                    <p className="text-xs text-muted-foreground line-clamp-1">{editArtist || selectedSong.artist}</p>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <div className="px-6 py-5 flex flex-col gap-5 overflow-y-auto flex-1">
              {/* Story — the hero */}
              <div className="space-y-2">
                <Label htmlFor="story" className="text-base font-semibold">
                  Why do you love this song? <span className="text-primary">*</span>
                </Label>
                <Textarea
                  id="story"
                  ref={storyRef}
                  placeholder={placeholder}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  className="min-h-[140px] resize-none text-base leading-relaxed"
                />
              </div>

              {/* Tags — optional, lightweight */}
              <div className="space-y-2">
                <Label htmlFor="tags" className="text-sm text-muted-foreground">
                  Tags <span className="text-muted-foreground/50">(optional)</span>
                </Label>
                <div className="flex gap-2 flex-wrap">
                  {selectedTags.map((t) => (
                    <Badge key={t} variant="secondary" className="gap-1 pr-1">
                      #{t}
                      <button type="button" onClick={() => removeTag(t)} className="ml-0.5 rounded-sm hover:bg-secondary-foreground/20 p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    placeholder="e.g. tamil, romantic, 90s…"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(tagInput); } }}
                    list="tag-suggestions"
                    className="text-sm"
                  />
                  <Button type="button" size="icon" variant="outline" onClick={() => addTag(tagInput)} aria-label="Add tag">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {tagSuggestions.length > 0 && (
                  <datalist id="tag-suggestions">
                    {tagSuggestions.map((t) => <option key={t.id} value={t.name} />)}
                  </datalist>
                )}
              </div>

              {/* Metadata — always visible, secondary visual weight */}
              <div className="space-y-3 pt-1 border-t border-white/5">
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1">
                  <Music2 className="w-3.5 h-3.5" />
                  Song details — helps others find this song
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 col-span-2">
                    <Label htmlFor="m-title" className="text-xs text-muted-foreground">Title</Label>
                    <Input id="m-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="text-sm h-8" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="m-artist" className="text-xs text-muted-foreground">Artist</Label>
                    <Input id="m-artist" value={editArtist} onChange={(e) => setEditArtist(e.target.value)} className="text-sm h-8" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="m-language" className="text-xs text-muted-foreground">Language</Label>
                    <Input id="m-language" placeholder="Tamil, Hindi…" value={editLanguage} onChange={(e) => setEditLanguage(e.target.value)} className="text-sm h-8" />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label htmlFor="m-album" className="text-xs text-muted-foreground">Album / Film</Label>
                    <Input id="m-album" value={editAlbum} onChange={(e) => setEditAlbum(e.target.value)} className="text-sm h-8" />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="px-6 py-4 border-t border-white/5 shrink-0">
              <Button
                onClick={handleSubmit}
                disabled={!story.trim() || isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sharing…</>
                ) : (
                  "Share this song"
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
