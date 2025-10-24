import ProfileSection from "@/components/ProfileSection";
import FeedCarousel from "@/components/FeedCarousel";
import PlaylistCard from "@/components/PlaylistCard";
import avatar from '@assets/generated_images/Male_user_profile_avatar_e9b4c3bb.png';

const mockLikedSongs = [
  { youtubeId: "YR12Z8f1Dh8", title: "Mere Sapno Ki Rani", artist: "Kishore Kumar", tags: ["classic", "romantic", "kishore"], likes: 892, plays: 9821, isLiked: true },
  { youtubeId: "3Tqjf6teI-Q", title: "Roja Janeman", artist: "A R Rahman, S P Balasubrahmanyam", tags: ["ar-rahman", "tamil"], likes: 2134, plays: 23456, isLiked: true },
  { youtubeId: "6ste3pOXLto", title: "Kanne Kalaimaane", artist: "Ilaiyaraja", tags: ["ilaiyaraja", "tamil", "melody"], likes: 1456, plays: 16789, isLiked: true },
];

const mockPlaylists = [
  { id: "1", title: "Classic Kishore Hits", songCount: 24 },
  { id: "2", title: "A R Rahman Magic", songCount: 18 },
  { id: "3", title: "Ilaiyaraja Melodies", songCount: 42 },
];

export default function Profile() {
  return (
    <div className="min-h-screen pt-16 md:pt-20">
      <div className="py-12">
        <ProfileSection
          avatar={avatar}
          name="Arjun Sharma"
          email="arjun.sharma@example.com"
          tags={["classic", "romantic", "bollywood", "tamil", "melody"]}
          stats={{
            songsLiked: 342,
            playlists: 12,
            following: 87
          }}
          onEditProfile={() => console.log('Edit profile')}
          onLogout={() => console.log('Logout')}
        />
      </div>

      <FeedCarousel
        title="Recently Liked"
        songs={mockLikedSongs}
        onSeeAll={() => console.log('See all liked')}
        onSongPlay={(id) => console.log('Play:', id)}
        onSongLike={(id) => console.log('Unlike:', id)}
        onSongShare={(id) => console.log('Share:', id)}
      />

      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">My Playlists</h2>
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
