"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import BottomPlayer from "@/components/BottomPlayer";
import { Play, Heart, Download } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface MovieSong {
  id: number;
  title: string;
  movie: string;
  artist: string;
  year: string;
  rating: string;
  duration: string;
  image: string;
  previewUrl: string;
}

export default function AllMovieSongs() {
  const [songs, setSongs] = useState<MovieSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [, setPlayingId] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  const searchMusic = async (query: string = "movie soundtrack") => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(
          query
        )}&entity=song&limit=24`
      );
      const data = await res.json();

      const formattedSongs = data.results.map((item: any) => ({
        id: item.trackId,
        title: item.trackName,
        movie: item.collectionName || "Movie Track",
        artist: item.artistName,
        year: new Date(item.releaseDate).getFullYear().toString(),
        rating: (Math.random() * (5 - 4) + 4).toFixed(1),
        duration: new Date(item.trackTimeMillis).toISOString().substr(14, 5),
        image: item.artworkUrl100.replace("100x100", "400x400"),
        previewUrl: item.previewUrl,
      }));

      setSongs(formattedSongs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchMusic();

    const savedFavs = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(savedFavs.map((s: any) => s.id));
  }, []);

  const handleDownloadOnly = async (song: MovieSong) => {
    try {
      const response = await fetch(song.previewUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${song.title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);

      const downloadedList = JSON.parse(
        localStorage.getItem("my_downloaded_playlist") || "[]"
      );

      const isAlreadySaved = downloadedList.some(
        (s: any) => s.id === song.id
      );

      if (!isAlreadySaved) {
        const updatedList = [...downloadedList, song];
        localStorage.setItem(
          "my_downloaded_playlist",
          JSON.stringify(updatedList)
        );
        toast.success("Downloaded & added to My Playlists!");
        window.dispatchEvent(new Event("storage_updated"));
      } else {
        toast.success("Download complete!");
      }
    } catch {
      toast.error("Download failed!");
    }
  };

  const toggleFavorite = (song: MovieSong) => {
    const savedFavs = JSON.parse(localStorage.getItem("favorites") || "[]");
    const isAlreadyFav = savedFavs.some((s: any) => s.id === song.id);

    let updatedFavs;

    if (isAlreadyFav) {
      updatedFavs = savedFavs.filter((s: any) => s.id !== song.id);
      setFavorites(favorites.filter((id) => id !== song.id));
      toast.success("Removed from Favorites");
    } else {
      updatedFavs = [...savedFavs, song];
      setFavorites([...favorites, song.id]);
      toast.success("Added to Favorites");
    }

    localStorage.setItem("favorites", JSON.stringify(updatedFavs));
    window.dispatchEvent(new Event("storage_updated"));
  };

  return (
    <motion.main
      className="min-h-screen bg-[#0d071a] text-white pb-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* SEARCH */}
        <motion.div
          className="relative mb-16 max-w-3xl mx-auto group"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <input
            type="text"
            placeholder="Search songs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchMusic(searchQuery)}
            className="w-full bg-white/5 border border-white/10 rounded-[25px] py-6 pl-10 pr-32 text-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
          />

          <button
            onClick={() => searchMusic(searchQuery)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-purple-600 px-6 py-3 rounded-2xl font-bold hover:bg-purple-700 transition"
          >
            Search
          </button>
        </motion.div>

        {loading ? (
          <div className="text-center py-20 animate-pulse">Loading...</div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
            {songs.map((song) => (
              <motion.div
                key={song.id}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="bg-[#1a1425]/60 border border-white/5 rounded-[35px] p-6 group"
              >
                <div className="flex items-center gap-5">

                  <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-3xl">
                    <img
                      src={song.image}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />

                    <div
                      onClick={() => {
                        setCurrentSong(`${song.title} ${song.artist}`);
                        setPlayingId(song.id);
                      }}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      <Play fill="white" size={30} />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold truncate">{song.title}</h3>
                    <p className="text-purple-400 text-xs truncate uppercase">
                      {song.movie}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6 pt-5 border-t border-white/5">
                  <span className="text-[10px] text-gray-500">
                    {song.duration} MIN
                  </span>

                  <div className="flex gap-2">

                    <button
                      onClick={() => toggleFavorite(song)}
                      className={`p-3 rounded-full ${
                        favorites.includes(song.id)
                          ? "bg-pink-500/20 text-pink-500"
                          : "bg-white/5"
                      }`}
                    >
                      <Heart
                        size={18}
                        fill={
                          favorites.includes(song.id)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>

                    <button
                      onClick={() => handleDownloadOnly(song)}
                      className="p-3 rounded-full bg-white/5 hover:bg-purple-500/20 text-gray-400"
                    >
                      <Download size={18} />
                    </button>

                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <BottomPlayer
        songQuery={currentSong}
        onClose={() => {
          setCurrentSong(null);
          setPlayingId(null);
        }}
      />
    </motion.main>
  );
}