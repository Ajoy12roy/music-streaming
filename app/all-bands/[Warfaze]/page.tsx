"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import BottomPlayer from '@/components/BottomPlayer';
import { fetchArtistTracks, Track } from '@/lib/lastFm';
import { Play, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function BandDetailsPage() {
  const params = useParams();

  // 1. MATCHING YOUR FOLDER: We look for the 'Warfaze' key found in your screenshot
  // We also keep 'id' as a backup just in case.
  const rawParameter = params?.Warfaze || params?.id;
  
  const artistName = rawParameter ? decodeURIComponent(rawParameter as string) : "Unknown";

  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSongQuery, setCurrentSongQuery] = useState<string | null>(null);

  useEffect(() => {
    if (artistName === "Unknown") return;

    const loadTracks = async () => {
      setLoading(true);
      try {
        const data = await fetchArtistTracks(artistName);
        setTracks(data);
      } catch (err) {
        console.error("Failed to load tracks", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadTracks();
  }, [artistName]);

  const playSong = (trackName: string) => {
    // This will now correctly result in "Warfaze Obak Bhalobasha audio"
    setCurrentSongQuery(`${artistName} ${trackName} audio`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090215] flex flex-col justify-center items-center text-white">
        <Loader2 className="animate-spin text-purple-500 mb-4" size={50} />
        <p className="text-gray-400">Loading {artistName}...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#090215] text-white pb-32">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link href="/All Brands" className="text-purple-400 hover:text-white flex items-center gap-2 mb-8 transition">
          <ArrowLeft size={18} /> Back to Search
        </Link>

        <h1 className="text-5xl font-bold mb-8 uppercase tracking-tight">
          {artistName} <span className="text-purple-500 text-2xl block mt-2">Top Songs</span>
        </h1>

        <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          {tracks.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              No songs found for "{artistName}".
            </div>
          ) : (
            tracks.map((track, index) => (
              <div 
                key={index} 
                onClick={() => playSong(track.name)}
                className="flex items-center gap-4 p-5 border-b border-white/5 hover:bg-white/10 cursor-pointer group transition-all"
              >
                <span className="text-gray-600 w-8 font-mono text-center group-hover:text-purple-400">
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                
                <div className="w-12 h-12 bg-white/5 rounded-xl flex justify-center items-center group-hover:bg-purple-600 group-hover:scale-110 transition-all duration-300">
                  <Play size={18} className="text-white fill-white opacity-50 group-hover:opacity-100" />
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-lg group-hover:text-purple-300 transition-colors">
                    {track.name}
                  </h3>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">
                    {parseInt(track.listeners).toLocaleString()} Listeners
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* The Music Player */}
      <BottomPlayer 
        songQuery={currentSongQuery} 
        onClose={() => setCurrentSongQuery(null)} 
      />
    </main>
  );
}