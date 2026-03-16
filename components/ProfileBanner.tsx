"use client";
import Image from 'next/image';
import { Settings, LogOut, Camera, Trash2, Upload, Mail, MapPin, Calendar, Music2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { UserProfile } from '@/app/types';
import { useAuth } from '@/context/AuthContext'; 

interface ProfileBannerProps {
  user: UserProfile;
  onEdit: () => void;
  onUpdateImage: (imageUrl: string | null) => void;
}

export default function ProfileBanner({ user, onEdit, onUpdateImage }: ProfileBannerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const { logout } = useAuth();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateImage(reader.result as string);
        setShowImageMenu(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-[45px] p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center gap-12 backdrop-blur-xl relative overflow-hidden group">
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full" />
      
      {/* Avatar Section */}
      <div className="relative shrink-0">
        <div 
          className="w-44 h-44 md:w-56 md:h-56 rounded-full border-4 border-purple-500/20 overflow-hidden shadow-2xl shadow-purple-500/10 cursor-pointer relative z-10"
          onClick={() => setShowImageMenu(!showImageMenu)}
        >
          <Image 
            src={user.image || "/assets/placeholder-user.png"} 
            alt="Profile" width={250} height={250} 
            className="w-full h-full object-cover transition duration-500 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition duration-300">
            <Camera className="text-white" size={32} />
          </div>
        </div>

        {showImageMenu && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-[#1a1033] border border-white/10 rounded-2xl shadow-2xl overflow-hidden min-w-[220px] z-30 animate-in slide-in-from-top-2">
            <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/5 text-sm transition text-white">
              <Upload size={18} className="text-blue-400" /> Change Photo
            </button>
            <button onClick={() => {onUpdateImage(null); setShowImageMenu(false);}} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/5 text-sm transition text-red-400">
              <Trash2 size={18} /> Remove Photo
            </button>
          </div>
        )}
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
      </div>

      {/* Info Section */}
      <div className="flex-1 text-center md:text-left z-10 min-w-0">
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
  <h1 className="text-3xl md:text-5xl font-black tracking-tight truncate bg-[linear-gradient(90deg,#3b82f6,#a855f7,#ec4899,#f59e0b,#3b82f6)] bg-clip-text text-transparent animate-gradient-text">
  {user.name}
</h1>
          <span className="inline-flex items-center px-3 py-1 bg-purple-500/20 text-purple-400 text-[10px] font-black rounded-full border border-purple-500/30 w-fit mx-auto md:mx-0">
            PREMIUM
          </span>
        </div>

        {user.bio && <p className="text-gray-400 text-sm md:text-base mb-6 max-w-2xl leading-relaxed italic">"{user.bio}"</p>}

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-sm mb-8">
          <InfoItem icon={<Mail size={16}/>} text={user.email} />
          <InfoItem icon={<MapPin size={16}/>} text={user.address || "Location not set"} />
          <InfoItem icon={<Calendar size={16}/>} text={user.dob || "Add Birthday"} />
          <InfoItem icon={<Music2 size={16}/>} text={user.type || "Favorite Genre"} />
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-center md:justify-start gap-10 mb-8 border-t border-white/5 pt-6">
          <StatBox label="Followers" value="1.2k" />
          <StatBox label="Following" value="458" />
          <StatBox label="Likes" value="8.4k" />
        </div>
        
        <div className="flex flex-wrap justify-center md:justify-start gap-4">
          <button onClick={onEdit} className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-bold shadow-xl transition hover:bg-purple-500 hover:text-white active:scale-95">
            <Settings size={20} /> Edit Profile
          </button>
          <button onClick={logout} className="flex items-center gap-2 px-8 py-3 border border-white/10 rounded-full font-bold bg-white/5 hover:bg-red-500/20 hover:text-red-500 transition text-white active:scale-95">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, text }: any) {
  return (
    <div className="flex items-center justify-center md:justify-start gap-3 text-gray-400">
      <span className="text-purple-500">{icon}</span>
      <span className="truncate">{text}</span>
    </div>
  );
}

function StatBox({ label, value }: any) {
  return (
    <div className="text-center md:text-left">
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{label}</p>
    </div>
  );
}