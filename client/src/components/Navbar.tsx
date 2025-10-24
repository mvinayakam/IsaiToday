import { Search, Music2, LogOut, Music, Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth, getLoginUrl, getLogoutUrl } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import AddSongDialog from "@/components/AddSongDialog";
import { useState } from "react";

interface NavbarProps {
  onSearchChange?: (value: string) => void;
}

export default function Navbar({ 
  onSearchChange,
}: NavbarProps) {
  const { user, isAuthenticated } = useAuth();
  const [addSongOpen, setAddSongOpen] = useState(false);

  const userName = user ? `${user.firstName} ${user.lastName}` : '';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 md:h-20 border-b border-white/10 backdrop-blur-xl bg-background/80">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Music2 className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          <span className="text-xl md:text-2xl font-bold tracking-tight">IsaiToday™</span>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search songs, artists, or tags..."
              className="pl-10 bg-card/50 border-white/10"
              onChange={(e) => onSearchChange?.(e.target.value)}
              data-testid="input-search"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="gap-2"
                  data-testid="button-profile"
                >
                  <Avatar className="w-8 h-8">
                    {user.profileImageUrl && <AvatarImage src={user.profileImageUrl} />}
                    <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-sm font-medium">{userName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setAddSongOpen(true)} data-testid="menu-add-song">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Song
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.location.href = '/profile'} data-testid="menu-my-posts">
                  <Music className="w-4 h-4 mr-2" />
                  My Posts
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = '/profile'} data-testid="menu-my-likes">
                  <Heart className="w-4 h-4 mr-2" />
                  My Likes
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.location.href = getLogoutUrl()} data-testid="button-logout">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      {isAuthenticated && (
        <AddSongDialog open={addSongOpen} onOpenChange={setAddSongOpen} />
      )}
    </nav>
  );
}
