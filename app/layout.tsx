import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 1. Import the AuthProvider from your new context folder
import { AuthProvider } from "../context/AuthContext";
// 2. Import Toaster if you want login/logout notifications (optional)
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Music Streaming App",
  description: "Enjoy life with music",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* 3. Wrap everything in the AuthProvider */}
        <AuthProvider>
          {children}
          {/* Optional: Add Toaster here for popup alerts */}
          <Toaster position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}