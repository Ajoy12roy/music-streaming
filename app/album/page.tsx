"use client";
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BottomPlayer from '@/components/BottomPlayer';
import { 
  Search, Play, Heart, CalendarDays, 
  Music4, Clock3, Loader2, X, Download, 
  Music, Star, Users 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { UserProfile } from '@/app/types';

// --- Interfaces ---
interface Song {
  id: string; title: string; artist: string; previewUrl: string; duration: string;
}

interface Album {
  id: number; title: string; artist: string; genre: string; releaseYear: number;
  trackCount: number; duration: string; coverImageUrl: string; rating: number;
  listeners: string; description: string; songs: Song[];
}

// --- ১২টি অ্যালবামের মক ডেটা ---
const mockFetchAlbums = async (): Promise<Album[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const genericSongs = [
    { id: 's1', title: 'Ocean Waves', artist: 'Various', duration: '03:45', previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { id: 's2', title: 'City Lights', artist: 'Various', duration: '04:10', previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  ];

  return [
    { id: 1, title: 'Midnight Chronicles', artist: 'Ashes Hits', genre: 'Rock', releaseYear: 2024, trackCount: 12, duration: '48:00', rating: 4.8, listeners: '1.2M', description: 'Experience the raw power of midnight rock.', coverImageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400', songs: genericSongs },
    { id: 2, title: 'Electric Dreams', artist: 'Neon Beats', genre: 'Electronic', releaseYear: 2024, trackCount: 10, duration: '42:15', rating: 4.5, listeners: '850K', description: 'Futuristic synthwave for the digital age.', coverImageUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=400', songs: genericSongs },
    { id: 3, title: 'Golden Sunset', artist: 'Lofi Girl', genre: 'Lofi', releaseYear: 2023, trackCount: 15, duration: '56:40', rating: 4.9, listeners: '2.5M', description: 'Chill beats to study and relax.', coverImageUrl: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=400', songs: genericSongs },
    { id: 4, title: 'Urban Symphony', artist: 'Metro Crew', genre: 'Hip-Hop', releaseYear: 2024, trackCount: 8, duration: '32:00', rating: 4.7, listeners: '500K', description: 'The heartbeat of the city streets.', coverImageUrl: 'https://images.unsplash.com/photo-1514525253361-bee8a19740c1?q=80&w=400', songs: genericSongs },
    { id: 5, title: 'Viking Soul', artist: 'Nordic Echo', genre: 'Folk', releaseYear: 2022, trackCount: 9, duration: '45:10', rating: 4.6, listeners: '300K', description: 'Ancient sounds from the north.', coverImageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400', songs: genericSongs },
    { id: 6, title: 'Jazz Cafe', artist: 'Smooth Sax', genre: 'Jazz', releaseYear: 2023, trackCount: 11, duration: '52:00', rating: 4.8, listeners: '1.1M', description: 'Elegant melodies for your evenings.', coverImageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=400', songs: genericSongs },
    { id: 7, title: 'Blue Horizon', artist: 'Coastal Vibes', genre: 'Pop', releaseYear: 2024, trackCount: 10, duration: '38:00', rating: 4.4, listeners: '720K', description: 'Summer anthems for the beach.', coverImageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400', songs: genericSongs },
    { id: 8, title: 'Techno Pulse', artist: 'DJ Nitro', genre: 'Techno', releaseYear: 2024, trackCount: 14, duration: '65:00', rating: 4.3, listeners: '450K', description: 'Non-stop energy for the club.', coverImageUrl: 'https://images.unsplash.com/photo-1514525253361-bee8a19740c1?q=80&w=400', songs: genericSongs },
    { id: 9, title: 'Silent Forest', artist: 'Nature Spirit', genre: 'Ambient', releaseYear: 2023, trackCount: 7, duration: '60:00', rating: 4.9, listeners: '200K', description: 'Deep meditation in nature.', coverImageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400', songs: genericSongs },
    { id: 10, title: 'Retro Groove', artist: 'Vinyl Kings', genre: 'Disco', releaseYear: 2021, trackCount: 12, duration: '50:20', rating: 4.7, listeners: '900K', description: 'Take a trip back to the 70s.', coverImageUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=400', songs: genericSongs },
    { id: 11, title: 'Acoustic Heart', artist: 'Solo String', genre: 'Acoustic', releaseYear: 2024, trackCount: 10, duration: '40:00', rating: 4.9, listeners: '1.5M', description: 'Pure emotions on a guitar.', coverImageUrl: 'https://images.unsplash.com/photo-1460039230329-eb070fc6c77c?q=80&w=400', songs: genericSongs },
    { id: 12, title: 'Hard Hitting', artist: 'Metal Core', genre: 'Metal', releaseYear: 2024, trackCount: 11, duration: '44:00', rating: 4.6, listeners: '600K', description: 'Intense riffs and heavy drums.', coverImageUrl: 'https://images.unsplash.com/photo-1526218626217-dc65a29bb444?q=80&w=400', songs: genericSongs },
  ];
};

export default function AlbumPage() {
  const { userData } = useAuth();
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [allAlbums, setAllAlbums] = useState<Album[]>([]);
  const [filteredAlbums, setFilteredAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const getAlbums = async () => {
      const data = await mockFetchAlbums();
      setAllAlbums(data);
      setFilteredAlbums(data);
      setIsLoading(false);
    };
    getAlbums();
    const savedFavs = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavs.map((s: any) => s.id));
  }, []);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    setFilteredAlbums(allAlbums.filter(a => 
      a.title.toLowerCase().includes(lowerQuery) || a.artist.toLowerCase().includes(lowerQuery)
    ));
  }, [searchQuery, allAlbums]);

  const toggleFavorite = (song: Song) => {
    const savedFavs = JSON.parse(localStorage.getItem('favorites') || '[]');
    const isAlreadyFav = savedFavs.some((s: any) => s.id === song.id);
    let updated = isAlreadyFav ? savedFavs.filter((s: any) => s.id !== song.id) : [...savedFavs, song];
    setFavorites(updated.map((s: any) => s.id));
    localStorage.setItem('favorites', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage_updated'));
    toast.success(isAlreadyFav ? "Removed from Favorites" : "Added to Favorites");
  };

  const handleDownload = (song: Song) => {
    const downloaded = JSON.parse(localStorage.getItem('my_downloaded_playlist') || '[]');
    if (!downloaded.some((s: any) => s.id === song.id)) {
      localStorage.setItem('my_downloaded_playlist', JSON.stringify([...downloaded, song]));
      window.dispatchEvent(new Event('storage_updated'));
    }
    toast.success("Saved to My Playlists!");
  };

  return (
    <main className="min-h-screen pb-40 bg-[#090215] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search Bar */}
        <div className="relative mb-16 max-w-2xl mx-auto">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search albums..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-16 pr-6 focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-2xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <h2 className="text-3xl font-black uppercase mb-10 tracking-tighter">Featured Albums</h2>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-purple-500" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {filteredAlbums.map(album => (
              <motion.div 
                key={album.id} 
                whileHover={{ y: -8 }}
                onClick={() => setSelectedAlbum(album)}
                className="bg-[#1a1425]/60 border border-white/5 rounded-[40px] p-6 cursor-pointer hover:bg-white/10 transition-all group shadow-2xl"
              >
                <div className="relative aspect-square mb-6 overflow-hidden rounded-[30px]">
                  <img src={album.coverImageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold">{album.rating}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-purple-600 p-5 rounded-full">
                      <Play fill="white" size={32} />
                    </div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold truncate mb-2">{album.title}</h3>
                
                <div className="flex items-center justify-between text-gray-400 border-t border-white/5 pt-4">
                  <div>
                    <p className="text-xs uppercase font-bold tracking-widest text-purple-400">{album.artist}</p>
                    <p className="text-[10px] mt-1">{album.genre} • {album.releaseYear}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end text-[10px] font-bold">
                      <Users size={12} /> {album.listeners}
                    </div>
                    <p className="text-[10px] mt-1">{album.trackCount} Tracks</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* --- Detail Modal --- */}
      <AnimatePresence>
        {selectedAlbum && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[#0f0a1a] w-full max-w-5xl rounded-[40px] overflow-hidden border border-white/10 flex flex-col md:flex-row max-h-[85vh]">
              {/* Left Column */}
              <div className="w-full md:w-2/5 p-10 bg-gradient-to-br from-purple-900/20 to-transparent flex flex-col items-center text-center">
                <button onClick={() => setSelectedAlbum(null)} className="absolute top-6 left-6 p-2 hover:bg-white/10 rounded-full"><X /></button>
                <img src={selectedAlbum.coverImageUrl} className="w-full aspect-square object-cover rounded-[35px] shadow-2xl mb-6" />
                <h2 className="text-3xl font-black mb-2">{selectedAlbum.title}</h2>
                <p className="text-purple-400 font-bold mb-4">{selectedAlbum.artist}</p>
                <p className="text-sm text-gray-500 italic mb-6">"{selectedAlbum.description}"</p>
                <div className="flex gap-4">
                    <div className="bg-white/5 px-4 py-2 rounded-2xl text-xs font-bold"><CalendarDays className="inline mr-2" size={14}/>{selectedAlbum.releaseYear}</div>
                    <div className="bg-white/5 px-4 py-2 rounded-2xl text-xs font-bold"><Music4 className="inline mr-2" size={14}/>{selectedAlbum.trackCount} Songs</div>
                </div>
              </div>

              {/* Right Column: Tracklist */}
              <div className="flex-1 p-10 overflow-y-auto">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Music className="text-purple-500"/> Tracklist</h3>
                <div className="space-y-3">
                  {selectedAlbum.songs.map((song, i) => (
                    <div key={song.id} className="group bg-white/5 hover:bg-purple-600/10 p-4 rounded-2xl flex items-center justify-between transition-all">
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-600">{i+1}</span>
                        <div onClick={() => setCurrentSong(`${song.title} ${song.artist}`)} className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center cursor-pointer"><Play size={14} fill="white"/></div>
                        <div>
                          <p className="text-sm font-bold">{song.title}</p>
                          <p className="text-[10px] text-gray-500 uppercase">{song.duration} MIN</p>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => toggleFavorite(song)} className={`p-2 rounded-lg ${favorites.includes(song.id) ? 'text-pink-500' : 'text-gray-500'}`}><Heart size={18} fill={favorites.includes(song.id) ? "currentColor" : "none"}/></button>
                        <button onClick={() => handleDownload(song)} className="p-2 text-gray-500 hover:text-purple-400"><Download size={18}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomPlayer songQuery={currentSong} onClose={() => setCurrentSong(null)} />
    </main>
  );
}