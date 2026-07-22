const INVIDIOUS_INSTANCES = [
  "https://invidious.snopyta.org",
  "https://invidious.kavin.rocks",
  "https://vid.puffyan.us",
  "https://invidious.namazso.eu",
];

export async function searchTracks(query: string): Promise<any[]> {
  for (const api of INVIDIOUS_INSTANCES) {
    try {
      const res = await fetch(
        ${api}/api/v1/search?q=${encodeURIComponent(query)}&type=video&fields=videoId,title,author,lengthSeconds,videoThumbnails
      );
      if (!res.ok) continue;
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) continue;
      return data.slice(0, 20).map((item: any) => ({
        id: item.videoId || "",
        title: item.title || "Sin título",
        artist: item.author || "Artista desconocido",
        thumbnail: item.videoThumbnails?.[0]?.url || "",
        duration: item.lengthSeconds || 0,
      }));
    } catch {}
  }
  return [];
}

export async function getStreamUrl(videoId: string): Promise<string | null> {
  for (const api of INVIDIOUS_INSTANCES) {
    try {
      const res = await fetch(${api}/api/v1/videos/${videoId}?fields=adaptiveFormats);
      if (!res.ok) continue;
      const data = await res.json();
      const audio = data.adaptiveFormats
        ?.filter((s: any) => s.type?.includes("audio"))
        ?.sort((a: any, b: any) => b.bitrate - a.bitrate)[0];
      if (audio?.url) return audio.url;
    } catch {}
  }
  return null;
}
