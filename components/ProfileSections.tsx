"use client";
import { Heart, ListMusic, Plus, Trash2, X, Check, Play, Pause } from 'lucide-react';
import { useState } from 'react';
import { Song, Playlist } from '@/app/types';

interface ProfileSectionsProps {
  songs: Song[];
  playlists: Playlist[];
  onAddSong: (song: Omit<Song, 'id'>) => void;
  onRemoveSong: (id: string) => void;
  onAddPlaylist: (playlist: Omit<Playlist, 'id'>) => void;
  onRemovePlaylist: (id: string) => void;
  // New Props for Audio
  playingSongId: string | null;
  onTogglePlay: (id: string) => void;
}

export default function ProfileSections({ 
  songs, playlists, onAddSong, onRemoveSong, onAddPlaylist, onRemovePlaylist,
  playingSongId, onTogglePlay
}: ProfileSectionsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8 mt-8">
      
      {/* --- FAVORITE SONGS SECTION --- */}
      <SectionCard 
        title="Favorite Songs" 
        icon={<Heart className="text-pink-500" size={20} fill="currentColor" />}
      >
        <div className="space-y-4">
          {songs.map((song) => (
            <ListItem 
              key={song.id}
              id={song.id}
              title={song.title} 
              subtitle={song.artist} 
              time={song.duration} 
              // We check if THIS song is the one currently playing
              isPlaying={playingSongId === song.id}
              // When clicked, we tell the parent to toggle audio
              onPlay={() => onTogglePlay(song.id)}
              onDelete={() => onRemoveSong(song.id)}
            />
          ))}
          <AddItemForm 
            type="song" 
            onSave={(title, sub) => onAddSong({ title, artist: sub, duration: "3:45" })} 
          />
        </div>
      </SectionCard>

      {/* --- PLAYLISTS SECTION --- */}
      <SectionCard 
        title="My Playlists" 
        icon={<ListMusic className="text-purple-400" size={20} />}
      >
        <div className="space-y-4">
          {playlists.map((list) => (
            <PlaylistListItem 
              key={list.id}
              title={list.title} 
              subtitle={list.subtitle} 
              onDelete={() => onRemovePlaylist(list.id)}
            />
          ))}
          <AddItemForm 
            type="playlist" 
            onSave={(title, sub) => onAddPlaylist({ title, subtitle: sub })} 
          />
        </div>
      </SectionCard>

    </div>
  );
}

// --- SUB-COMPONENTS ---

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-[35px] p-8 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6 text-xl font-bold text-white">
        {icon}
        <h2>{title}</h2>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

// 1. Song List Item (Now with Play/Pause)
function ListItem({ title, subtitle, time, isPlaying, onPlay, onDelete }: { id: string; title: string; subtitle: string; time: string; isPlaying: boolean; onPlay: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition cursor-pointer group relative">
      <div className="flex items-center gap-4">
        {/* Play Button Container */}
        <button 
          onClick={(e) => { e.stopPropagation(); onPlay(); }}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            isPlaying 
              ? "bg-purple-600 text-white shadow-lg shadow-purple-500/40 scale-105" 
              : "bg-white/5 text-purple-400 group-hover:bg-purple-500 group-hover:text-white"
          }`}
        >
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
        </button>
        
        <div>
          <h4 className={`font-bold text-sm ${isPlaying ? "text-purple-400" : "text-white"}`}>{title}</h4>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
      </div>
      
      <div className="flex items-center">
        {isPlaying && (
           // Visual Equalizer Animation when playing
           <div className="flex gap-1 mr-10 h-3 items-end">
             <div className="w-1 bg-purple-500 animate-bounce h-2"style={{ animationDelay: "0.2s" }}></div>
             <div className="w-1 bg-purple-600 animate-bounce h-4" style={{ animationDelay: "0.3s" }}></div>
             <div className="w-1 bg-purple-700 animate-bounce h-3" style={{ animationDelay: "0.4s" }}></div>
             <div className="w-1 bg-purple-900 animate-bounce h-5" style={{ animationDelay: "0.5s" }}></div>
             <div className="w-1 bg-purple-800 animate-bounce h-2" style={{ animationDelay: "0.7s" }}></div>
           </div>
        )}
        <span className="text-xs text-gray-500 group-hover:hidden">{time}</span>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-2 text-red-400 bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition hover:bg-red-500 hover:text-white absolute right-3"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

// 2. Playlist Item (Simpler, no play button)
function PlaylistListItem({ title, subtitle, onDelete }: { title: string; subtitle: string; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition cursor-pointer group relative">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
           <ListMusic size={20} />
        </div>
        <div>
          <h4 className="font-bold text-sm text-white">{title}</h4>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="p-2 text-red-400 bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition hover:bg-red-500 hover:text-white"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

// 3. Add Item Form (Same as before)
function AddItemForm({ type, onSave }: { type: string, onSave: (t: string, s: string) => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const handleSave = () => {
    if (title && subtitle) {
      onSave(title, subtitle);
      setTitle("");
      setSubtitle("");
      setIsAdding(false);
    }
  };

  if (!isAdding) {
    return (
      <button 
        onClick={() => setIsAdding(true)}
        className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-gray-500 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/5 transition flex items-center justify-center gap-2 font-semibold"
      >
        <Plus size={18} /> Add {type === 'song' ? 'Song' : 'Playlist'}
      </button>
    );
  }

  return (
    <div className="p-4 bg-white/5 rounded-2xl border border-purple-500/30 animate-in fade-in zoom-in duration-200">
      <h4 className="text-xs font-bold text-purple-400 uppercase mb-3">New {type}</h4>
      <div className="space-y-3">
        <input 
          autoFocus placeholder={type === 'song' ? "Song Name" : "Playlist Name"}
          className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
          value={title} onChange={(e) => setTitle(e.target.value)}
        />
        <input 
          placeholder={type === 'song' ? "Artist Name" : "Details"}
          className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
          value={subtitle} onChange={(e) => setSubtitle(e.target.value)}
        />
        <div className="flex gap-2 mt-2">
          <button onClick={handleSave} className="flex-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg py-2 text-xs font-bold flex items-center justify-center gap-1"><Check size={14} /> Save</button>
          <button onClick={() => setIsAdding(false)} className="px-3 bg-white/5 hover:bg-white/10 text-white rounded-lg py-2 text-xs font-bold"><X size={14} /></button>
        </div>
      </div>
    </div>
  );
}