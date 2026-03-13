"use client";
import Image from 'next/image';
import { Settings, LogOut, Camera, Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { UserProfile } from '@/app/types';
// 1. Import the Auth hook
import { useAuth } from '@/context/AuthContext'; 

interface ProfileBannerProps {
  user: UserProfile;
  onEdit: () => void;
  onUpdateImage: (file: File | null) => void;
}

export default function ProfileBanner({ user, onEdit, onUpdateImage }: ProfileBannerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showImageMenu, setShowImageMenu] = useState(false);
  
  // 2. Access the logout function from our context
  const { logout } = useAuth();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpdateImage(file);
      setShowImageMenu(false);
    }
  };

  const handleRemoveImage = () => {
    onUpdateImage(null);
    setShowImageMenu(false);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-[40px] p-24 flex flex-col md:flex-row items-center gap-10 backdrop-blur-md">
      
      {/* Avatar Section */}
      <div className="relative group">
        <div 
          className="w-49 h-49 rounded-full border-4 border-purple-500/30 overflow-hidden shadow-2xl shadow-purple-500/20 cursor-pointer relative"
          onClick={() => setShowImageMenu(!showImageMenu)}
        >
          <Image 
            src={user.image || "/assets/placeholder-user.png"} 
            alt="" 
            width={176} 
            height={176} 
            className="w-full h-full object-cover" 
          />
          
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
            <Camera className="text-white" size={34} />
          </div>
        </div>

        {showImageMenu && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 bg-[#1a1033] border border-white/20 rounded-xl shadow-xl overflow-hidden min-w-42.5 z-20">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-sm transition text-left text-white"
            >
              <Upload size={16} className="text-blue-400" /> Change Photo
            </button>
            <button 
              onClick={handleRemoveImage}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-sm transition text-left text-red-400"
            >
              <Trash2 size={16} /> Remove Photo
            </button>
          </div>
        )}

        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleImageUpload} 
        />
      </div>

      {/* Info Section */}
      <div className="flex-1 text-center md:text-left">

        <h1 className="text-4xl font-bold mb-2 text-white">{user.name}</h1>
        <p className="text-gray-400 mb-1">{user.email} <br /> {user.phone}</p>
        <p className="text-gray-400 text-sm mb-1.5"> {user.dob}</p>
        
        <div className="flex justify-center md:justify-start gap-8 mt-6">
          <button 
            onClick={onEdit}
            className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-blue-600 to-purple-600 rounded-full font-bold shadow-lg transition text-white hover:scale-105"
          >
            <Settings size={20} /> Edit Profile
          </button>

          {/* 3. Attach the logout function here */}
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-6 py-2.5 border border-white/20 rounded-full font-bold bg-white/5 hover:bg-white/10 hover:text-orange-500 transition text-white"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}