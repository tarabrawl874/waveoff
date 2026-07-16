import { Track } from "../types";

const PIPED_API = "https://pipedapi.kavin.rocks";

export async function searchTracks(query: string): Promise<Track[]> {
  try {
    const res = await fetch(`${PIPED_API}/search?q=${encodeURIComponent(query)}&filter=music_songs`);
    const data = await res.json();

    return (data.items || [])
      .filter((item: any) => item.type === "stream")
      .slice(0, 20)
      .map((item: any) => ({
        id: item.url?.replace("/watch?v=", "") || "",
        title: item.title || "Sin título",
        artist: item.uploaderName || "Artista desconocido",
        thumbnail: item.thumbnail || "",
        duration: item.duration || 0,
      }));
  } catch (error) {
    console.log("Error searching:", error);
    return [];
  }
}

export async function getStreamUrl(videoId: string): Promise<string | null> {
  try {
    const res = await fetch(`${PIPED_API}/streams/${videoId}`);
    const data = await res.json();

    const audioStream = data.audioStreams
      ?.filter((s: any) => s.mimeType?.includes("audio"))
      ?.sort((a: any, b: any) => b.bitrate - a.bitrate)[0];

    return audioStream?.url || null;
  } catch (error) {
    console.log("Error getting stream:", error);
    return null;
  }
}
