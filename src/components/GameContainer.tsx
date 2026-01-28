import { useRef, useEffect, useCallback } from 'react';
import type { Direction, GridState, BigBlock } from '../types/game';
import { GameScene, type GameSceneHandle } from './3d/GameScene';
import { motion } from 'framer-motion';
import { GRID_SIZE } from '../utils/gameUtils';

interface GameContainerProps {
    smallBlocks: GridState;
    bigBlocks: BigBlock[];
    slide: (direction: Direction) => void;
    breakBlock: (x: number, y: number) => void;
    score: number;
    gameOver: boolean;
    isProcessing: boolean;
}

export const GameContainer = ({
    smallBlocks,
    bigBlocks,
    slide,
    breakBlock,
    score,
    gameOver,
    isProcessing
}: GameContainerProps) => {
    const sceneRef = useRef<GameSceneHandle>(null);

    // Helper to map grid coords to world coords for ripple effect
    // Grid matches Block3D mapping: worldX = (x/5)*10 - 4
    const triggerRippleAt = useCallback((x: number, y: number, isBig: boolean = false) => {
        const worldX = (x / GRID_SIZE) * 10 - 4 + (isBig ? 1 : 0);
        const worldY = (1.0 - y / GRID_SIZE) * 10 - 6 - (isBig ? 1 : 0);
        sceneRef.current?.triggerRipple(worldX, worldY);
    }, []);

    const handleSlide = useCallback((dir: Direction) => {
        slide(dir);
        // Trigger generic "shake" ripples at centers for slide feedback
        triggerRippleAt(2, 2, false);
    }, [slide, triggerRippleAt]);

    const handleBreak = useCallback((x: number, y: number) => {
        breakBlock(x, y);
        triggerRippleAt(x, y, true);
    }, [breakBlock, triggerRippleAt]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowUp': handleSlide('UP'); break;
                case 'ArrowDown': handleSlide('DOWN'); break;
                case 'ArrowLeft': handleSlide('LEFT'); break;
                case 'ArrowRight': handleSlide('RIGHT'); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleSlide]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-8 select-none">
            <div className="flex flex-col items-center gap-2">
                <h1 className="text-4xl font-mono font-bold tracking-[0.2em] uppercase">SHARDS</h1>
                <div className="text-xs font-mono opacity-50">
                    {gameOver ? "GAME OVER" : isProcessing ? "PROCESSING..." : "READY"}
                </div>
            </div>

            <GameScene
                ref={sceneRef}
                smallBlocks={smallBlocks}
                bigBlocks={bigBlocks}
                onBlockClick={handleBreak}
            />

            <div className="flex flex-col items-center gap-1">
                <div className="text-xs font-mono uppercase tracking-widest opacity-30">Score</div>
                <motion.div
                    key={score}
                    initial={{ y: -5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-3xl font-mono font-light"
                >
                    {score.toString().padStart(6, '0')}
                </motion.div>
            </div>

            <div className="text-[10px] font-mono opacity-30 text-center">
                CLICK GREY ROCKS TO BREAK<br />
                ARROWS TO SLIDE<br />
                MATCH 3+ (ORTHO or DIAG)
            </div>
        </div>
    );
};