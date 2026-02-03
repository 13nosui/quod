import { useEffect, useState } from 'react';
import { GameContainer } from './components/GameContainer';
import { HomeScreen } from './components/HomeScreen';
// ThemeProvider のインポートは削除（useThemeなどは必要なら残す）
import { initializeAdMob, showBanner } from './utils/admob';
import { useBGM } from './hooks/useBGM';
import './index.css';

function App() {
  const [isNative, setIsNative] = useState(false);
  const [screen, setScreen] = useState<'home' | 'game'>('home');
  const [highScore, setHighScore] = useState(0);

  // BGM管理をAppで行う
  const { isPlaying, toggleBGM, play, stop } = useBGM('/sounds/bgm.mp3');

  useEffect(() => {
    const loadHighScore = () => {
      try {
        const saved = localStorage.getItem('quod-records');
        if (saved) {
          const records = JSON.parse(saved);
          if (Array.isArray(records) && records.length > 0) {
            setHighScore(records[0].score);
          }
        }
      } catch (e) {
        console.error('Failed to load records:', e);
      }
    };
    loadHighScore();
  }, [screen]);

  useEffect(() => {
    const initAds = async () => {
      if (window.Capacitor) {
        setIsNative(true);
        await initializeAdMob();
        await showBanner();
      }
    };
    initAds();
  }, []);

  // ThemeProvider で囲むのをやめ、div を直接返します
  return (
    <div style={{
      width: '100%',
      height: '100%',
      paddingBottom: isNative ? '60px' : '0px',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      {screen === 'home' ? (
        <HomeScreen
          onStart={() => {
            play();
            setScreen('game');
          }}
          bestScore={highScore}
          isPlaying={isPlaying}
          toggleBGM={toggleBGM}
        />
      ) : (
        <GameContainer onBack={() => {
          stop();
          setScreen('home');
        }} />
      )}
    </div>
  );
}

declare global {
  interface Window {
    Capacitor: any;
  }
}

export default App;