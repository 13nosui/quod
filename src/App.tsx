import { useEffect, useState } from 'react';
import { GameContainer } from './components/GameContainer';
import { HomeScreen } from './components/HomeScreen'; // 追加
import { ThemeProvider } from './context/ThemeContext';
import { initializeAdMob, showBanner } from './utils/admob';
import './index.css';

function App() {
  // Capacitor環境（スマホアプリ）かどうかを判定するステート
  const [isNative, setIsNative] = useState(false);

  // 画面遷移を管理するステート: 'home' または 'game'
  const [screen, setScreen] = useState<'home' | 'game'>('home');

  // ベストスコアを管理するステート
  const [highScore, setHighScore] = useState(0);

  // ベストスコアの読み込み
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

    // アプリ起動時と、ホームに戻ってきたときにスコアを最新にする
    loadHighScore();
  }, [screen]);

  useEffect(() => {
    const initAds = async () => {
      // window.Capacitor が存在するか確認
      if (window.Capacitor) {
        setIsNative(true); // ネイティブ環境と判定
        await initializeAdMob();
        await showBanner();
      }
    };
    initAds();
  }, []);

  return (
    <ThemeProvider>
      {/* アプリ全体を囲むdivにスタイルを追加 
         ネイティブ環境（スマホ）の場合のみ、下に60pxの余白を空ける
      */}
      <div style={{
        width: '100%',
        height: '100%',
        paddingBottom: isNative ? '60px' : '0px',
        boxSizing: 'border-box',
        position: 'relative'
      }}>
        {/* 画面の状態によって表示するコンポーネントを切り替える */}
        {screen === 'home' ? (
          <HomeScreen
            onStart={() => setScreen('game')}
            bestScore={highScore}
          />
        ) : (
          <GameContainer onBack={() => setScreen('home')} />
        )}
      </div>
    </ThemeProvider>
  );
}

declare global {
  interface Window {
    Capacitor: any;
  }
}

export default App;