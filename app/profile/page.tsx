"use client";
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import ProfileBanner from '@/components/ProfileBanner';
import EditProfileModal from '@/components/EditProfileModal';
import BottomPlayer from '@/components/BottomPlayer';
import { UserProfile, Song } from '@/app/types';
import { useAuth } from '@/context/AuthContext';
import { History, Play, Music, Trash2 } from 'lucide-react';

export default function ProfilePage() {
  const { userData } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  
  const [favSongs, setFavSongs] = useState<Song[]>([]);
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
  const [recentSongs, setRecentSongs] = useState([]);

  const refreshData = () => {
    // Favorites লোড করা
    const favData = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavSongs(favData.map((s: any) => ({
      id: s.id.toString(),
      title: s.title,
      artist: s.artist || s.movie,
    })));

    // ডাউনলোড করা গান (My Playlists) লোড করা
    const downloadedData = JSON.parse(localStorage.getItem('my_downloaded_playlist') || '[]');
    setPlaylistSongs(downloadedData.map((s: any) => ({
      id: s.id.toString(),
      title: s.title,
      artist: s.artist || s.movie,
    })));

    const recent = JSON.parse(localStorage.getItem('recentlyPlayed') || '[]');
    setRecentSongs(recent);
  };

  useEffect(() => {
    if (userData) {
      // ডাটা টাইপ এরর ফিক্স করতে সিম্পল অবজেক্ট তৈরি করা হলো
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser({
        name: String(userData.name || ""),
        email: String(userData.email || ""),
        phone: String(userData.phone || ""),
        dob: String(userData.dob || ""),
        image: String(userData.image || ""),
        bio: String(userData.bio || ""),
        address: String(userData.address || ""),
        gender: String(userData.gender || ""),
      } as UserProfile);
    }
    refreshData();
    window.addEventListener('storage_updated', refreshData);
    return () => window.removeEventListener('storage_updated', refreshData);
  }, [userData]);

  const handleTogglePlay = (song: any) => {
    if (playingSongId === song.id) {
      setCurrentSong(null);
      setPlayingSongId(null);
    } else {
      setCurrentSong(`${song.title} ${song.artist}`);
      setPlayingSongId(song.id);
    }
  };

  const handleRemoveFromPlaylist = (id: string) => {
    const downloadedData = JSON.parse(localStorage.getItem('my_downloaded_playlist') || '[]');
    const updated = downloadedData.filter((s: any) => s.id.toString() !== id);
    localStorage.setItem('my_downloaded_playlist', JSON.stringify(updated));
    refreshData();
    toast.success('Removed from playlist');
  };

  if (!user) return <div className="min-h-screen bg-[#090215] flex items-center justify-center text-white">Loading Profile...</div>;

  return (
    <main className="min-h-screen pb-40 bg-[#090215] text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        <ProfileBanner user={user} onEdit={() => setIsModalOpen(true)} onUpdateImage={() => {}} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          
          {/* Card 1: Favorite Songs */}
          <div className="bg-white/5 border border-white/10 rounded-[35px] p-6 h-full min-h-100">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-pink-500">❤️</span>
              <h2 className="text-lg font-bold">Favorite Songs</h2>
            </div>
            <div className="space-y-4">
              {favSongs.length > 0 ? favSongs.map(song => (
                <div key={song.id} className="bg-white/5 p-3 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <button onClick={() => handleTogglePlay(song)} className="p-2 bg-pink-600/20 text-pink-500 rounded-lg shrink-0">
                      <Play size={12} fill="currentColor" />
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold truncate">{song.title}</p>
                      <p className="text-[10px] text-gray-500 truncate">{song.artist}</p>
                    </div>
                  </div>
                </div>
              )) : <p className="text-xs text-gray-500 text-center py-10">No favorites.</p>}
            </div>
          </div>

          {/* Card 2: My Playlists (Downloaded Songs) */}
          <div className="bg-white/5 border border-white/10 rounded-[35px] p-6 h-full min-h-100">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-purple-500">📥</span>
              <h2 className="text-lg font-bold">My Playlists</h2>
            </div>
            <div className="space-y-4">
              {playlistSongs.length > 0 ? playlistSongs.map(song => (
                <div key={`dl-${song.id}`} className="bg-white/10 p-4 rounded-2xl flex items-center gap-4 group">
                  <div onClick={() => handleTogglePlay(song)} className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shrink-0 cursor-pointer hover:scale-105 transition-all">
                    <Music size={18} className="text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold truncate">{song.title}</p>
                    <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Downloaded</p>
                  </div>
                  <button onClick={() => handleRemoveFromPlaylist(song.id)} className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-500 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              )) : <p className="text-xs text-gray-500 text-center py-10">No songs downloaded.</p>}
            </div>
          </div>

          {/* Card 3: Recent Activity */}
          <div className="bg-white/5 border border-white/10 rounded-[35px] p-6 h-full min-h-100">
            <div className="flex items-center gap-3 mb-6">
              <History className="text-purple-500" size={20} />
              <h2 className="text-lg font-bold">Recent</h2>
            </div>
            <div className="space-y-4">
              {recentSongs.length > 0 ? recentSongs.slice(0,6).map((rs: any) => (
                <div key={rs.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl">
                  <div className="w-8 h-8 bg-purple-600/10 rounded-lg flex items-center justify-center text-purple-500 shrink-0">
                    <Play size={12} fill="currentColor" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{rs.title}</p>
                    <p className="text-[9px] text-gray-500">{new Date(rs.playedAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              )) : <p className="text-xs text-gray-500 text-center py-10">No history.</p>}
            </div>
          </div>
          
        </div>
      </div>
      <EditProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={() => {}} initialData={user} />
      <BottomPlayer songQuery={currentSong} onClose={() => { setCurrentSong(null); setPlayingSongId(null); }} />
    </main>
  );
}