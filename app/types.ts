export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  dob: string;
  image: string;
  type?: string; // For the "Types of song" field you added
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
  subtitle: string; // e.g., "24 songs"
}