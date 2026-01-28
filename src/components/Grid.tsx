import { useState, useCallback } from 'react';
import { Block } from './Block';
import type { GridState, BigBlock } from '../types/game';
import { GRID_SIZE } from '../utils/gameUtils';
import { AnimatePresence, motion } from 'framer-motion';

interface GridProps {
    smallBlocks: GridState;
    bigBlocks: BigBlock[];
    onBlockClick: (x: number, y: number) => void;
}

export const Grid = ({ smallBlocks, bigBlocks, onBlockClick }: GridProps) => {
    const [pulse, setPulse] = useState(0);

    const handleGridReaction = useCallback(() => {
        setPulse(p => p + 1);
    }, []);

    return (
        <motion.div
            animate={{
                scale: [1, 1.015, 1],
            }}
            transition={{
                duration: 0.15,
                ease: "easeOut",
                times: [0, 0.5, 1],
                type: "spring",
                stiffness: 500,
                damping: 30
            }}
            key={pulse} // Trigger animation on state change
            className="relative bg-black border border-white/20 rounded-lg grid-inner-shadow overflow-hidden"
            style={{
                width: 'min(90vw, 500px)',
                height: 'min(90vw, 500px)',
                display: 'grid',
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
                gap: '1px',
                padding: '2px'
            }}
        >
            {/* Correct Rendering Loop for Col-Major Array in CSS Grid (Row-Major) */}
            {Array.from({ length: GRID_SIZE }).map((_, y) => (
                Array.from({ length: GRID_SIZE }).map((_, x) => {
                    const block = smallBlocks[x][y]; // Access as [col][row]
                    return (
                        <div key={`cell-${x}-${y}`} className="relative w-full h-full flex items-center justify-center bg-white/5 border-[0.5px] border-white/10 rounded-none">
                            <AnimatePresence mode="popLayout">
                                {block && (
                                    <Block
                                        key={block.id}
                                        type="small"
                                        color={block.color}
                                        onReaction={handleGridReaction}
                                        onClick={() => { }} // Small blocks not clickable
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })
            ))}

            {/* Big Blocks Layer (Absolute Overlay) */}
            <AnimatePresence>
                {bigBlocks.map((block) => {
                    const left = `${block.x * 20}%`;
                    const top = `${block.y * 20}%`;
                    const size = '40%'; // 2x2 = 40% width/height

                    return (
                        <div
                            key={block.id}
                            style={{
                                position: 'absolute',
                                left, top, width: size, height: size,
                                padding: '1px', // sync with grid gap
                                zIndex: 10
                            }}
                        >
                            <Block
                                type="big"
                                color={block.color}
                                onReaction={handleGridReaction}
                                onClick={() => onBlockClick(block.x, block.y)} // Pass grid coords
                            />
                        </div>
                    );
                })}
            </AnimatePresence>
        </motion.div>
    );
};