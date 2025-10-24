import DiscoverGrid from "@/components/DiscoverGrid";

const mockSongs = [
  { youtubeId: "dQw4w9WgXcQ", title: "Never Gonna Give You Up", artist: "Rick Astley", tags: ["80s", "pop", "classic"], likes: 1247, plays: 15430 },
  { youtubeId: "9bZkp7q19f0", title: "Gangnam Style", artist: "PSY", tags: ["kpop", "dance"], likes: 892, plays: 9821 },
  { youtubeId: "kJQP7kiw5Fk", title: "Despacito", artist: "Luis Fonsi", tags: ["latin", "reggaeton", "summer"], likes: 2341, plays: 28934 },
  { youtubeId: "OPf0YbXqDm0", title: "Uptown Funk", artist: "Mark Ronson", tags: ["funk", "pop", "dance"], likes: 1678, plays: 19283 },
  { youtubeId: "RgKAFK5djSk", title: "See You Again", artist: "Wiz Khalifa", tags: ["hip-hop", "emotional"], likes: 987, plays: 12456 },
  { youtubeId: "CevxZvSJLk8", title: "Shape of You", artist: "Ed Sheeran", tags: ["pop", "dance"], likes: 1543, plays: 17892 },
  { youtubeId: "60ItHLz5WEA", title: "Faded", artist: "Alan Walker", tags: ["edm", "electronic"], likes: 2134, plays: 23456, isLiked: true },
  { youtubeId: "FM7MFYoylVs", title: "Thinking Out Loud", artist: "Ed Sheeran", tags: ["pop", "romantic"], likes: 892, plays: 11234 },
  { youtubeId: "SlPhMPnQ58k", title: "Closer", artist: "The Chainsmokers", tags: ["edm", "pop"], likes: 1456, plays: 16789 },
  { youtubeId: "hT_nvWreIhg", title: "Counting Stars", artist: "OneRepublic", tags: ["pop", "indie"], likes: 1234, plays: 14567 },
  { youtubeId: "ru0K8uYEZWw", title: "Clarity", artist: "Zedd", tags: ["edm", "electronic"], likes: 1789, plays: 18923 },
  { youtubeId: "e-ORhEE3VVg", title: "Titanium", artist: "David Guetta", tags: ["edm", "dance"], likes: 2045, plays: 21456 },
];

const tags = ["pop", "dance", "80s", "kpop", "latin", "funk", "hip-hop", "edm", "electronic", "romantic", "summer"];

export default function Discover() {
  return (
    <div className="min-h-screen pt-16 md:pt-20">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Discover</h1>
          <p className="text-lg text-muted-foreground">Explore trending songs from around the world</p>
        </div>
        
        <DiscoverGrid
          songs={mockSongs}
          availableTags={tags}
          onSongPlay={(id) => console.log('Play:', id)}
          onSongLike={(id) => console.log('Like:', id)}
          onSongShare={(id) => console.log('Share:', id)}
          onTagFilter={(tag) => console.log('Filter by:', tag)}
        />
      </div>
    </div>
  );
}
