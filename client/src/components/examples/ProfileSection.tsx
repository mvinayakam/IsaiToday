import ProfileSection from '../ProfileSection';
import avatar from '@assets/generated_images/Male_user_profile_avatar_e9b4c3bb.png';

export default function ProfileSectionExample() {
  return (
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
  );
}
