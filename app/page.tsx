import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';


export default function Home() {
  return (
    <main className="min-h-screen relative overflow-x-hidden">
      {/* These divs create the purple glow in the background of your Figma */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-purple-600/10 blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-125 h-125 bg-blue-600/10 blur-[120px] -z-10" />
      
      {/* All sections together on one page */}
      <Navbar />
      <Hero />
      <Features />
      
    </main>
  );
}