"use client";
import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import ProfileBanner from '@/components/ProfileBanner';
import ProfileSections from '@/components/ProfileSections';
import EditProfileModal from '@/components/EditProfileModal';
import { UserProfile, Song, Playlist } from '@/app/types';
// 1. Import the Auth Context
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { userData } = useAuth(); // Get the logged-in user's data
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // --- AUDIO STATE ---
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- USER STATE (Initializes from context data) ---
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (!userData) return null;
    return {
      ...userData,
      name: typeof userData.name === 'string' ? userData.name : '',
      phone: typeof userData.phone === 'string' ? userData.phone : (userData.phone ? String(userData.phone) : ''),
      dob: typeof userData.dob === 'string' ? userData.dob : (userData.dob ? String(userData.dob) : ''),
      image: typeof userData.image === 'string' ? userData.image : '',
    };
  });

  const [songs, setSongs] = useState<Song[]>([
    { id: '1', title: 'Broken Dreams', artist: 'Ashes Hits', duration: '3:45' },
    { id: '2', title: 'Midnight Sky', artist: 'Neon Beats', duration: '4:12' },
    { id: '3', title: 'Echoes of Time', artist: 'Retro Vibes', duration: '5:03' },
  ]);

  const [playlists, setPlaylists] = useState<Playlist[]>([
    { id: '1', title: 'Chill Vibes', subtitle: '24 songs' },
    { id: '2', title: 'Workout Mix', subtitle: '18 songs' },
  ]);

  // --- AUDIO LOGIC ---
  const handleTogglePlay = (id: string) => {
    if (playingSongId === id) {
      audioRef.current?.pause();
      setPlayingSongId(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      const sampleAudioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
      audioRef.current = new Audio(sampleAudioUrl);
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      setPlayingSongId(id);
      audioRef.current.onended = () => setPlayingSongId(null);
    }
  };

  useEffect(() => {
    return () => { if (audioRef.current) audioRef.current.pause(); };
  }, []);

  // --- UPDATED SAVE HANDLER: Save to LocalStorage ---
  const handleSaveProfile = async (updatedData: UserProfile) => {
    const savePromise = new Promise(async (resolve) => {
      // Simulate backend delay
      await new Promise(res => setTimeout(res, 1000));
      
      // Update UI
      setUser(updatedData);

      // 3. PERSISTENCE: Save updated info to "Local Database"
      // This ensures that when they log in next time, they see the new info
      localStorage.setItem('registeredUser', JSON.stringify(updatedData));
      localStorage.setItem('currentUser', JSON.stringify(updatedData));
      
      resolve(updatedData);
    });

    toast.promise(savePromise, {
      loading: 'Saving changes...',
      success: <b>Profile updated!</b>,
      error: <b>Could not save.</b>,
    });
  };

  const handleImageUpdate = (file: File | null) => {
    if (file && user) {
      const previewUrl = URL.createObjectURL(file);
      const updatedUser = { ...user, image: previewUrl };
      setUser(updatedUser);
      
      // Update storage for image too
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      toast.success('Photo uploaded!');
    } else if (user) {
      const updatedUser = { ...user, image: "" };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      toast.error('Photo removed.');
    }
  };

  // List Handlers
  const handleAddSong = (newSong: Omit<Song, 'id'>) => {
    const songWithId = { ...newSong, id: Math.random().toString(36).substr(2, 9) };
    setSongs([...songs, songWithId]);
    toast.success('Song added to favorites!');
  };

  const handleRemoveSong = (id: string) => {
    if (playingSongId === id) {
      audioRef.current?.pause();
      setPlayingSongId(null);
    }
    setSongs(songs.filter(song => song.id !== id));
    toast.success('Song removed.');
  };

  const handleAddPlaylist = (newPlaylist: Omit<Playlist, 'id'>) => {
    const listWithId = { ...newPlaylist, id: Math.random().toString(36).substr(2, 9) };
    setPlaylists([...playlists, listWithId]);
    toast.success('Playlist created!');
  };

  const handleRemovePlaylist = (id: string) => {
    setPlaylists(playlists.filter(list => list.id !== id));
    toast.success('Playlist deleted.');
  };

  // 4. Loading State
  if (!user) return <div className="min-h-screen bg-[#090215] flex items-center justify-center text-white">Loading your music profile...</div>;

  return (
    <main className="min-h-screen relative overflow-hidden pb-20 bg-[#090215] text-white">
      <div className="absolute top-0 right-0 w-150 h-150 bg-purple-600/10 blur-[150px] -z-10" />
      <div className="absolute bottom-0 left-0 w-150 h-150 bg-blue-600/10 blur-[150px] -z-10" />
      
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 space-y-10">
        <ProfileBanner 
          user={user} 
          onEdit={() => setIsModalOpen(true)} 
          onUpdateImage={handleImageUpdate}
        />
        
        <ProfileSections 
          songs={songs}
          playlists={playlists}
          onAddSong={handleAddSong}
          onRemoveSong={handleRemoveSong}
          onAddPlaylist={handleAddPlaylist}
          onRemovePlaylist={handleRemovePlaylist}
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
    </main>
  );
}