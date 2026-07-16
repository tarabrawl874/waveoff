export interface Track {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  duration: number;
  views: number;
}

export function formatDuration(secs: number): string {
  if (!secs || isNaN(secs) || secs <= 0) return '0:00';
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatViews(n: number): string {
  if (!n) return '';
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B vistas`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M vistas`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K vistas`;
  return `${n} vistas`;
}
