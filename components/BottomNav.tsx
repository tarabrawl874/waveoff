import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TabType } from "../App";

interface Props {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { key: "home", label: "Inicio", icon: "home" },
  { key: "search", label: "Buscar", icon: "magnify" },
  { key: "library", label: "Biblioteca", icon: "music-box-multiple" },
] as const;

export function BottomNav({ activeTab, onTabChange }: Props) {
  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity key={tab.key} style={styles.tab} onPress={() => onTabChange(tab.key)}>
            <MaterialCommunityIcons
              name={tab.icon as any}
              size={24}
              color={isActive ? "#1db954" : "#666"}
            />
            <Text style={[styles.label, { color: isActive ? "#1db954" : "#666" }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#111",
    borderTopWidth: 1,
    borderTopColor: "#222",
    paddingBottom: 20,
    paddingTop: 10,
  },
  tab: { flex: 1, alignItems: "center", gap: 4 },
  label: { fontSize: 11 },
});
