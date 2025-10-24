import SongCard from '../SongCard';

export default function SongCardExample() {
  return (
    <div className="p-8 flex gap-4 flex-wrap">
      <SongCard
        youtubeId="CDNJbIeKFGQ"
        title="Piya Tu Ab To Aaja"
        artist="R D Burman, Asha Bhonsle"
        story="This song reminds me of my grandmother's old radio. RD's genius composition never gets old!"
        sharedBy="Priya R."
        tags={["classic", "retro", "bollywood"]}
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
        story="AR Rahman changed Tamil cinema music forever with this. Still gives me goosebumps!"
        sharedBy="Deepak K."
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
