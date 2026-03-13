"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Music } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { isLoggedIn, userData } = useAuth();
  const firstLetter = userData?.name ? userData.name.charAt(0).toUpperCase() : "U";

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
            <Link href="/" className="text-white hover:border-b-2 border-purple-500 pb-1 transition">Home</Link>
            <Link href="/all-bands" className="text-white hover:border-b-2 border-purple-500 pb-1 transition">All Brands</Link>
            <Link href="/all-movie-songs" className="text-white hover:border-b-2 border-purple-500 pb-1 transition">All Movie Songs</Link>
            <Link href="/album" className="text-white hover:border-b-2 border-purple-500 pb-1 transition">Album</Link>
            <Link href="/profile" className="text-white hover:border-b-2 border-purple-500 pb-1 transition">Profile</Link>
          </>
        )}
      </div>

      {!isLoggedIn ? (
        <Link href="/auth" className="px-7 py-2.5 bg-linear-to-r from-blue-600 to-purple-600 rounded-full font-bold shadow-lg hover:scale-105 transition-transform text-white">
          Get Started
        </Link>
      ) : (
        <Link href="/profile" className="relative w-11 h-11 group">
          <div className="w-full h-full rounded-full border-2 border-purple-500/50 p-0.5 group-hover:border-purple-500 transition-all overflow-hidden bg-purple-500/10 flex items-center justify-center">
            {userData?.image ? (
              <Image 
                src={userData!.image as string} 
                alt=""
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
