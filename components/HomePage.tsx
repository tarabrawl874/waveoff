import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from "react-native";
import { usePlayer } from "../context/PlayerContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export function HomePage() {
  const { queue, playTrack, openPlayer, currentTrack } = usePlayer();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.greeting}>Buenas 👋</Text>
      <Text style={styles.title}>WaveOff</Text>

      {queue.length === 0 ? (
        <View style={styles.empty}>
          <MaterialCommunityIcons name="music-note" size={64} color="#333" />
          <Text style={styles.emptyText}>Busca música para empezar</Text>
          <Text style={styles.emptySubtext}>Ve a la pestaña de búsqueda</Text>
        </View>
      ) : (
        <View>
          <Text style={styles.sectionTitle}>Cola de reproducción</Text>
          {queue.map(track => (
            <TouchableOpacity
              key={track.id}
              style={[styles.trackRow, currentTrack?.id === track.id && styles.activeTrack]}
              onPress={() => { playTrack(track); openPlayer(); }}
            >
              <Image source={{ uri: track.thumbnail }} style={styles.thumb} />
              <View style={{ flex: 1 }}>
                <Text style={styles.trackTitle} numberOfLines={1}>{track.title}</Text>
                <Text style={styles.trackArtist} numberOfLines={1}>{track.artist}</Text>
              </View>
              {currentTrack?.id === track.id && (
                <MaterialCommunityIcons name="music-note" size={18} color="#1db954" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a", padding: 16 },
  greeting: { color: "#666", fontSize: 14, marginTop: 20 },
  title: { color: "white", fontSize: 32, fontWeight: "bold", marginBottom: 24 },
  empty: { alignItems: "center", justifyContent: "center", marginTop: 80 },
  emptyText: { color: "#666", fontSize: 18, marginTop: 16 },
  emptySubtext: { color: "#444", fontSize: 14, marginTop: 8 },
  sectionTitle: { color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  trackRow: { flexDirection: "row", alignItems: "center", padding: 10, borderRadius: 8, marginBottom: 8, backgroundColor: "#111" },
  activeTrack: { backgroundColor: "#1a2a1a" },
  thumb: { width: 48, height: 48, borderRadius: 6, marginRight: 12, backgroundColor: "#222" },
  trackTitle: { color: "white", fontSize: 14, fontWeight: "600" },
  trackArtist: { color: "#666", fontSize: 12, marginTop: 2 },
});
