import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, LogOut } from "lucide-react";

interface ProfileSectionProps {
  avatar?: string;
  name: string;
  email?: string;
  tags?: string[];
  stats?: {
    songsLiked: number;
    playlists: number;
    following: number;
  };
  onEditProfile?: () => void;
  onLogout?: () => void;
}

export default function ProfileSection({
  avatar,
  name,
  email,
  tags = [],
  stats = { songsLiked: 0, playlists: 0, following: 0 },
  onEditProfile,
  onLogout
}: ProfileSectionProps) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="backdrop-blur-md bg-card/50 border border-white/10 rounded-2xl p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar className="w-24 h-24 md:w-32 md:h-32 border-2 border-primary/20">
            <AvatarImage src={avatar} />
            <AvatarFallback className="text-2xl">{name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-1" data-testid="text-profile-name">{name}</h2>
            {email && (
              <p className="text-muted-foreground mb-4" data-testid="text-profile-email">{email}</p>
            )}

            <div className="flex flex-wrap gap-6 justify-center md:justify-start mb-4">
              <div>
                <div className="text-2xl font-semibold" data-testid="text-stat-likes">{stats.songsLiked}</div>
                <div className="text-sm text-muted-foreground">Songs Liked</div>
              </div>
              <div>
                <div className="text-2xl font-semibold" data-testid="text-stat-playlists">{stats.playlists}</div>
                <div className="text-sm text-muted-foreground">Playlists</div>
              </div>
              <div>
                <div className="text-2xl font-semibold" data-testid="text-stat-following">{stats.following}</div>
                <div className="text-sm text-muted-foreground">Following</div>
              </div>
            </div>

            {tags.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Music Taste</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" data-testid={`badge-taste-${tag}`}>
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 justify-center md:justify-start">
              <Button variant="default" className="gap-2" onClick={onEditProfile} data-testid="button-edit-profile">
                <Settings className="w-4 h-4" />
                <span>Edit Profile</span>
              </Button>
              <Button variant="outline" className="gap-2" onClick={onLogout} data-testid="button-logout">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
