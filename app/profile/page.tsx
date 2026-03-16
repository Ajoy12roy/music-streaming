"use client";
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import ProfileBanner from '@/components/ProfileBanner';
import EditProfileModal from '@/components/EditProfileModal';
import BottomPlayer from '@/components/BottomPlayer';
import ProfileSections from '@/components/ProfileSections'; 
import { UserProfile, Song, Playlist } from '@/app/types';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { userData } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([
    { id: '1', title: 'My Favorites', subtitle: 'Saved Tracks' }
  ]);

  const refreshData = () => {
    const favData = JSON.parse(localStorage.getItem('favorites') || '[]');
    const downloadedData = JSON.parse(localStorage.getItem('my_downloaded_playlist') || '[]');
    const combined = [...favData, ...downloadedData];
    const uniqueSongs = Array.from(new Map(combined.map((item: any) => [item.id, item])).values());
    
    setSongs(uniqueSongs.map((s: any) => ({
      id: s.id.toString(),
      title: s.title,
      artist: s.artist || s.movie,
      duration: s.duration || "3:45"
    })));
  };

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUser(JSON.parse(savedProfile));
    } else if (userData) {
      const defaultUser: UserProfile = {
        name: String(userData.name || "Music Enthusiast"),
        email: String(userData.email || ""),
        phone: String(userData.phone || ""),
        dob: String(userData.dob || ""),
        image: String(userData.image || ""),
        bio: "Music is my life's soundtrack. Always looking for new vibes.",
        address: "Dhaka, Bangladesh",
        type: "Indie Pop",
      };
      setUser(defaultUser);
      localStorage.setItem('userProfile', JSON.stringify(defaultUser));
    }
    
    refreshData();
  }, [userData]);

  const handleImageUpdate = (imageUrl: string | null) => {
    if (user) {
      const updatedUser = { ...user, image: imageUrl || '' };
      setUser(updatedUser);
      localStorage.setItem('userProfile', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('profileUpdate'));
      toast.success("Profile photo updated!");
    }
  };

  const handleSaveProfile = async (updatedData: UserProfile) => {
    if (user) {
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      localStorage.setItem('userProfile', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('profileUpdate'));
      toast.success("Premium profile updated!");
    }
  };

  const handleTogglePlay = (id: string) => {
    const selectedSong = songs.find(s => s.id === id);
    if (selectedSong) {
      if (playingSongId === id) {
        setCurrentSong(null);
        setPlayingSongId(null);
      } else {
        setCurrentSong(`${selectedSong.title} ${selectedSong.artist}`);
        setPlayingSongId(id);
      }
    }
  };

  if (!user) return <div className="min-h-screen bg-[#090215] flex items-center justify-center text-white font-black animate-pulse text-2xl">LOADING...</div>;

  return (
    <main className="min-h-screen pb-40 bg-[#090215] text-white overflow-x-hidden relative">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/5 blur-[180px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[180px] -z-10 rounded-full" />
      
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <ProfileBanner 
          user={user} 
          onEdit={() => setIsModalOpen(true)} 
          onUpdateImage={handleImageUpdate} 
        />
        
        <ProfileSections 
          songs={songs}
          playlists={playlists}
          onAddSong={() => toast.error('Feature coming soon')}
          onRemoveSong={(id) => {}}
          onAddPlaylist={() => {}}
          onRemovePlaylist={() => {}}
          playingSongId={playingSongId}
          onTogglePlay={handleTogglePlay}
        />
      </div>

      <EditProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveProfile} 
        initialData={user} 
      />
      
      <BottomPlayer songQuery={currentSong} onClose={() => { setCurrentSong(null); setPlayingSongId(null); }} />
    </main>
  );
}