import SongOfTheDay from '../SongOfTheDay';

export default function SongOfTheDayExample() {
  return (
    <SongOfTheDay
      youtubeId="kJQP7kiw5Fk"
      title="Despacito"
      artist="Luis Fonsi ft. Daddy Yankee"
      tags={["latin", "reggaeton", "summer", "dance"]}
      likes={3421}
      onLike={() => console.log('Liked SOTD')}
      onAddToPlaylist={() => console.log('Add to playlist clicked')}
      onShare={() => console.log('Share SOTD')}
    />
  );
}
