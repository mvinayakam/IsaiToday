import SongOfTheDay from "@/components/SongOfTheDay";
import FeedCarousel from "@/components/FeedCarousel";
import PlaylistCard from "@/components/PlaylistCard";

const mockFeedSongs = [
  { youtubeId: "dQw4w9WgXcQ", title: "Never Gonna Give You Up", artist: "Rick Astley", tags: ["80s", "pop"], likes: 1247, plays: 15430 },
  { youtubeId: "9bZkp7q19f0", title: "Gangnam Style", artist: "PSY", tags: ["kpop", "dance"], likes: 892, plays: 9821, isLiked: true },
  { youtubeId: "kJQP7kiw5Fk", title: "Despacito", artist: "Luis Fonsi", tags: ["latin", "reggaeton"], likes: 2341, plays: 28934 },
  { youtubeId: "OPf0YbXqDm0", title: "Uptown Funk", artist: "Mark Ronson", tags: ["funk", "pop"], likes: 1678, plays: 19283 },
  { youtubeId: "RgKAFK5djSk", title: "See You Again", artist: "Wiz Khalifa", tags: ["hip-hop"], likes: 987, plays: 12456 },
];

const mockTrendingSongs = [
  { youtubeId: "CevxZvSJLk8", title: "Shape of You", artist: "Ed Sheeran", tags: ["pop", "dance"], likes: 1543, plays: 17892 },
  { youtubeId: "60ItHLz5WEA", title: "Faded", artist: "Alan Walker", tags: ["edm"], likes: 2134, plays: 23456 },
  { youtubeId: "FM7MFYoylVs", title: "Thinking Out Loud", artist: "Ed Sheeran", tags: ["pop", "romantic"], likes: 892, plays: 11234 },
  { youtubeId: "SlPhMPnQ58k", title: "Closer", artist: "The Chainsmokers", tags: ["edm", "pop"], likes: 1456, plays: 16789 },
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
        youtubeId="kJQP7kiw5Fk"
        title="Despacito"
        artist="Luis Fonsi ft. Daddy Yankee"
        tags={["latin", "reggaeton", "summer", "dance"]}
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
