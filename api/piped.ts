import { Track } from "../types";

const PIPED_INSTANCES = [
  "https://pipedapi.kavin.rocks",
  "https://pipedapi.adminforge.de",
  "https://pipedapi.syncpundit.io",
  "https://pipedapi.r4fo.com",
];

export async function searchTracks(query: string): Promise<Track[]> {
  for (const api of PIPED_INSTANCES) {
    try {
      const res = await fetch(
        `${api}/search?q=${encodeURIComponent(query)}&filter=music_songs`
      );

      if (!res.ok) continue;

      const data = await res.json();
      console.log("API:", api);
      console.log(data);

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

    } catch {
      // prueba la siguiente instancia
    }
  }

  return [];
}

export async function getStreamUrl(videoId: string): Promise<string | null> {
  for (const api of PIPED_INSTANCES) {
    try {
      const res = await fetch(`${api}/streams/${videoId}`);

      if (!res.ok) continue;

      const data = await res.json();

      const audio = data.audioStreams
        ?.filter((s: any) => s.mimeType?.includes("audio"))
        ?.sort((a: any, b: any) => b.bitrate - a.bitrate)[0];

      if (audio?.url) {
        return audio.url;
      }

    } catch {
      // prueba la siguiente instancia
    }
  }

  return null;
}
