import SongOfTheDay from "@/components/SongOfTheDay";
import FeedCarousel from "@/components/FeedCarousel";
import PlaylistCard from "@/components/PlaylistCard";

const mockFeedSongs = [
  { 
    youtubeId: "CDNJbIeKFGQ", 
    title: "Piya Tu Ab To Aaja", 
    artist: "R D Burman, Asha Bhonsle", 
    story: "This song reminds me of my grandmother's old radio. RD's genius composition never gets old!",
    sharedBy: "Priya R.",
    tags: ["classic", "retro", "bollywood"], 
    likes: 1247, 
    plays: 15430 
  },
  { 
    youtubeId: "aWu8g1yHABg", 
    title: "Pal Pal Dil Ke Paas", 
    artist: "Kishore Kumar, S D Burman", 
    story: "My father used to hum this while cooking. Pure nostalgia in every note.",
    sharedBy: "Arjun S.",
    tags: ["classic", "romantic", "retro"], 
    likes: 892, 
    plays: 9821, 
    isLiked: true 
  },
  { 
    youtubeId: "kw4tT7SCmaY", 
    title: "Dum Maro Dum", 
    artist: "R D Burman, Asha Bhonsle", 
    story: "The psychedelic vibe is timeless. Asha's voice is pure magic here!",
    sharedBy: "Kavya M.",
    tags: ["rd-burman", "classic", "bollywood"], 
    likes: 2341, 
    plays: 28934 
  },
  { 
    youtubeId: "3Tqjf6teI-Q", 
    title: "Roja Janeman", 
    artist: "A R Rahman, S P Balasubrahmanyam", 
    story: "AR Rahman changed Tamil cinema music forever with this. Still gives me goosebumps!",
    sharedBy: "Deepak K.",
    tags: ["ar-rahman", "tamil", "melody"], 
    likes: 1678, 
    plays: 19283 
  },
  { 
    youtubeId: "YZBW7OWbO5Y", 
    title: "Sundari Kannal", 
    artist: "Ilaiyaraja, S P Balasubrahmanyam", 
    story: "Ilaiyaraja's orchestration is simply divine. This melody stays with you forever.",
    sharedBy: "Lakshmi V.",
    tags: ["ilaiyaraja", "tamil", "classic"], 
    likes: 987, 
    plays: 12456 
  },
];

const mockTrendingSongs = [
  { 
    youtubeId: "s4bJ0arbnd8", 
    title: "Nenjukkule", 
    artist: "A R Rahman", 
    story: "Perfect song for late night drives. AR Rahman's melodies hit different!",
    sharedBy: "Ravi P.",
    tags: ["ar-rahman", "tamil", "romantic"], 
    likes: 1543, 
    plays: 17892 
  },
  { 
    youtubeId: "6ste3pOXLto", 
    title: "Kanne Kalaimaane", 
    artist: "Ilaiyaraja", 
    story: "This song makes me miss my childhood in Tamil Nadu. Pure emotion.",
    sharedBy: "Meera S.",
    tags: ["ilaiyaraja", "tamil", "melody"], 
    likes: 2134, 
    plays: 23456 
  },
  { 
    youtubeId: "PQmrmVs10X8", 
    title: "O Haseena Zulfon Wali", 
    artist: "Kishore Kumar, R D Burman", 
    story: "Kishore's energy is infectious! This song never fails to make me smile.",
    sharedBy: "Aditya B.",
    tags: ["kishore", "rd-burman", "classic"], 
    likes: 892, 
    plays: 11234 
  },
  { 
    youtubeId: "K7sJqXUTups", 
    title: "Kehna Hi Kya", 
    artist: "A R Rahman", 
    story: "First dance at my wedding was to this song. Always special!",
    sharedBy: "Anjali G.",
    tags: ["ar-rahman", "romantic", "bollywood"], 
    likes: 1456, 
    plays: 16789 
  },
];

const mockPlaylists = [
  { id: "1", title: "Chill Vibes", songCount: 24 },
  { id: "2", title: "Workout Motivation", songCount: 18 },
  { id: "3", title: "Road Trip Favorites", songCount: 42 },
  { id: "4", title: "Study Focus", songCount: 31 },
];

export default function Home() {
  return (
    <div className="min-h-screen pt-16 md:pt-20">
      <SongOfTheDay
        youtubeId="CDNJbIeKFGQ"
        title="Piya Tu Ab To Aaja"
        artist="R D Burman, Asha Bhonsle"
        story="This masterpiece by RD Burman takes me back to lazy Sunday afternoons at my grandmother's house. The way Asha Bhonsle's voice dances through the melody is pure magic. Every time I hear this, I'm transported to a simpler time filled with love and warmth."
        tags={["classic", "retro", "rd-burman", "asha-bhonsle", "bollywood"]}
        likes={3421}
        onLike={() => console.log('Liked SOTD')}
        onAddToPlaylist={() => console.log('Add to playlist')}
        onShare={() => console.log('Share SOTD')}
      />

      <FeedCarousel
        title="Your Feed"
        songs={mockFeedSongs}
        onSeeAll={() => console.log('See all feed')}
        onSongPlay={(id) => console.log('Play:', id)}
        onSongLike={(id) => console.log('Like:', id)}
        onSongShare={(id) => console.log('Share:', id)}
      />

      <FeedCarousel
        title="Trending Now"
        songs={mockTrendingSongs}
        onSeeAll={() => console.log('See all trending')}
        onSongPlay={(id) => console.log('Play:', id)}
        onSongLike={(id) => console.log('Like:', id)}
        onSongShare={(id) => console.log('Share:', id)}
      />

      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">Your Playlists</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mockPlaylists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                {...playlist}
                onClick={() => console.log('Open playlist:', playlist.id)}
                onPlay={() => console.log('Play playlist:', playlist.id)}
                onMore={() => console.log('More options:', playlist.id)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
