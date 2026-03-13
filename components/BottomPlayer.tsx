"use client";
import { X, Music, Volume2, SkipBack, SkipForward, Play, Pause, Loader2, VolumeX } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BottomPlayerProps {
  songQuery: string | null;
  onClose: () => void;
}

export default function BottomPlayer({ songQuery, onClose }: BottomPlayerProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // গান খোঁজা
  useEffect(() => {
    if (!songQuery) return;
    const fetchAudio = async () => {
      setIsLoading(true);
      setAudioUrl(null);
      setIsPlaying(false);
      try {
        const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(songQuery)}&entity=song&limit=1`);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          setAudioUrl(data.results[0].previewUrl);
        }
      } catch (error) {
        console.error("Audio error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAudio();
  }, [songQuery]);

  // টাইম আপডেট হ্যান্ডলার
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // প্রগ্রেস বার চেইঞ্জ (গানের পজিশন বদলানো)
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // ভলিউম চেইঞ্জ
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    setIsMuted(val === 0);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      isPlaying ? audioRef.current.pause() : audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  // টাইম ফরম্যাট (0:00)
  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!songQuery) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0, x: "-50%" }}
        animate={{ y: 0, opacity: 1, x: "-50%" }}
        exit={{ y: 100, opacity: 0, x: "-50%" }}
        className="fixed bottom-8 left-1/2 z-50 w-100"
      >
        <div className="bg-[#120d1d]/95 backdrop-blur-3xl border border-white/10 rounded-[40px] p-6 shadow-2xl relative overflow-hidden">
          
          {/* Top Info */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="flex gap-1 h-3">
                {[1, 2, 3].map(i => (
                  <motion.div key={i} animate={isPlaying ? { height: ["20%", "100%", "20%"] } : { height: "20%" }} transition={{ repeat: Infinity, duration: 0.6, delay: i*0.1 }} className="w-1 bg-purple-500 rounded-full" />
                ))}
              </span>
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Playing Now</span>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={20}/></button>
          </div>

          {/* Song Name */}
          <div className="text-center mb-6">
            <h4 className="text-white font-bold text-lg truncate">{songQuery}</h4>
            <p className="text-gray-500 text-[10px] uppercase mt-1">HQ Stream Preview</p>
          </div>

          {audioUrl && (
            <audio 
              ref={audioRef} 
              src={audioUrl} 
              autoPlay 
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          )}

          {/* Main Controls */}
          <div className="flex items-center justify-between mb-8 px-4">
            <SkipBack className="text-gray-500 cursor-pointer" />
            <button onClick={togglePlay} className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
              {isLoading ? <Loader2 className="animate-spin" /> : isPlaying ? <Pause fill="white" /> : <Play fill="white" className="ml-1" />}
            </button>
            <SkipForward className="text-gray-500 cursor-pointer" />
          </div>

          {/* Progress Timeline */}
          <div className="mb-6">
            <input 
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleProgressChange}
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between mt-2 text-[10px] text-gray-500 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl">
            {volume === 0 || isMuted ? <VolumeX size={18} className="text-gray-500" /> : <Volume2 size={18} className="text-purple-400" />}
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-purple-400"
            />
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}