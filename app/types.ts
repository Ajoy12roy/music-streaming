export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  dob: string;
  image: string;
  bio?: string;        // নতুন
  address?: string;    // নতুন
  type?: string; 
  followers?: number;  // প্রিমিয়াম লুকের জন্য
  following?: number;  // প্রিমিয়াম লুকের জন্য
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
}

export interface Playlist {
  id: string;
  title: string;
  subtitle: string; 
}