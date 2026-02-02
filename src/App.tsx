import { useState, useEffect } from 'react'
import { GameContainer } from './components/GameContainer'
import { HomeScreen } from './components/HomeScreen'
import { useTheme } from './context/ThemeContext'
import { useBGM } from './hooks/useBGM'
// CreditsModalのインポートを削除
import { Sun, Moon, Volume2, VolumeX } from 'lucide-react'
import { IconButton, Flex } from '@radix-ui/themes'
import { AnimatePresence, motion } from 'framer-motion'

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bestScore, setBestScore] = useState(0);

  const { theme, toggleTheme } = useTheme();
  const { isPlaying: isBgmPlaying, toggleBGM } = useBGM('/sounds/bgm.mp3');

  useEffect(() => {
    const savedRecords = localStorage.getItem('quod-records');
    if (savedRecords) {
      try {
        const records = JSON.parse(savedRecords);
        if (records.length > 0) {
          setBestScore(records[0].score);
          return;
        }
      } catch (e) { console.error(e); }
    }

    const savedOld = localStorage.getItem('quod-highscore');
    if (savedOld) {
      setBestScore(parseInt(savedOld, 10));
    }
  }, [isPlaying]);

  return (
    <main className="relative w-full min-h-screen overflow-hidden font-sans flex flex-col items-center justify-center bg-[var(--color-background)] text-[var(--gray-12)] transition-colors duration-300">

      {/* --- 左上 & 右上: グローバルコントロール (ホーム画面でのみ表示) --- */}
      <AnimatePresence>
        {!isPlaying && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-6 right-6 z-50"
            >
              <Flex gap="3">
                {/* CreditsModalを削除し、テーマ切り替えボタンのみ配置 */}
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