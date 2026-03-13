

const API_KEY = "64a30ed33a98e8e2d0126da4a363e3a8"; 
const BASE_URL = "https://ws.audioscrobbler.com/2.0/";

export interface Band {
  id: string;
  name: string;
  genre: string;
  image: string;
  likes: number;
  url: string;
}

export interface Track {
  name: string;
  listeners: string;
  url: string;
}

// FIX: Helper to get image or create a beautiful fallback with initials
const getArtistImage = (artistObj: any, artistName: string) => {
  let imgUrl = "";
  if (artistObj.image && artistObj.image.length > 0) {
    // Try to get the largest image
    imgUrl = artistObj.image[artistObj.image.length - 1]["#text"];
  }
  // If no image, or if it's the default Last.fm broken star image, use our colorful fallback
  if (!imgUrl || imgUrl.includes("2a96cbd8b46e442fc41c2b86b821562f.png")) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(artistName)}&background=7c3aed&color=fff&size=600&font-size=0.33`;
  }
  return imgUrl;
};

// 1. Fetch Global Top Artists
export const fetchTopArtists = async (): Promise<Band[]> => {
  try {
    const response = await fetch(`${BASE_URL}?method=chart.gettopartists&api_key=${API_KEY}&format=json&limit=12`);
    const data = await response.json();
    return data.artists.artist.map((artist: any, index: number) => ({
      id: index.toString(),
      name: artist.name,
      genre: "Artist",
      image: getArtistImage(artist, artist.name), // Uses our new fix!
      likes: parseInt(artist.listeners || "0"),
      url: artist.url
    }));
  } catch (error) {
    console.error("Error fetching top artists:", error);
    return [];
  }
};

// 2. Search for a specific Artist (e.g., "Warfaze")
export const searchArtists = async (query: string): Promise<Band[]> => {
  try {
    const response = await fetch(`${BASE_URL}?method=artist.search&artist=${encodeURIComponent(query)}&api_key=${API_KEY}&format=json&limit=12`);
    const data = await response.json();
    return data.results.artistmatches.artist.map((artist: any, index: number) => ({
      id: index.toString(),
      name: artist.name,
      genre: "Artist",
      image: getArtistImage(artist, artist.name), // Uses our new fix!
      likes: parseInt(artist.listeners || "0"),
      url: artist.url
    }));
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
};

// 3. Get Top Tracks for an Artist (to show the song list)
export const fetchArtistTracks = async (artistName: string): Promise<Track[]> => {
  try {
    const response = await fetch(`${BASE_URL}?method=artist.gettoptracks&artist=${encodeURIComponent(artistName)}&api_key=${API_KEY}&format=json&limit=15`);
    const data = await response.json();
    return data.toptracks.track;
  } catch (error) {
    console.error("Error fetching tracks:", error);
    return [];
  }
};