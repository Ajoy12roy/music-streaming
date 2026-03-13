"use client";

import React, { useEffect, useState } from "react";
import { Music, Waves, Disc, Download } from "lucide-react";

export default function Features() {
  const BAR_COUNT = 40;

  const [heights, setHeights] = useState<number[]>(
    () => [...Array(BAR_COUNT)].map(() => Math.floor(Math.random() * 60) + 20)
  );

  // 🔥 Animate the visualizer
  useEffect(() => {
    const interval = setInterval(() => {
      setHeights(
        [...Array(BAR_COUNT)].map(
          () => Math.floor(Math.random() * 80) + 15
        )
      );
    }, 200); // speed of animation (lower = faster)

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-5 py-16">
      
      {/* 🎵 Sound Visualizer */}
      <div className="flex justify-center items-end gap-2.5 h-35 mb-24 opacity-80">
        {heights.map((height, i) => (
          <div
            key={i}
            className="w-1.5 rounded-full bg-linear-to-t from-blue-700 to-purple-400 transition-all duration-300 ease-in-out"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>

      {/* Cards */}
     <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-10 md:gap-16 p-0 m-0">
     
  <FeatureCard
    icon={<Music className="text-purple-400" size={28} />}
    title="Unlimited Music"
    desc="Stream millions of songs from your favorite artists anytime, anywhere."
  />
  <FeatureCard
    icon={<Waves className="text-blue-400" size={28} />}
    title="High Quality Audio"
    desc="Experience crystal clear sound with our premium 320 kbp audio streaming."
  />
  <FeatureCard
    icon={<Disc className="text-purple-400" size={28} />}
    title="Personalized"
    desc="Get smart recommendations tailored just for you based on your unique taste."
  />
  <FeatureCard
    icon={<Download className="text-green-400" size={28} />}
    title="Offline Listening"
    desc="Download your favorite tracks and enjoy music anytime, even without an internet connection."
  />
</div>

      
    </section>
  );
}

/* ---------------- Feature Card ---------------- */

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-[25px] hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group">
      <div className="mb-3 bg-white/5 w- h-15 flex items-center justify-center rounded-2xl group-hover:scale-105 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm md:text-base">
        {desc}
      </p>
    </div>
  );
}
