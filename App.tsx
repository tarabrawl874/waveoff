import React, { useState } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { PlayerProvider } from "./context/PlayerContext";
import { HomePage } from "./components/HomePage";
import { SearchPage } from "./components/SearchPage";
import { LibraryPage } from "./components/LibraryPage";
import { MiniPlayer } from "./components/MiniPlayer";
import { PlayerModal } from "./components/PlayerModal";
import { BottomNav } from "./components/BottomNav";

export type TabType = "home" | "search" | "library";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("home");

  const renderPage = () => {
    switch (activeTab) {
      case "home": return <HomePage />;
      case "search": return <SearchPage />;
      case "library": return <LibraryPage />;
    }
  };

  return (
    <PlayerProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <View style={styles.container}>
        <View style={styles.content}>
          {renderPage()}
        </View>
        <MiniPlayer />
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        <PlayerModal />
      </View>
    </PlayerProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a" },
  content: { flex: 1 },
});
