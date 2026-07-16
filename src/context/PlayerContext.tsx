import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { Track } from '../types';
import { getAudioUrl } from '../api/piped';

interface PlayerState {
  track: Track | null;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  currentTime: number;
  duration: number;
  playerOpen: boolean;
  playTrack: (track: Track) => Promise<void>;
  togglePlay: () => void;
  seek: (time: number) => void;
  openPlayer: () => void;
  closePlayer: () => void;
}

const Ctx = createContext<PlayerState | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [track, setTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playerOpen, setPlayerOpen] = useState(false);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onDuration = () => setDuration(isNaN(audio.duration) ? 0 : audio.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onError = () => {
      setIsLoading(false);
      setError('Error al cargar el audio. Intenta de nuevo.');
    };

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('durationchange', onDuration);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('durationchange', onDuration);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  const playTrack = useCallback(async (newTrack: Track) => {
    const audio = audioRef.current!;
    audio.pause();
    setTrack(newTrack);
    setIsLoading(true);
    setError(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setPlayerOpen(true);

    try {
      const url = await getAudioUrl(newTrack.id);
      audio.src = url;
      await audio.play();

      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: newTrack.title,
          artist: newTrack.author,
          artwork: [
            { src: newTrack.thumbnail, sizes: '512x512', type: 'image/jpeg' },
          ],
        });
        navigator.mediaSession.setActionHandler('play', () => audio.play());
        navigator.mediaSession.setActionHandler('pause', () => audio.pause());
        navigator.mediaSession.setActionHandler('seekto', (e) => {
          if (e.seekTime !== undefined) audio.currentTime = e.seekTime;
        });
        navigator.mediaSession.setActionHandler('seekbackward', () => {
          audio.currentTime = Math.max(0, audio.currentTime - 10);
        });
        navigator.mediaSession.setActionHandler('seekforward', () => {
          audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
        });
      }
    } catch (err: any) {
      setError(err?.message || 'Error al reproducir');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current!;
    if (isPlaying) audio.pause();
    else audio.play();
  }, [isPlaying]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) audioRef.current.currentTime = time;
  }, []);

  return (
    <Ctx.Provider
      value={{
        track,
        isPlaying,
        isLoading,
        error,
        currentTime,
        duration,
        playerOpen,
        playTrack,
        togglePlay,
        seek,
        openPlayer: () => setPlayerOpen(true),
        closePlayer: () => setPlayerOpen(false),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function usePlayer(): PlayerState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('usePlayer must be inside PlayerProvider');
  return ctx;
}
