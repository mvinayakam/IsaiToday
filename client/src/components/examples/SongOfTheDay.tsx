import SongOfTheDay from '../SongOfTheDay';

export default function SongOfTheDayExample() {
  return (
    <SongOfTheDay
      youtubeId="YR12Z8f1Dh8"
      title="Mere Sapno Ki Rani"
      artist="Kishore Kumar"
      tags={["classic", "romantic", "kishore", "retro", "bollywood"]}
      likes={3421}
      onLike={() => console.log('Liked SOTD')}
      onAddToPlaylist={() => console.log('Add to playlist clicked')}
      onShare={() => console.log('Share SOTD')}
    />
  );
}
