import { usePlayer } from '../context/PlayerContext';
import { formatDuration } from '../types';

export default function PlayerModal() {
  const { track, isPlaying, isLoading, error, currentTime, duration, playerOpen, togglePlay, seek, closePlayer } =
    usePlayer();

  if (!playerOpen || !track) return null;

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <div className="absolute inset-0 z-50 bg-[#080808] flex flex-col slide-up">
      {/* Blurred bg art */}
      <div
        className="absolute inset-0 opacity-20 blur-3xl scale-110"
        style={{
          backgroundImage: `url(${track.thumbnail})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <button
            onClick={closePlayer}
            className="w-9 h-9 flex items-center justify-center rounded-full active:bg-white/10 text-gray-400"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
            </svg>
          </button>
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">Reproduciendo ahora</p>
          </div>
          <div className="w-9 h-9" />
        </div>

        {/* Artwork */}
        <div className="flex-1 flex items-center justify-center px-10 py-6">
          <div className="w-full aspect-square max-w-xs relative">
            <img
              src={track.thumbnail}
              alt={track.title}
              className="w-full h-full object-cover rounded-2xl shadow-2xl shadow-black/60"
            />
            {isLoading && (
              <div className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center">
                <svg className="w-12 h-12 text-white animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Info & controls */}
        <div className="px-6 pb-10 space-y-6">
          {/* Title */}
          <div>
            <h1 className="text-white font-semibold text-xl leading-tight line-clamp-2">{track.title}</h1>
            <p className="text-gray-400 text-sm mt-1 truncate">{track.author}</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Progress */}
          <div className="space-y-2">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="w-full"
              style={{
                background: `linear-gradient(to right, #ef4444 ${progress * 100}%, rgba(255,255,255,0.15) ${progress * 100}%)`,
                borderRadius: '99px',
                height: '3px',
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 font-mono">
              <span>{formatDuration(currentTime)}</span>
              <span>{formatDuration(duration)}</span>
            </div>
          </div>

          {/* Playback controls */}
          <div className="flex items-center justify-center gap-6">
            <button
              className="text-gray-400 active:text-white transition-colors"
              onClick={() => seek(Math.max(0, currentTime - 10))}
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
              </svg>
            </button>

            <button
              onClick={togglePlay}
              disabled={isLoading}
              className="w-16 h-16 rounded-full bg-red-600 active:bg-red-700 flex items-center justify-center shadow-lg shadow-red-500/30 transition-all active:scale-95 disabled:opacity-60"
            >
              {isLoading ? (
                <svg className="w-7 h-7 text-white animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : isPlaying ? (
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-7 h-7 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              className="text-gray-400 active:text-white transition-colors"
              onClick={() => seek(Math.min(duration, currentTime + 10))}
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" />
              </svg>
            </button>
          </div>

          {/* Background hint */}
          <p className="text-center text-[11px] text-gray-700">
            El audio continúa en segundo plano · funciona con pantalla bloqueada
          </p>
        </div>
      </div>
    </div>
  );
}
