"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Music, User } from "lucide-react";
import type { Song, User as UserType } from "@shared/schema";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Search songs
  const { data: songs = [], isFetching: isFetchingSongs } = useQuery<Song[]>({
    queryKey: ['/api/songs/search', searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.trim().length === 0) {
        return [];
      }
      const response = await fetch(`/api/songs/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Failed to search songs');
      return response.json();
    },
    enabled: searchQuery.trim().length > 0,
  });

  // Search users
  const { data: users = [], isFetching: isFetchingUsers } = useQuery<UserType[]>({
    queryKey: ['/api/users/search', searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.trim().length === 0) {
        return [];
      }
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Failed to search users');
      return response.json();
    },
    enabled: searchQuery.trim().length > 0,
  });

  const handleSelectSong = (song: Song) => {
    onOpenChange(false);
    setSearchQuery("");
    router.push('/discover');
  };

  const handleSelectUser = (user: UserType) => {
    onOpenChange(false);
    setSearchQuery("");
    router.push(`/user/${user.id}`);
  };

  // Clear search when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-2xl" data-testid="dialog-search">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Search songs, artists, or users..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
            data-testid="input-search-command"
          />
          <CommandList>
            <CommandEmpty>
              {searchQuery.trim().length === 0 
                ? "Type to search..." 
                : (isFetchingSongs || isFetchingUsers)
                  ? "Searching..."
                  : "No results found."}
            </CommandEmpty>
            
            {songs.length > 0 && (
              <CommandGroup heading="Songs">
                {songs.map((song) => (
                  <CommandItem
                    key={song.id}
                    onSelect={() => handleSelectSong(song)}
                    data-testid={`search-result-song-${song.id}`}
                  >
                    <Music className="w-4 h-4 mr-2" />
                    <div className="flex-1">
                      <div className="font-medium">{song.title}</div>
                      <div className="text-xs text-muted-foreground">{song.artist}</div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {users.length > 0 && (
              <CommandGroup heading="Users">
                {users.map((user) => (
                  <CommandItem
                    key={user.id}
                    onSelect={() => handleSelectUser(user)}
                    data-testid={`search-result-user-${user.id}`}
                  >
                    <User className="w-4 h-4 mr-2" />
                    <div className="flex-1">
                      <div className="font-medium">{user.firstName} {user.lastName}</div>
                      {user.email && (
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
