import Navbar from '../Navbar';
import avatar from '@assets/generated_images/Female_user_profile_avatar_9e8367fc.png';

export default function NavbarExample() {
  return (
    <Navbar 
      userAvatar={avatar}
      userName="Sarah Chen"
      onMenuClick={() => console.log('Menu clicked')}
      onSearchChange={(value) => console.log('Search:', value)}
      onProfileClick={() => console.log('Profile clicked')}
    />
  );
}
