"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Music, ArrowRight } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signUp } = useAuth();
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      login(email, password);
    } else {
      signUp({ name, email, password, phone: "Add phone", dob: "Add birthday", image: "/assets/booth.png" });
      setIsLogin(true); // Switch to login after signing up
    }
  };

  return (
    <main className="min-h-screen bg-[#090215] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-[40px] p-10 backdrop-blur-xl">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-linear-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
            <Music className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white">{isLogin ? "Welcome Back" : "Create Account"}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input 
              type="text" placeholder="Full Name" required 
              className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-purple-500"
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input 
            type="email" placeholder="Email Address" required 
            className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-purple-500"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Password" required 
            className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-purple-500"
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <button type="submit" className="w-full py-4 mt-4 bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-white hover:scale-105 transition flex items-center justify-center gap-2">
            {isLogin ? "Log In" : "Sign Up"} <ArrowRight size={18} />
          </button>
        </form>

        <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-6 text-gray-400 hover:text-purple-400 text-sm transition">
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
        </button>
      </div>
    </main>
  );
}