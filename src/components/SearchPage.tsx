import { useState, useRef, useEffect } from 'react';
import { search } from '../api/piped';
import type { Track } from '../types';
import VideoCard from './VideoCard';

const SUGGESTIONS = [
  'música relajante', 'lofi hip hop', 'reggaeton 2024',
  'rock en español', 'jazz', 'electrónica', 'pop latino',
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function runSearch(q: string) {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    search(q).then((data) => {
      setResults(data);
      setLoading(false);
    });
  }

  function handleChange(val: string) {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(val), 500);
  }

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Search bar */}
      <div className="px-4 pt-4 pb-3 bg-[#080808]">
        <div className="relative flex items-center">
          <svg className="absolute left-3 w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runSearch(query)}
            placeholder="Buscar canciones, artistas…"
            className="w-full bg-[#1a1a1a] text-white placeholder-gray-600 rounded-xl pl-9 pr-4 py-3 text-sm outline-none focus:ring-1 focus:ring-red-500/50 transition-all"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setResults([]); setSearched(false); inputRef.current?.focus(); }}
              className="absolute right-3 text-gray-500 active:text-white"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4">
        {!searched && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Sugerencias</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => { setQuery(s); runSearch(s); }}
                  className="bg-[#1a1a1a] text-gray-300 text-sm px-4 py-2 rounded-full active:bg-[#252525] transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 gap-6 pt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="skeleton w-full aspect-video rounded-xl" />
                <div className="mt-2 space-y-1.5">
                  <div className="skeleton h-3.5 rounded w-full" />
                  <div className="skeleton h-3 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm">Sin resultados para "{query}"</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
              {results.length} resultado{results.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 gap-6">
              {results.map((track) => (
                <VideoCard key={track.id} track={track} />
              ))}
            </div>
          </>
        )}

        <div className="h-4" />
      </div>
    </div>
  );
}
