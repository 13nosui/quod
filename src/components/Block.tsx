import { motion } from 'framer-motion';
import type { Block as BlockType } from '../types/game';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface BlockProps {
    block: BlockType;
    row: number;
    col: number;
    onClick: () => void;
}

export const Block = ({ block, onClick }: BlockProps) => {
    const isBig = block.type === 'big';

    return (
        <motion.div
            layout
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                mass: 1,
            }}
            onClick={onClick}
            className={cn(
                "relative flex items-center justify-center cursor-pointer select-none",
                "border-2",
                isBig ? "w-full h-full" : "w-4/5 h-4/5",
                "transition-shadow duration-200"
            )}
            style={{
                backgroundColor: block.color + "22", // 22 is ~13% opacity for subtle tint
                borderColor: block.color,
                boxShadow: `0 0 10px ${block.color}33`,
            }}
        >
            <div
                className={cn(
                    "w-px h-px bg-current opacity-20 absolute",
                    isBig ? "scale-[40]" : "scale-[20]"
                )}
                style={{ color: block.color }}
            />

            {/* Subtle crisp borders */}
            <div className="absolute inset-0 border border-white/10 pointer-events-none" />

            {/* Block identifier or decoration */}
            <span className="text-[10px] font-mono opacity-40 uppercase tracking-tighter" style={{ color: block.color }}>
                {isBig ? 'B' : 'S'}
            </span>
        </motion.div>
    );
};
