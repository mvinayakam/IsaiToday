import DiscoverGrid from "@/components/DiscoverGrid";

const mockSongs = [
  { youtubeId: "YR12Z8f1Dh8", title: "Mere Sapno Ki Rani", artist: "Kishore Kumar", tags: ["classic", "romantic", "kishore"], likes: 1247, plays: 15430 },
  { youtubeId: "CDNJbIeKFGQ", title: "Piya Tu Ab To Aaja", artist: "R D Burman, Asha Bhonsle", tags: ["rd-burman", "classic", "retro"], likes: 892, plays: 9821 },
  { youtubeId: "3Tqjf6teI-Q", title: "Roja Janeman", artist: "A R Rahman, S P Balasubrahmanyam", tags: ["ar-rahman", "tamil", "melody"], likes: 2341, plays: 28934 },
  { youtubeId: "s4bJ0arbnd8", title: "Nenjukkule", artist: "A R Rahman", tags: ["ar-rahman", "tamil", "romantic"], likes: 1678, plays: 19283 },
  { youtubeId: "YZBW7OWbO5Y", title: "Sundari Kannal", artist: "Ilaiyaraja, S P Balasubrahmanyam", tags: ["ilaiyaraja", "tamil", "classic"], likes: 987, plays: 12456 },
  { youtubeId: "kw4tT7SCmaY", title: "Dum Maro Dum", artist: "R D Burman, Asha Bhonsle", tags: ["rd-burman", "classic", "bollywood"], likes: 1543, plays: 17892 },
  { youtubeId: "6ste3pOXLto", title: "Kanne Kalaimaane", artist: "Ilaiyaraja", tags: ["ilaiyaraja", "tamil", "melody"], likes: 2134, plays: 23456, isLiked: true },
  { youtubeId: "aWu8g1yHABg", title: "Pal Pal Dil Ke Paas", artist: "Kishore Kumar, S D Burman", tags: ["classic", "romantic", "kishore"], likes: 892, plays: 11234 },
  { youtubeId: "HQ5mJNk8k7M", title: "Kaatril Varum Geetham", artist: "Ilaiyaraja, S P Balasubrahmanyam", tags: ["ilaiyaraja", "tamil", "melody"], likes: 1456, plays: 16789 },
  { youtubeId: "PQmrmVs10X8", title: "O Haseena Zulfon Wali", artist: "Kishore Kumar, R D Burman", tags: ["kishore", "rd-burman", "classic"], likes: 1234, plays: 14567 },
  { youtubeId: "K7sJqXUTups", title: "Kehna Hi Kya", artist: "A R Rahman", tags: ["ar-rahman", "romantic", "bollywood"], likes: 1789, plays: 18923 },
  { youtubeId: "5eTCZ9L834s", title: "Ye Jo Des Hai Tera", artist: "A R Rahman", tags: ["ar-rahman", "patriotic", "bollywood"], likes: 2045, plays: 21456 },
];

const tags = ["classic", "romantic", "bollywood", "tamil", "kishore", "rd-burman", "ar-rahman", "ilaiyaraja", "melody", "retro", "patriotic"];

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
