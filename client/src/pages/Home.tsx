import SongOfTheDay from "@/components/SongOfTheDay";
import FeedCarousel from "@/components/FeedCarousel";
import PlaylistCard from "@/components/PlaylistCard";

const mockFeedSongs = [
  { youtubeId: "CDNJbIeKFGQ", title: "Piya Tu Ab To Aaja", artist: "R D Burman, Asha Bhonsle", tags: ["classic", "retro", "bollywood"], likes: 1247, plays: 15430 },
  { youtubeId: "X2RS8_e02xo", title: "Munni Badnaam Hui", artist: "Mamta Sharma", tags: ["item-song", "dance", "bollywood"], likes: 892, plays: 9821, isLiked: true },
  { youtubeId: "YR12Z8f1Dh8", title: "Mere Sapno Ki Rani", artist: "Kishore Kumar", tags: ["classic", "romantic", "kishore"], likes: 2341, plays: 28934 },
  { youtubeId: "aWu8g1yHABg", title: "Pal Pal Dil Ke Paas", artist: "Kishore Kumar, S D Burman", tags: ["classic", "romantic", "retro"], likes: 1678, plays: 19283 },
  { youtubeId: "3Tqjf6teI-Q", title: "Roja Janeman", artist: "A R Rahman, S P Balasubrahmanyam", tags: ["ar-rahman", "tamil", "melody"], likes: 987, plays: 12456 },
];

const mockTrendingSongs = [
  { youtubeId: "s4bJ0arbnd8", title: "Nenjukkule", artist: "A R Rahman", tags: ["ar-rahman", "tamil", "romantic"], likes: 1543, plays: 17892 },
  { youtubeId: "YZBW7OWbO5Y", title: "Sundari Kannal", artist: "Ilaiyaraja, S P Balasubrahmanyam", tags: ["ilaiyaraja", "tamil", "classic"], likes: 2134, plays: 23456 },
  { youtubeId: "kw4tT7SCmaY", title: "Dum Maro Dum", artist: "R D Burman, Asha Bhonsle", tags: ["rd-burman", "classic", "bollywood"], likes: 892, plays: 11234 },
  { youtubeId: "6ste3pOXLto", title: "Kanne Kalaimaane", artist: "Ilaiyaraja", tags: ["ilaiyaraja", "tamil", "melody"], likes: 1456, plays: 16789 },
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
        youtubeId="YR12Z8f1Dh8"
        title="Mere Sapno Ki Rani"
        artist="Kishore Kumar"
        tags={["classic", "romantic", "kishore", "retro", "bollywood"]}
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
