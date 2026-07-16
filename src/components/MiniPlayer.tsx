import { usePlayer } from '../context/PlayerContext';

export default function MiniPlayer() {
  const { track, isPlaying, isLoading, currentTime, duration, togglePlay, openPlayer } = usePlayer();

  if (!track) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="bg-[#161616] border-t border-white/5 relative overflow-hidden"
      onClick={openPlayer}
    >
      {/* Progress line */}
      <div className="absolute top-0 left-0 h-[2px] bg-red-500 transition-all duration-500" style={{ width: `${progress}%` }} />

      <div className="flex items-center gap-3 px-4 py-3">
        {/* Thumbnail */}
        <div className="relative flex-shrink-0">
          <img
            src={track.thumbnail}
            alt=""
            className="w-10 h-10 rounded-md object-cover bg-[#222]"
          />
          {isLoading && (
            <div className="absolute inset-0 rounded-md bg-black/60 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">{track.title}</p>
          <p className="text-gray-500 text-xs truncate">{track.author}</p>
        </div>

        {/* Controls */}
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center active:bg-white/10 text-white"
          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg className="w-4 h-4 text-white animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}
