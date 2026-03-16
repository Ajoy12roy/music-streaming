"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Loader2, Search, Users } from "lucide-react";
import Link from "next/link";
import { fetchTopArtists, searchArtists, Band } from "@/lib/lastFm";
import { motion } from "framer-motion";

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

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6">

          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-500 to-red-500 bg-clip-text text-transparent">
              The Home of Music
            </h1>

            <p className="text-gray-400 mt-2">
              Discover your favorite bands and explore their music.
            </p>
          </motion.div>

          {/* SEARCH */}
          <motion.form
            onSubmit={handleSearch}
            className="relative w-full max-w-lg"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <input
              type="text"
              placeholder="Search bands"
              className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-4 pl-14 text-white outline-none focus:border-purple-500 transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              size={24}
            />

            <button type="submit" className="hidden">
              Search
            </button>
          </motion.form>
        </div>

        {isLoading ? (
          <div className="flex justify-center mt-20">
            <Loader2 className="animate-spin text-purple-500" size={50} />
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            {bands.map((band) => (
              <motion.div
                key={band.id}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6 }}
              >
                <Link href={`/all-bands/${encodeURIComponent(band.name)}`}>
                  <div className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition hover:-translate-y-3 hover:scale-[1.03] cursor-pointer">

                    <div className="h-56 w-full relative overflow-hidden">
                      <img
                        src={band.image}
                        alt={band.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                    </div>

                    <div className="p-5">
                      <h2 className="text-xl font-bold truncate">
                        {band.name}
                      </h2>

                      <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                        <Users size={14} />
                        {band.likes.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}