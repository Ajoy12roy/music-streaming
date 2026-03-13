"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  email: string;
  password: string;
  name?: string;
  [key: string]: unknown;
}

interface AuthContextType {
  isLoggedIn: boolean;
  userData: User | null;
  login: (email: string, pass: string) => boolean;
  signUp: (data: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('isLoggedIn') === 'true';
    } catch {
      return false;
    }
  });
  const [userData, setUserData] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('currentUser');
      return saved ? (JSON.parse(saved) as User) : null;
    } catch {
      return null;
    }
  });

  const router = useRouter();
  const pathname = usePathname();

  // Strict Protection: Redirect to home if trying to access profile while logged out
  useEffect(() => {
    if (!isLoggedIn && pathname.startsWith('/profile')) {
      router.push('/');
    }
  }, [isLoggedIn, pathname, router]);

  const signUp = (data: User) => {
    // Save user to our "Local Database"
    localStorage.setItem('registeredUser', JSON.stringify(data));
    alert("Account created! Please log in.");
  };

  const login = (email: string, pass: string) => {
    const registered = localStorage.getItem('registeredUser');
    if (!registered) {
      alert("No account found. Please sign up first.");
      return false;
    }

    const user = JSON.parse(registered) as User;
    // CHECK: Does email and password match?
    if (user.email === email && user.password === pass) {
      setIsLoggedIn(true);
      setUserData(user);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(user));
      router.push('/profile');
      return true;
    } else {
      alert("Invalid email or password!");
      return false;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userData, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};