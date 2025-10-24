import FeedCarousel from '../FeedCarousel';

const mockSongs = [
  { youtubeId: "dQw4w9WgXcQ", title: "Never Gonna Give You Up", artist: "Rick Astley", tags: ["80s", "pop"], likes: 1247, plays: 15430 },
  { youtubeId: "9bZkp7q19f0", title: "Gangnam Style", artist: "PSY", tags: ["kpop", "dance"], likes: 892, plays: 9821, isLiked: true },
  { youtubeId: "kJQP7kiw5Fk", title: "Despacito", artist: "Luis Fonsi", tags: ["latin", "reggaeton"], likes: 2341, plays: 28934 },
  { youtubeId: "OPf0YbXqDm0", title: "Mark Ronson - Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", tags: ["funk", "pop"], likes: 1678, plays: 19283 },
  { youtubeId: "RgKAFK5djSk", title: "Wiz Khalifa - See You Again", artist: "Wiz Khalifa ft. Charlie Puth", tags: ["hip-hop", "emotional"], likes: 987, plays: 12456 },
];

export default function FeedCarouselExample() {
  return (
    <div className="space-y-4">
      <FeedCarousel
        title="Your Feed"
        songs={mockSongs}
        onSeeAll={() => console.log('See all clicked')}
        onSongPlay={(id) => console.log('Play song:', id)}
        onSongLike={(id) => console.log('Like song:', id)}
        onSongShare={(id) => console.log('Share song:', id)}
      />
      <FeedCarousel
        title="Trending Now"
        songs={mockSongs.slice(0, 3)}
        onSeeAll={() => console.log('See all trending')}
        onSongPlay={(id) => console.log('Play song:', id)}
      />
    </div>
  );
}
