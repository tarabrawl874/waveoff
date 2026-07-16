import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { usePlayer } from "../context/PlayerContext";

const { width } = Dimensions.get("window");

export function PlayerModal() {
  const { currentTrack, isPlaying, position, duration, togglePlay, seekTo, nextTrack, prevTrack, closePlayer, isPlayerOpen } = usePlayer();

  if (!currentTrack) return null;

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return `${m}:${(s % 60).toString().padStart(2, "0")}`;
  };

  return (
    <Modal visible={isPlayerOpen} animationType="slide" onRequestClose={closePlayer}>
      <View style={styles.container}>

        <TouchableOpacity onPress={closePlayer} style={styles.closeBtn}>
          <MaterialCommunityIcons name="chevron-down" size={32} color="white" />
        </TouchableOpacity>

        <Image source={{ uri: currentTrack.thumbnail }} style={styles.cover} />

        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
          <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist}</Text>
        </View>

        <View style={styles.sliderContainer}>
          <Slider
            style={{ width: width - 48, height: 40 }}
            minimumValue={0}
            maximumValue={duration || 1}
            value={position}
            onSlidingComplete={seekTo}
            minimumTrackTintColor="#1db954"
            maximumTrackTintColor="#333"
            thumbTintColor="#1db954"
          />
          <View style={styles.times}>
            <Text style={styles.time}>{formatTime(position)}</Text>
            <Text style={styles.time}>{formatTime(duration)}</Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity onPress={prevTrack}>
            <MaterialCommunityIcons name="skip-previous" size={40} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.playBtn} onPress={togglePlay}>
            <MaterialCommunityIcons name={isPlaying ? "pause" : "play"} size={36} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={nextTrack}>
            <MaterialCommunityIcons name="skip-next" size={40} color="white" />
          </TouchableOpacity>
        </View>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a", alignItems: "center", paddingHorizontal: 24, paddingTop: 20 },
  closeBtn: { alignSelf: "flex-start", marginBottom: 20 },
  cover: { width: width - 80, height: width - 80, borderRadius: 16, backgroundColor: "#222", marginBottom: 32 },
  info: { width: "100%", marginBottom: 24 },
  title: { color: "white", fontSize: 22, fontWeight: "bold" },
  artist: { color: "#666", fontSize: 16, marginTop: 4 },
  sliderContainer: { width: "100%", alignItems: "center" },
  times: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 4 },
  time: { color: "#666", fontSize: 12 },
  controls: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 32, marginTop: 32 },
  playBtn: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#1db954", alignItems: "center", justifyContent: "center" },
});
