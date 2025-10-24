import PlaylistCard from '../PlaylistCard';

export default function PlaylistCardExample() {
  return (
    <div className="p-8 flex gap-4 flex-wrap">
      <PlaylistCard
        id="1"
        title="Chill Vibes"
        songCount={24}
        onClick={() => console.log('Playlist clicked')}
        onPlay={() => console.log('Play playlist')}
        onMore={() => console.log('More options')}
      />
      <PlaylistCard
        id="2"
        title="Workout Motivation"
        songCount={18}
        onClick={() => console.log('Playlist clicked')}
        onPlay={() => console.log('Play playlist')}
        onMore={() => console.log('More options')}
      />
      <PlaylistCard
        id="3"
        title="Road Trip Favorites"
        songCount={42}
        onClick={() => console.log('Playlist clicked')}
        onPlay={() => console.log('Play playlist')}
        onMore={() => console.log('More options')}
      />
    </div>
  );
}
