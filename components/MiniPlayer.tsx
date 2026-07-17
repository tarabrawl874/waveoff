import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { usePlayer } from "../context/PlayerContext";

export function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlay, openPlayer, nextTrack } = usePlayer();

  if (!currentTrack) return null;

  return (
    <TouchableOpacity style={styles.container} onPress={openPlayer} activeOpacity={0.9}>
      <View style={styles.progress} />
      <Image source={{ uri: currentTrack.thumbnail }} style={styles.thumb} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
        <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist}</Text>
      </View>
      <TouchableOpacity onPress={e => { e.stopPropagation(); togglePlay(); }} style={styles.btn}>
        <MaterialCommunityIcons name={isPlaying ? "pause" : "play"} size={28} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={e => { e.stopPropagation(); nextTrack(); }} style={styles.btn}>
        <MaterialCommunityIcons name="skip-next" size={28} color="white" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1a1a",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  progress: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#1db954",
  },
  thumb: { width: 40, height: 40, borderRadius: 6, backgroundColor: "#222" },
  title: { color: "white", fontSize: 13, fontWeight: "600" },
  artist: { color: "#666", fontSize: 11, marginTop: 2 },
  btn: { padding: 6 },
});
