"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Music } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { isLoggedIn, userData } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  // প্রোফাইল ডেটা লোড করার ফাংশন
  const loadProfileData = () => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      const data = JSON.parse(saved);
      setProfileImage(data.image || null);
      setUserName(data.name || "");
    } else if (userData) {
     setProfileImage((userData.image as string) || null);
      setUserName(userData.name || "");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProfileData(); // মাউন্ট হওয়ার সময় লোড

    // কাস্টম ইভেন্ট লিসেনার সেট করা
    window.addEventListener('profileUpdate', loadProfileData);
    
    return () => {
      window.removeEventListener('profileUpdate', loadProfileData);
    };
  }, [userData]);

  const firstLetter = userName ? userName.charAt(0).toUpperCase() : (userData?.name ? userData.name.charAt(0).toUpperCase() : "U");

  return (
    <nav className="flex items-center justify-between px-12 py-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 text-2xl font-bold">
        <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)]">
          <Music size={24} />
        </div>
        <span>Music</span>
      </div>
      
      <div className="hidden md:flex gap-10 text-sm font-medium text-gray-400">
        {isLoggedIn && (
        
          <>
          
            <Link href="/all-bands" className="text-white hover:border-b-2 border-purple-500 pb-1 transition font-bold hover:text-amber-300">All Brands</Link>
            <Link href="/all-movie-songs" className="text-white hover:border-b-2 border-purple-500 pb-1 transition font-bold hover:text-amber-600">All Movie Songs</Link>
            <Link href="/album" className="text-white hover:border-b-2 border-purple-500 pb-1 transition font-bold hover:text-amber-400">Album</Link>
            <Link href="/profile" className="text-white hover:border-b-2 border-purple-500 pb-1 transition font-bold hover:text-amber-500">Profile</Link>
          </>
        )}
      </div>

      {!isLoggedIn ? (
        <><Link href="/auth" className="px-7 py-2.5 bg-linear-to-r from-blue-600 to-purple-600 rounded-full font-bold shadow-lg hover:scale-105 transition-transform text-white">
          Get Started
        </Link></>
      ) : (
        <Link href="/profile" className="relative w-11 h-11 group">
          <div className="w-full h-full rounded-full border-2 border-purple-500/50 p-0.5 group-hover:border-purple-500 transition-all overflow-hidden bg-purple-500/10 flex items-center justify-center">
            {profileImage ? (
              <Image 
                src={profileImage} 
                alt="Profile"
                width={40} 
                height={40} 
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-white font-bold text-lg">{firstLetter}</span>
            )}
          </div>
        </Link>
      )}
    </nav>
  );
}