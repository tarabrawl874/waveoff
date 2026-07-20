import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Audio } from "expo-av";
import { Track } from "../types";
import { getStreamUrl } from "../api/piped";

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  isPlayerOpen: boolean;
  queue: Track[];
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  seekTo: (position: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  openPlayer: () => void;
  closePlayer: () => void;
  addToQueue: (track: Track) => void;
}

const PlayerContext = createContext<PlayerContextType>({} as PlayerContextType);

export const usePlayer = () => useContext(PlayerContext);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  }, []);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const playTrack = async (track: Track) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      let streamUrl = track.url;

      if (!streamUrl) {
        streamUrl = await getStreamUrl(track.id);

        if (!streamUrl) {
          console.log("No se pudo obtener la URL del audio");
          return;
        }

        // Guardamos la URL para no volver a pedirla
        track.url = streamUrl;
      }

      setCurrentTrack(track);

      const { sound } = await Audio.Sound.createAsync(
        { uri: streamUrl },
        { shouldPlay: true },
        (status) => {
          if (!status.isLoaded) return;

          setPosition(status.positionMillis ?? 0);
          setDuration(status.durationMillis ?? 0);
          setIsPlaying(status.isPlaying);

          if (status.didJustFinish) {
            nextTrack();
          }
        }
      );

      soundRef.current = sound;
      setIsPlaying(true);

    } catch (error) {
      console.log("Error playing track:", error);
    }
  };

  const togglePlay = async () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }

    setIsPlaying(!isPlaying);
  };

  const seekTo = async (pos: number) => {
    if (!soundRef.current) return;
    await soundRef.current.setPositionAsync(pos);
  };

  const nextTrack = () => {
    if (!currentTrack || queue.length === 0) return;

    const idx = queue.findIndex(t => t.id === currentTrack.id);

    if (idx < queue.length - 1) {
      playTrack(queue[idx + 1]);
    }
  };

  const prevTrack = () => {
    if (!currentTrack || queue.length === 0) return;

    const idx = queue.findIndex(t => t.id === currentTrack.id);

    if (idx > 0) {
      playTrack(queue[idx - 1]);
    }
  };

  const addToQueue = (track: Track) => {
    setQueue(prev => {
      if (prev.find(t => t.id === track.id)) return prev;
      return [...prev, track];
    });
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        position,
        duration,
        isPlayerOpen,
        queue,
        playTrack,
        togglePlay,
        seekTo,
        nextTrack,
        prevTrack,
        openPlayer: () => setIsPlayerOpen(true),
        closePlayer: () => setIsPlayerOpen(false),
        addToQueue,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
