"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Loader2, Search, Users } from "lucide-react";
import Link from 'next/link';
import { fetchTopArtists, searchArtists, Band } from "@/lib/lastFm"; 

export default function AllBandsPage() {
  const [bands, setBands] = useState<Band[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); 

  useEffect(() => {
    const loadTopCharts = async () => {
      const topData = await fetchTopArtists();
      setBands(topData);
      setIsLoading(false);
    };
    loadTopCharts();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    const results = await searchArtists(searchQuery);
    setBands(results);
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#090215] text-white pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 mt-8 mb-12">
        <form onSubmit={handleSearch} className="relative w-full max-w-lg mb-8">
          <input 
            type="text" 
            placeholder="Search bands (e.g., Warfaze)..."
            className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-4 pl-14 text-white outline-none focus:border-purple-500 transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
          <button type="submit" className="hidden">Search</button>
        </form>

        {isLoading ? (
          <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-purple-500" size={50} /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bands.map((band) => (
              // THIS LINK IS CRITICAL: It sends the user to the [id] page
              <Link href={`/all-bands/${encodeURIComponent(band.name)}`} key={band.id}>
                <div className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition hover:-translate-y-2 cursor-pointer">
                  <div className="h-56 w-full relative">
                    <img src={band.image} alt={band.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5">
                    <h2 className="text-xl font-bold truncate">{band.name}</h2>
                    <p className="text-sm text-gray-400 flex items-center gap-1 mt-1"><Users size={14}/> {band.likes.toLocaleString()}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}