import SongOfTheDay from '../SongOfTheDay';

export default function SongOfTheDayExample() {
  return (
    <SongOfTheDay
      youtubeId="CDNJbIeKFGQ"
      title="Piya Tu Ab To Aaja"
      artist="R D Burman, Asha Bhonsle"
      story="This masterpiece by RD Burman takes me back to lazy Sunday afternoons at my grandmother's house. The way Asha Bhonsle's voice dances through the melody is pure magic."
      tags={["classic", "retro", "rd-burman", "asha-bhonsle", "bollywood"]}
      likes={3421}
      onLike={() => console.log('Liked SOTD')}
      onAddToPlaylist={() => console.log('Add to playlist clicked')}
      onShare={() => console.log('Share SOTD')}
    />
  );
}
