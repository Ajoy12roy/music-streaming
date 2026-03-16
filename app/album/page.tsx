"use client";
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BottomPlayer from '@/components/BottomPlayer';
import { 
  Search, Play, Heart, CalendarDays, 
  Music4, Loader2, X, Download, 
  Music, Star, Users 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { UserProfile } from '@/app/types';

// --- Interfaces ---
interface Song {
  id: string; 
  title: string; 
  artist: string; 
  previewUrl: string; 
  duration: string;
}

interface Album {
  id: number; 
  title: string; 
  artist: string; 
  genre: string; 
  releaseYear: number;
  trackCount: number; 
  duration: string; 
  coverImageUrl: string; 
  rating: number;
  listeners: string; 
  description: string; 
  songs: Song[];
}

export default function AlbumPage() {
  const { userData } = useAuth();
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTracksLoading, setIsTracksLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // ১. এপিআই থেকে অ্যালবাম সার্চ করা
  const fetchAlbums = async (query: string) => {
    setIsLoading(true);
    try {
      // iTunes API: entity=album দিয়ে শুধু অ্যালবাম ফেচ করছি (১৫টি কার্ডের জন্য limit=15)
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=album&limit=15`);
      const data = await res.json();
      
      const formattedAlbums = data.results.map((item: any) => ({
        id: item.collectionId,
        title: item.collectionName,
        artist: item.artistName,
        genre: item.primaryGenreName,
        releaseYear: new Date(item.releaseDate).getFullYear(),
        trackCount: item.trackCount,
        duration: "Full Album", 
        coverImageUrl: item.artworkUrl100.replace('100x100', '600x600'), // হাই-কোয়ালিটি ইমেজ
        rating: (Math.random() * (5 - 4) + 4).toFixed(1), // ডামি রেটিং
        listeners: Math.floor(Math.random() * 900 + 100) + 'K', // ডামি লিসেনার্স
        description: `Explore the amazing tracks from ${item.artistName}'s hit album "${item.collectionName}".`,
        songs: [] // গানগুলো ক্লিক করার পর লোড হবে
      }));
      
      setAlbums(formattedAlbums);
    } catch (error) {
      toast.error('Failed to fetch albums from API');
    } finally {
      setIsLoading(false);
    }
  };

  // পেজ লোড হলে ডিফল্ট ডেটা আনা
  useEffect(() => {
    fetchAlbums('trending bands');
    const savedFavs = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavs.map((s: any) => s.id));
  }, []);

  // ২. অ্যালবামে ক্লিক করলে এপিআই থেকে ওই অ্যালবামের গানগুলো (Tracklist) আনা
  const handleAlbumClick = async (album: Album) => {
    setSelectedAlbum(album); // মোডাল ওপেন হবে
    setIsTracksLoading(true); // লোডিং শুরু
    try {
      // iTunes Lookup API: অ্যালবামের আইডি দিয়ে তার ভেতরের গানগুলো খুঁজছি
      const res = await fetch(`https://itunes.apple.com/lookup?id=${album.id}&entity=song`);
      const data = await res.json();
      
      // প্রথম রেজাল্টটি হলো অ্যালবামের তথ্য, বাকিগুলো হলো গান (wrapperType === 'track')
      const tracks = data.results
        .filter((item: any) => item.wrapperType === 'track')
        .map((track: any) => ({
          id: track.trackId.toString(),
          title: track.trackName,
          artist: track.artistName,
          previewUrl: track.previewUrl,
          duration: new Date(track.trackTimeMillis || 0).toISOString().substring(14, 19)
        }));
        
      // গানগুলো অ্যালবামের স্টেটে সেভ করে দিচ্ছি
      setSelectedAlbum({ ...album, songs: tracks });
    } catch (error) {
      toast.error('Failed to load tracks for this album');
    } finally {
      setIsTracksLoading(false);
    }
  };

  // সার্চ বাটন ক্লিক বা এন্টার প্রেস করলে কাজ করবে
  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchAlbums(searchQuery);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const toggleFavorite = (song: Song) => {
    const savedFavs = JSON.parse(localStorage.getItem('favorites') || '[]');
    const isAlreadyFav = savedFavs.some((s: any) => s.id === song.id);
    const updated = isAlreadyFav ? savedFavs.filter((s: any) => s.id !== song.id) : [...savedFavs, song];
    setFavorites(updated.map((s: any) => s.id));
    localStorage.setItem('favorites', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage_updated'));
    toast.success(isAlreadyFav ? "Removed from Favorites" : "Added to Favorites");
  };

  const handleDownload = async (song: Song) => {
    try {
      toast.loading("Downloading...", { duration: 1500 });
      const response = await fetch(song.previewUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${song.title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      const downloaded = JSON.parse(localStorage.getItem('my_downloaded_playlist') || '[]');
      if (!downloaded.some((s: any) => s.id === song.id)) {
        localStorage.setItem('my_downloaded_playlist', JSON.stringify([...downloaded, song]));
        window.dispatchEvent(new Event('storage_updated'));
      }
      toast.success("Saved to My Playlists!");
    } catch (e) { toast.error("Download failed"); }
  };

  return (
    <main className="min-h-screen pb-40 bg-[#090215] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* রিয়েল-টাইম সার্চ বার */}
        <div className="relative mb-16 max-w-2xl mx-auto">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search any band or artist..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-16 pr-32 focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-2xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
            onClick={handleSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold transition-all"
          >
            Search
          </button>
        </div>

        <h2 className="text-3xl font-black uppercase mb-10 tracking-tighter">
          {searchQuery ? `Results for "${searchQuery}"` : "Featured Albums"}
        </h2>

        {/* 3 Cards in a Row Grid (lg:grid-cols-3) */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-purple-500 mb-4" size={50} />
            <p className="text-gray-500 font-bold tracking-widest uppercase">Fetching API Data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {albums.map(album => (
              <motion.div 
                key={album.id} 
                whileHover={{ y: -8 }}
                onClick={() => handleAlbumClick(album)}
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
                  <div className="min-w-0 pr-2">
                    <p className="text-xs uppercase font-bold tracking-widest text-purple-400 truncate">{album.artist}</p>
                    <p className="text-[10px] mt-1 truncate">{album.genre} • {album.releaseYear}</p>
                  </div>
                  <div className="text-right shrink-0">
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

      {/* --- Detail Modal with Real API Tracks --- */}
      <AnimatePresence>
        {selectedAlbum && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[#0f0a1a] w-full max-w-5xl rounded-[40px] overflow-hidden border border-white/10 flex flex-col md:flex-row max-h-[85vh]">
              {/* Left Column */}
              <div className="w-full md:w-2/5 p-10 bg-linear-to-br from-purple-900/20 to-transparent flex flex-col items-center text-center relative">
                <button onClick={() => setSelectedAlbum(null)} className="absolute top-6 left-6 p-2 bg-black/40 hover:bg-white/10 rounded-full transition-all"><X /></button>
                <img src={selectedAlbum.coverImageUrl} className="w-full aspect-square object-cover rounded-[35px] shadow-2xl mb-6" />
                <h2 className="text-3xl font-black mb-2">{selectedAlbum.title}</h2>
                <p className="text-purple-400 font-bold mb-4 uppercase tracking-widest">{selectedAlbum.artist}</p>
                <p className="text-sm text-gray-500 italic mb-6 line-clamp-3">{selectedAlbum.description}</p>
                <div className="flex gap-4">
                    <div className="bg-white/5 px-4 py-2 rounded-2xl text-xs font-bold"><CalendarDays className="inline mr-2" size={14}/>{selectedAlbum.releaseYear}</div>
                    <div className="bg-white/5 px-4 py-2 rounded-2xl text-xs font-bold"><Music4 className="inline mr-2" size={14}/>{selectedAlbum.trackCount} Songs</div>
                </div>
              </div>

              {/* Right Column: Tracklist */}
              <div className="flex-1 p-10 overflow-y-auto">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Music className="text-purple-500"/> Album Tracks</h3>
                
                {isTracksLoading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin text-purple-500 mb-4" size={40} />
                    <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">Loading Tracks...</p>
                  </div>
                ) : selectedAlbum.songs?.length > 0 ? (
                  <div className="space-y-3">
                    {selectedAlbum.songs.map((song, i) => (
                      <div key={song.id} className="group bg-white/5 hover:bg-purple-600/10 p-4 rounded-2xl flex items-center justify-between transition-all">
                        <div className="flex items-center gap-4 min-w-0">
                          <span className="text-xs text-gray-600 w-4">{i+1}</span>
                          <div onClick={() => setCurrentSong(`${song.title} ${song.artist}`)} className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center cursor-pointer shrink-0"><Play size={14} fill="white"/></div>
                          <div className="min-w-0 pr-4">
                            <p className="text-sm font-bold truncate">{song.title}</p>
                            <p className="text-[10px] text-gray-500 uppercase">{song.duration} MIN</p>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button onClick={() => toggleFavorite(song)} className={`p-2 rounded-lg ${favorites.includes(song.id) ? 'text-pink-500' : 'text-gray-500'}`}><Heart size={18} fill={favorites.includes(song.id) ? "currentColor" : "none"}/></button>
                          <button onClick={() => handleDownload(song)} className="p-2 text-gray-500 hover:text-purple-400"><Download size={18}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-gray-500">No preview tracks available for this album.</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomPlayer songQuery={currentSong} onClose={() => setCurrentSong(null)} />
    </main>
  );
}