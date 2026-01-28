import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface BlockProps {
    type: 'big' | 'small';
    color: string;
    onReaction?: () => void;
    onClick: () => void;
}

export const Block = ({ type, color, onReaction, onClick }: BlockProps) => {
    const isBig = type === 'big';

    // Tactile Spring Config
    const springConfig = {
        type: "spring" as const,
        stiffness: 400,
        damping: 25,
        mass: 1
    };

    const handleClick = () => {
        onReaction?.();
        onClick();
    };

    return (
        <motion.div
            layout
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={springConfig}
            whileHover={{
                scale: 1.05,
                transition: { type: "spring", stiffness: 600, damping: 20 }
            }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "relative flex items-center justify-center cursor-pointer select-none",
                isBig ? "rounded-lg" : "rounded-sm",
                "w-full h-full",
                "block-shadow glow-edge",
                isBig ? "z-10 shadow-[0_0_20px_rgba(255,255,255,0.1)]" : "z-0"
            )}
            style={{
                backgroundColor: color + 'CC', // slightly transparent
            }}
            onClick={handleClick}
        >
            {/* Inner Detail */}
            <div className="absolute inset-x-1 inset-y-1 border border-white/20 rounded-sm pointer-events-none" />

            {isBig && (
                <div className="absolute inset-3 border-2 border-white/30 rounded-md pointer-events-none shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]" />
            )}
        </motion.div>
    );
};