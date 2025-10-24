import SongCard from '../SongCard';

export default function SongCardExample() {
  return (
    <div className="p-8 flex gap-4 flex-wrap">
      <SongCard
        youtubeId="dQw4w9WgXcQ"
        title="Never Gonna Give You Up"
        artist="Rick Astley"
        tags={["80s", "pop", "classic"]}
        likes={1247}
        plays={15430}
        onLike={() => console.log('Liked')}
        onPlay={() => console.log('Play clicked')}
        onShare={() => console.log('Share clicked')}
      />
      <SongCard
        youtubeId="9bZkp7q19f0"
        title="Gangnam Style"
        artist="PSY"
        tags={["kpop", "dance"]}
        likes={892}
        plays={9821}
        isLiked={true}
        onLike={() => console.log('Liked')}
        onPlay={() => console.log('Play clicked')}
        onShare={() => console.log('Share clicked')}
      />
    </div>
  );
}
