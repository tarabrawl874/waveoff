import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, StyleSheet, Image, BackHandler } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Playlist, Track } from "../types";
import { usePlayer } from "../context/PlayerContext";
import { getStreamUrl } from "../api/piped";

const PLAYLISTS_KEY = "@waveoff_playlists";

export function LibraryPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [createModal, setCreateModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const { playTrack, addToQueue, openPlayer, queue } = usePlayer();

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (selectedPlaylist) { setSelectedPlaylist(null); return true; }
      if (createModal) { setCreateModal(false); return true; }
      return false;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [selectedPlaylist, createModal]);

  const load = async () => {
    const data = await AsyncStorage.getItem(PLAYLISTS_KEY);
    if (data) setPlaylists(JSON.parse(data));
  };

  const save = async (data: Playlist[]) => {
    setPlaylists(data);
    await AsyncStorage.setItem(PLAYLISTS_KEY, JSON.stringify(data));
  };

  const createPlaylist = () => {
    if (!newName.trim()) return;
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name: newName.trim(),
      tracks: [],
      createdAt: new Date().toISOString(),
    };
    save([...playlists, newPlaylist]);
    setNewName("");
    setCreateModal(false);
  };

  const deletePlaylist = (id: string) => {
    save(playlists.filter(p => p.id !== id));
  };

  const addQueueToPlaylist = (playlist: Playlist) => {
    const updated = playlists.map(p => {
      if (p.id !== playlist.id) return p;
      const existing = new Set(p.tracks.map(t => t.id));
      const newTracks = queue.filter(t => !existing.has(t.id));
      return { ...p, tracks: [...p.tracks, ...newTracks] };
    });
    save(updated);
    if (selectedPlaylist?.id === playlist.id) {
      setSelectedPlaylist(updated.find(p => p.id === playlist.id) || null);
    }
  };

  const removeFromPlaylist = (playlistId: string, trackId: string) => {
    const updated = playlists.map(p => {
      if (p.id !== playlistId) return p;
      return { ...p, tracks: p.tracks.filter(t => t.id !== trackId) };
    });
    save(updated);
    setSelectedPlaylist(updated.find(p => p.id === playlistId) || null);
  };

  const playPlaylist = async (playlist: Playlist) => {
    if (playlist.tracks.length === 0) return;
    for (const track of playlist.tracks) {
      if (!track.url) {
        const url = await getStreamUrl(track.id);
        if (url) addToQueue({ ...track, url });
      } else {
        addToQueue(track);
      }
    }
    const first = playlist.tracks[0];
    const url = first.url || await getStreamUrl(first.id);
    if (url) {
      playTrack({ ...first, url });
      openPlayer();
    }
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (selectedPlaylist) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setSelectedPlaylist(null)} style={{ marginTop: 20, marginBottom: 16 }}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{selectedPlaylist.name}</Text>
        <Text style={styles.subtitle}>{selectedPlaylist.tracks.length} canciones</Text>

        <View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
          <TouchableOpacity style={styles.playButton} onPress={() => playPlaylist(selectedPlaylist)}>
            <MaterialCommunityIcons name="play" size={20} color="black" />
            <Text style={{ color: "black", fontWeight: "bold", marginLeft: 6 }}>Reproducir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={() => addQueueToPlaylist(selectedPlaylist)}>
            <MaterialCommunityIcons name="playlist-plus" size={20} color="white" />
            <Text style={{ color: "white", marginLeft: 6 }}>Añadir cola</Text>
          </TouchableOpacity>
        </View>

        <ScrollView>
          {selectedPlaylist.tracks.length === 0 ? (
            <View style={styles.empty}>
              <MaterialCommunityIcons name="music-note-off" size={48} color="#333" />
              <Text style={styles.emptyText}>Playlist vacía</Text>
              <Text style={styles.emptySubtext}>Añade canciones desde la búsqueda</Text>
            </View>
          ) : (
            selectedPlaylist.tracks.map(track => (
              <View key={track.id} style={styles.trackRow}>
                <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
                  onPress={async () => {
                    const url = track.url || await getStreamUrl(track.id);
                    if (url) { playTrack({ ...track, url }); openPlayer(); }
                  }}
                >
                  <Image source={{ uri: track.thumbnail }} style={styles.thumb} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.trackTitle} numberOfLines={1}>{track.title}</Text>
                    <Text style={styles.trackArtist}>{track.artist} · {formatDuration(track.duration)}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeFromPlaylist(selectedPlaylist.id, track.id)} style={{ padding: 8 }}>
                  <MaterialCommunityIcons name="trash-can-outline" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Biblioteca</Text>

      <TouchableOpacity style={styles.createButton} onPress={() => setCreateModal(true)}>
        <MaterialCommunityIcons name="plus" size={20} color="white" style={{ marginRight: 8 }} />
        <Text style={{ color: "white", fontWeight: "bold" }}>Nueva playlist</Text>
      </TouchableOpacity>

      <ScrollView style={{ flex: 1 }}>
        {playlists.length === 0 ? (
          <View style={styles.empty}>
            <MaterialCommunityIcons name="music-box-multiple-outline" size={64} color="#333" />
            <Text style={styles.emptyText}>Sin playlists</Text>
            <Text style={styles.emptySubtext}>Crea tu primera playlist</Text>
          </View>
        ) : (
          playlists.map(playlist => (
            <TouchableOpacity key={playlist.id} style={styles.playlistRow} onPress={() => setSelectedPlaylist(playlist)}>
              <View style={styles.playlistIcon}>
                <MaterialCommunityIcons name="music-note" size={24} color="#1db954" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.playlistName}>{playlist.name}</Text>
                <Text style={styles.playlistCount}>{playlist.tracks.length} canciones</Text>
              </View>
              <TouchableOpacity onPress={() => deletePlaylist(playlist.id)} style={{ padding: 8 }}>
                <MaterialCommunityIcons name="trash-can-outline" size={20} color="#666" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <Modal visible={createModal} transparent animationType="fade" onRequestClose={() => setCreateModal(false)}>
        <View style={styles.modalBg}>
          <View style={styles.modal}>
            <TouchableOpacity onPress={() => setCreateModal(false)} style={{ marginBottom: 16 }}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>Nueva playlist</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de la playlist"
              placeholderTextColor="#444"
              value={newName}
              onChangeText={setNewName}
              autoFocus
            />
            <TouchableOpacity style={styles.playButton} onPress={createPlaylist}>
              <Text style={{ color: "black", fontWeight: "bold" }}>Crear</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a", padding: 16 },
  title: { color: "white", fontSize: 28, fontWeight: "bold", marginTop: 20, marginBottom: 4 },
  subtitle: { color: "#666", fontSize: 14, marginBottom: 16 },
  createButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#1a1a1a", padding: 14, borderRadius: 10, marginBottom: 16 },
  playButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#1db954", padding: 12, borderRadius: 25, flex: 1 },
  addButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#1a1a1a", padding: 12, borderRadius: 25, flex: 1 },
  empty: { alignItems: "center", marginTop: 60 },
  emptyText: { color: "#666", fontSize: 18, marginTop: 16 },
  emptySubtext: { color: "#444", fontSize: 14, marginTop: 8 },
  playlistRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#111", padding: 12, borderRadius: 10, marginBottom: 8 },
  playlistIcon: { width: 48, height: 48, borderRadius: 8, backgroundColor: "#1a2a1a", alignItems: "center", justifyContent: "center", marginRight: 12 },
  playlistName: { color: "white", fontSize: 15, fontWeight: "600" },
  playlistCount: { color: "#666", fontSize: 12, marginTop: 2 },
  trackRow: { flexDirection: "row", alignItems: "center", padding: 10, borderRadius: 8, marginBottom: 6, backgroundColor: "#111" },
  thumb: { width: 48, height: 48, borderRadius: 6, marginRight: 12, backgroundColor: "#222" },
  trackTitle: { color: "white", fontSize: 14, fontWeight: "600" },
  trackArtist: { color: "#666", fontSize: 12, marginTop: 2 },
  modalBg: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.8)", padding: 20 },
  modal: { backgroundColor: "#111", borderRadius: 16, padding: 20 },
  input: { backgroundColor: "#1a1a1a", color: "white", padding: 12, borderRadius: 10, marginBottom: 16, fontSize: 15 },
});
