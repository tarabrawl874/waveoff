import { useState } from 'react';
import { PlayerProvider } from './context/PlayerContext';
import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import LibraryPage from './components/LibraryPage';
import MiniPlayer from './components/MiniPlayer';
import PlayerModal from './components/PlayerModal';

type Tab = 'home' | 'search' | 'library';

export default function App() {
  const [tab, setTab] = useState<Tab>('home');

  return (
    <PlayerProvider>
      <div className="flex flex-col h-dvh bg-[#080808] text-white max-w-[430px] mx-auto relative overflow-hidden">
        {/* Main content area */}
        <div className="flex-1 overflow-hidden relative">
          {tab === 'home' && <HomePage />}
          {tab === 'search' && <SearchPage />}
          {tab === 'library' && <LibraryPage />}
        </div>

        {/* Mini player */}
        <MiniPlayer />

        {/* Tab bar */}
        <nav className="flex items-stretch bg-[#0d0d0d] border-t border-white/5">
          <TabBtn id="home" label="Inicio" current={tab} onClick={setTab}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </TabBtn>
          <TabBtn id="search" label="Buscar" current={tab} onClick={setTab}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </TabBtn>
          <TabBtn id="library" label="Biblioteca" current={tab} onClick={setTab}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </TabBtn>
        </nav>

        {/* Full-screen player overlay */}
        <PlayerModal />
      </div>
    </PlayerProvider>
  );
}

function TabBtn({
  id, label, current, onClick, children,
}: {
  id: Tab; label: string; current: Tab; onClick: (t: Tab) => void; children: React.ReactNode;
}) {
  const active = id === current;
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors ${
        active ? 'text-red-500' : 'text-gray-600'
      }`}
    >
      {children}
      <span className={`text-[9px] font-semibold uppercase tracking-widest ${active ? 'text-red-500' : 'text-gray-700'}`}>
        {label}
      </span>
    </button>
  );
}
