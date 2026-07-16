import type { Track } from '../types';

const API = 'https://pipedapi.kavin.rocks';

function extractId(url: string): string {
  const match = url.match(/[?&]v=([^&]+)/);
  if (match) return match[1];
  return url.replace('/watch?v=', '').split('&')[0];
}

function mapItem(v: any): Track | null {
  if (!v?.url || !v?.title) return null;
  return {
    id: extractId(v.url),
    title: v.title,
    author: v.uploaderName || v.uploader || 'Desconocido',
    thumbnail: v.thumbnail || `https://i.ytimg.com/vi/${extractId(v.url)}/hqdefault.jpg`,
    duration: v.duration || 0,
    views: v.views || 0,
  };
}

export async function getTrending(): Promise<Track[]> {
  try {
    const res = await fetch(`${API}/trending?region=ES`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const items = Array.isArray(data) ? data : [];
    return items
      .filter((v: any) => v.type === 'stream' || !v.type)
      .map(mapItem)
      .filter(Boolean) as Track[];
  } catch {
    return [];
  }
}

export async function search(query: string): Promise<Track[]> {
  try {
    const res = await fetch(
      `${API}/search?q=${encodeURIComponent(query)}&filter=videos`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const items: any[] = data.items || [];
    return items
      .filter((v: any) => v.type === 'stream' || !v.type)
      .map(mapItem)
      .filter(Boolean) as Track[];
  } catch {
    return [];
  }
}

export async function getAudioUrl(videoId: string): Promise<string> {
  const res = await fetch(`${API}/streams/${videoId}`, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  const streams: any[] = data.audioStreams || [];
  if (streams.length === 0) throw new Error('Sin streams de audio');

  // Prefer m4a for best compatibility, then opus, then anything
  const m4a = streams.find((s) => s.mimeType?.includes('mp4') || s.mimeType?.includes('m4a'));
  const opus = streams.find((s) => s.mimeType?.includes('opus'));
  const stream = m4a || opus || streams[0];
  return stream.url;
}
