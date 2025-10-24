import SongCard from '../SongCard';

export default function SongCardExample() {
  return (
    <div className="p-8 flex gap-4 flex-wrap">
      <SongCard
        youtubeId="YR12Z8f1Dh8"
        title="Mere Sapno Ki Rani"
        artist="Kishore Kumar"
        tags={["classic", "romantic", "kishore"]}
        likes={1247}
        plays={15430}
        onLike={() => console.log('Liked')}
        onPlay={() => console.log('Play clicked')}
        onShare={() => console.log('Share clicked')}
      />
      <SongCard
        youtubeId="3Tqjf6teI-Q"
        title="Roja Janeman"
        artist="A R Rahman, S P Balasubrahmanyam"
        tags={["ar-rahman", "tamil"]}
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
