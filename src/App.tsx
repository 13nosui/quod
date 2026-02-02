import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GameContainer } from './components/GameContainer'
import { HomeScreen } from './components/HomeScreen' // 追加
import { useTheme } from './context/ThemeContext'
import { useBGM } from './hooks/useBGM'
import { CreditsModal } from './components/CreditsModal'
import { Sun, Moon, Volume2, VolumeX } from 'lucide-react'
import { IconButton, Flex } from '@radix-ui/themes'

function App() {
  // ゲーム中かどうかの状態管理
  const [isPlaying, setIsPlaying] = useState(false);
  const [bestScore, setBestScore] = useState(0);

  const { theme, toggleTheme } = useTheme();
  // BGMパスはプロジェクトに合わせて確認してください
  const { isPlaying: isBgmPlaying, toggleBGM } = useBGM('/sounds/bgm.mp3');

  // アプリ起動時やホームに戻った時にベストスコアを最新化
  useEffect(() => {
    // useGameLogicで保存しているキー 'quod-highscore' を使用
    const saved = localStorage.getItem('quod-highscore');
    if (saved) {
      setBestScore(parseInt(saved, 10));
    }
  }, [isPlaying]);

  return (
    <main className="relative w-full min-h-screen overflow-hidden font-sans flex flex-col items-center justify-center bg-[var(--color-background)] text-[var(--gray-12)] transition-colors duration-300">

      <AnimatePresence>
        {!isPlaying && (
          <>
            {/* --- 左上: BGM切り替え --- */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute top-6 left-6 z-50"
            >
              <IconButton
                variant="soft"
                color="gray"
                highContrast
                onClick={toggleBGM}
                size="3"
                className="cursor-pointer hover:scale-105 transition-transform"
              >
                {isBgmPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </IconButton>
            </motion.div>

            {/* --- 右上: クレジット & テーマ切り替え --- */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-6 right-6 z-50"
            >
              <Flex gap="3">
                <CreditsModal />
                <IconButton
                  variant="soft"
                  color="gray"
                  highContrast
                  onClick={toggleTheme}
                  size="3"
                  className="cursor-pointer hover:scale-105 transition-transform"
                >
                  {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                </IconButton>
              </Flex>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- メインコンテンツ切り替え --- */}
      {isPlaying ? (
        <GameContainer onBack={() => setIsPlaying(false)} />
      ) : (
        <HomeScreen
          onStart={() => setIsPlaying(true)}
          bestScore={bestScore}
        />
      )}

    </main>
  );
}

export default App;