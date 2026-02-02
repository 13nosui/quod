import { useEffect, useState } from 'react'; // useStateを追加
import { GameContainer } from './components/GameContainer';
import { ThemeProvider } from './context/ThemeContext';
import { initializeAdMob, showBanner } from './utils/admob';
import './index.css';

function App() {
  // Capacitor環境（スマホアプリ）かどうかを判定するステート
  const [isNative, setIsNative] = useState(false);

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
        <GameContainer onBack={() => { }} />
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