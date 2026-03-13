"use client";
import { X, SkipBack, SkipForward, Volume2, Music, ExternalLink } from 'lucide-react';

interface BottomPlayerProps {
  songQuery: string | null;
  onClose: () => void;
}

export default function BottomPlayer({ songQuery, onClose }: BottomPlayerProps) {
  if (!songQuery) return null;

  const encodedQuery = encodeURIComponent(songQuery);
  
  // FIXED URL: We use the direct search results embed which is more stable
  const videoSrc = `https://www.youtube.com/embed?q=${encodedQuery}&autoplay=1&rel=0`;
  const youtubeSearchLink = `https://www.youtube.com/results?search_query=${encodedQuery}`;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-left-10 duration-500">
      <div className="bg-[#1a1425] border border-white/10 rounded-3xl p-4 w-85 shadow-2xl backdrop-blur-xl">
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-purple-400 uppercase tracking-widest">
            <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Music size={10} />
            </div>
            Live Track
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition">
            <X size={18} />
          </button>
        </div>

        <div className="relative aspect-video bg-black rounded-xl overflow-hidden mb-4 border border-white/5 group">
          <iframe
            width="100%"
            height="100%"
            src={videoSrc}
            title="YouTube player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0"
          ></iframe>
          
          {/* Fallback Overlay: Appears if YouTube blocks the embed */}
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <p className="text-[10px] text-gray-300 mb-2">Issue playing?</p>
            <a 
              href={youtubeSearchLink} 
              target="_blank" 
              className="pointer-events-auto bg-purple-600 hover:bg-purple-500 text-white text-[10px] px-3 py-1 rounded-full flex items-center gap-1"
            >
              Open in YouTube <ExternalLink size={10} />
            </a>
          </div>
        </div>

        <div className="text-center mb-6">
          <h4 className="text-white font-bold text-sm truncate px-4">
            {songQuery.replace(" audio", "")}
          </h4>
          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">YouTube Audio Source</p>
        </div>

        <div className="flex items-center justify-between gap-4">
           <SkipBack size={20} className="text-gray-600" />
           <div className="flex-1 flex items-center gap-3 bg-white/5 px-3 py-2 rounded-full">
              <Volume2 size={16} className="text-purple-400" />
              <div className="h-1.5 flex-1 bg-white/10 rounded-full">
                 <div className="h-full w-2/3 bg-purple-500 rounded-full"></div>
              </div>
           </div>
           <SkipForward size={20} className="text-gray-600" />
        </div>
      </div>
    </div>
  );
}