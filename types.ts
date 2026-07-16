export interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: number;
  url?: string;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  createdAt: string;
}
