import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { searchTracks, getStreamUrl } from "../api/piped";
import { usePlayer } from "../context/PlayerContext";
import { Track } from "../types";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const { playTrack, addToQueue, openPlayer } = usePlayer();

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const tracks = await searchTracks(query);
    setResults(tracks);
    setLoading(false);
  };

  const handlePlay = async (track: Track) => {
    const url = await getStreamUrl(track.id);
    if (!url) return;
    const trackWithUrl = { ...track, url };
    addToQueue(trackWithUrl);
    playTrack(trackWithUrl);
    openPlayer();
  };

  const handleAddToQueue = async (track: Track) => {
    const url = await getStreamUrl(track.id);
    if (!url) return;
    addToQueue({ ...track, url });
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar</Text>

      <View style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" size={20} color="#666" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.input}
          placeholder="Canciones, artistas..."
          placeholderTextColor="#444"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={search}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(""); setResults([]); }}>
            <MaterialCommunityIcons name="close" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator color="#1db954" size="large" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView style={{ flex: 1 }}>
          {results.map(track => (
            <View key={track.id} style={styles.trackRow}>
              <TouchableOpacity onPress={() => handlePlay(track)} style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                <Image source={{ uri: track.thumbnail }} style={styles.thumb} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.trackTitle} numberOfLines={1}>{track.title}</Text>
                  <Text style={styles.trackArtist} numberOfLines={1}>{track.artist} · {formatDuration(track.duration)}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleAddToQueue(track)} style={{ padding: 8 }}>
                <MaterialCommunityIcons name="playlist-plus" size={22} color="#666" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a", padding: 16 },
  title: { color: "white", fontSize: 28, fontWeight: "bold", marginTop: 20, marginBottom: 16 },
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: "#1a1a1a", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 16 },
  input: { flex: 1, color: "white", fontSize: 15 },
  trackRow: { flexDirection: "row", alignItems: "center", padding: 10, borderRadius: 8, marginBottom: 6, backgroundColor: "#111" },
  thumb: { width: 48, height: 48, borderRadius: 6, marginRight: 12, backgroundColor: "#222" },
  trackTitle: { color: "white", fontSize: 14, fontWeight: "600" },
  trackArtist: { color: "#666", fontSize: 12, marginTop: 2 },
});
