import { useState, useEffect } from 'react';
import { getTrending } from '../api/piped';
import type { Track } from '../types';
import VideoCard from './VideoCard';

export default function HomePage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    getTrending().then((data) => {
      if (!mounted) return;
      if (data.length === 0) setError(true);
      else setTracks(data);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="h-full overflow-y-auto">
      <header className="sticky top-0 z-10 bg-[#080808]/95 backdrop-blur-sm px-4 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-red-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">TuneFlow</span>
        </div>
        <div className="text-[10px] text-gray-600 font-medium uppercase tracking-widest">Sin anuncios</div>
      </header>

      <div className="px-4 pb-2">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
          En tendencia
        </h2>

        {loading && <SkeletonGrid />}

        {error && !loading && (
          <div className="text-center py-16 text-gray-600">
            <div className="text-4xl mb-3">📡</div>
            <p className="text-sm">No se pudo conectar al servidor.</p>
            <p className="text-xs mt-1 text-gray-700">Comprueba tu conexión e intenta de nuevo.</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6">
            {tracks.map((track) => (
              <VideoCard key={track.id} track={track} />
            ))}
          </div>
        )}

        <div className="h-4" />
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i}>
          <div className="skeleton w-full aspect-video rounded-xl" />
          <div className="mt-2 space-y-1.5">
            <div className="skeleton h-3.5 rounded w-full" />
            <div className="skeleton h-3 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
