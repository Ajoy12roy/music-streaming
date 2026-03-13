"use client";
import { useEffect, useState, use } from 'react';
import Navbar from '@/components/Navbar';
import BottomPlayer from '@/components/BottomPlayer';
import { fetchArtistTracks, Track } from '@/lib/lastFm';
import { Play, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function BandDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const rawId = resolvedParams?.id || "";
  const artistName = rawId ? decodeURIComponent(rawId) : "Unknown Artist";
  
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSong, setCurrentSong] = useState<string | null>(null);

  useEffect(() => {
    if (artistName !== "Unknown Artist") {
      const loadTracks = async () => {
        setLoading(true);
        try {
          const data = await fetchArtistTracks(artistName);
          setTracks(data || []);
        } catch (error) {
          console.error("Error loading tracks:", error);
        } finally {
          setLoading(false);
        }
      };
      loadTracks();
    }
  }, [artistName]);

  if (loading) return (
    <div className="min-h-screen bg-[#090215] flex flex-col justify-center items-center text-white">
      <Loader2 className="animate-spin text-purple-500 mb-4" size={50} />
      <p>Loading {artistName}'s Tracks...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#090215] text-white pb-32">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link href="/all-bands" className="flex items-center gap-2 text-purple-400 mb-8 hover:underline">
          <ArrowLeft size={18} /> Back to Search
        </Link>

        <h1 className="text-5xl font-bold mb-2 uppercase tracking-tight">{artistName}</h1>
        <p className="text-purple-500 font-medium mb-10">TOP SONGS</p>

        <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden">
          {tracks.length > 0 ? tracks.map((track, index) => (
            <div 
              key={index} 
              onClick={() => setCurrentSong(`${artistName} ${track.name}`)}
              className="flex items-center gap-4 p-5 border-b border-white/5 hover:bg-white/10 cursor-pointer group transition"
            >
              <span className="text-gray-600 font-bold w-6">{(index + 1).toString().padStart(2, '0')}</span>
              <div className="w-10 h-10 bg-white/5 rounded-xl flex justify-center items-center group-hover:bg-purple-600 transition">
                <Play size={16} fill="white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{track.name}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Listen in Player</p>
              </div>
            </div>
          )) : (
            <div className="p-10 text-center text-gray-500">No songs found for this artist.</div>
          )}
        </div>
      </div>

      <BottomPlayer songQuery={currentSong} onClose={() => setCurrentSong(null)} />
    </main>
  );
}