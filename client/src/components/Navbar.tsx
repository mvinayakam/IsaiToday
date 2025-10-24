import { Search, Music2, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  userAvatar?: string;
  userName?: string;
  onMenuClick?: () => void;
  onSearchChange?: (value: string) => void;
  onProfileClick?: () => void;
}

export default function Navbar({ 
  userAvatar, 
  userName, 
  onMenuClick,
  onSearchChange,
  onProfileClick 
}: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 md:h-20 border-b border-white/10 backdrop-blur-xl bg-background/80">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            size="icon"
            variant="ghost"
            className="md:hidden"
            onClick={onMenuClick}
            data-testid="button-menu"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <Music2 className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            <span className="text-xl md:text-2xl font-bold tracking-tight">IsaiToday</span>
          </div>
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
          {userName ? (
            <Button
              variant="ghost"
              className="gap-2"
              onClick={onProfileClick}
              data-testid="button-profile"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={userAvatar} />
                <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-medium">{userName}</span>
            </Button>
          ) : (
            <Button variant="default" size="sm" data-testid="button-login">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
