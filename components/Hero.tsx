import Image from 'next/image';

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-5 py-5 grid md:grid-cols-2 gap-10 items-center">
      <div>
        <h1 className="text-7xl font-bold leading-tight mb-6">
          <span className="text-blue-400">Enjoy</span> Life <br />
          With <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">Music</span>
        </h1>
        <p className="text-gray-400 text-lg mb-10 max-w-md">
          Discover millions of songs, albums, and artists. Stream your favorite music and podcasts, all in one place.
        </p>
        <div className="flex gap-4">
          <button className="px-8 py-3 bg-linear-to-r from-blue-600 to-purple-600 rounded-full font-bold shadow-lg shadow-purple-500/30 hover:scale-105 transition">
            Start Listening
          </button>
          <button className="px-8 py-3 border border-white/20 rounded-full font-bold bg-white/5 hover:bg-white/10 transition">
            Browse Music
          </button>
        </div>
      </div>
      <div className="relative">
        <div className="rounded-[50px] overflow-hidden border-2 border-white/10 shadow-2xl">
         <Image
          src="/assets/booth.png"
          alt="music"
          width={100}
          height={100}
          className="w-full h-full object-cover "
        />
        </div>
      </div>
    </section>
  );
}