"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import FloatingIcon from "./FloatingIcon";

export default function Hero() {
  return (
    <section className="relative max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center overflow-hidden">

      <FloatingIcon icon="🎵" size={30} initialX={-50} initialY={-50} delay={0} duration={12} />
  <FloatingIcon icon="🎧" size={40} initialX={300} initialY={-30} delay={2} duration={15} />
  <FloatingIcon icon="🎶" size={40} initialX={200} initialY={200} delay={1} duration={10} />
  <FloatingIcon icon="🎵" size={40} initialX={-100} initialY={300} delay={3} duration={18} />
  <FloatingIcon icon="🎧" size={30} initialX={400} initialY={150} delay={4} duration={14} />
  <FloatingIcon icon="🎹" size={40} initialX={-200} initialY={150} delay={5} duration={14} />
  <FloatingIcon icon="🎤" size={40} initialX={300} initialY={150} delay={6} duration={14} />

      {/* Left Column */}
      <div className="space-y-6">
        {/* Heading */}
        <motion.h1
          className="text-5xl md:text-7xl font-bold leading-tight bg-[linear-gradient(90deg,#3b82f6,#a855f7,#ec4899,#f59e0b,#3b82f6)] bg-clip-text text-transparent animate-gradient-text"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Enjoy Life With <br />
          {" "} 
          <motion.span
            className="inline-block text-teal-500 ml-2"
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          >
            🎧 
          </motion.span>{" "}
          {" "} 
          <motion.span
            className="inline-block text-teal-500 text-5xl md:text-7xl font-bold mt-4 "
            animate={{ rotate: [0, -360] }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          >
            A 
          </motion.span>{" "}

           parfect Soundtrack
        </motion.h1>

        {/* Paragraph */}
        <motion.p
          className="text-gray-400 text-lg max-w-md mb-14"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        >
          Discover millions of songs, albums, and artists. Stream your favorite
          music and podcasts, all in one place.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex gap-6 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <Link
            href="/auth"
            className="px-6 py-4 bg-linear-to-r from-blue-600 to-purple-600 rounded-full font-bold shadow-lg hover:scale-105 transition-transform text-white"
          >
            Start Listening
          </Link>

          <button className="px-8 py-3 border border-white/20 rounded-full font-bold bg-white/5 hover:bg-white/10 transition">
            Browse Music
          </button>
        </motion.div>
      </div>

      {/* Right Column */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, delay: 1 }}
      >
        <div className="rounded-[50px] overflow-hidden border-2 border-white/10 shadow-2xl">
          <Image
            src="/assets/pop.jpg"
            alt="music"
            width={400}
            height={350}
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      {/* Optional Floating Background Circles */}
      <motion.div
        className="absolute w-72 h-72 bg-purple-700/20 rounded-full -top-24 -left-24"
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-56 h-56 bg-blue-500/20 rounded-full -bottom-20 -right-16"
        animate={{ x: [0, -20, 0], y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />
    </section>
  );
}