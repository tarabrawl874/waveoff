import type { Track } from '../types';
import { formatDuration, formatViews } from '../types';
import { usePlayer } from '../context/PlayerContext';

export default function VideoCard({ track }: { track: Track }) {
  const { playTrack, track: current, isPlaying } = usePlayer();
  const isActive = current?.id === track.id;

  return (
    <button
      onClick={() => playTrack(track)}
      className="w-full text-left group"
    >
      <div className="relative overflow-hidden rounded-xl bg-[#111]">
        <img
          src={track.thumbnail}
          alt={track.title}
          className="w-full aspect-video object-cover group-active:opacity-90 transition-opacity"
          loading="lazy"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
          {formatDuration(track.duration)}
        </div>
        {isActive && (
          <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center">
            <div className={`w-10 h-10 rounded-full bg-red-500/80 flex items-center justify-center ${isPlaying ? 'opacity-100' : 'opacity-70'}`}>
              {isPlaying ? (
                <PauseIcon className="w-5 h-5 text-white" />
              ) : (
                <PlayIcon className="w-5 h-5 text-white ml-0.5" />
              )}
            </div>
          </div>
        )}
      </div>
      <div className="mt-2 px-0.5">
        <p className={`text-sm font-medium leading-snug line-clamp-2 ${isActive ? 'text-red-400' : 'text-white'}`}>
          {track.title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5 truncate">
          {track.author}
          {track.views > 0 && <span className="mx-1">·</span>}
          {track.views > 0 && formatViews(track.views)}
        </p>
      </div>
    </button>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}
