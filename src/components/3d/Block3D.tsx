import { motion } from 'framer-motion-3d';
import { GRID_SIZE } from '../../utils/gameUtils';

interface Block3DProps {
    x: number;
    y: number;
    type: 'big' | 'small';
    color: string;
    onClick?: () => void;
}

export const Block3D = ({ x, y, type, color, onClick }: Block3DProps) => {
    const isBig = type === 'big';

    // Map grid coords to world coords (-5 to 5 space)
    const worldX = (x / GRID_SIZE) * 10 - 4; // Shifted slightly for centers
    const worldY = (1.0 - y / GRID_SIZE) * 10 - 6;

    const size = isBig ? 3.8 : 1.8;
    const targetX = isBig ? worldX + 1 : worldX;
    const targetY = isBig ? worldY - 1 : worldY;

    const springConfig = {
        type: "spring",
        stiffness: 450,
        damping: 25,
        mass: 1
    };

    return (
        <motion.mesh
            initial={{ scale: 0 }}
            animate={{
                scale: 1,
                x: targetX,
                y: targetY,
                z: isBig ? 0.2 : 0.1
            }}
            exit={{ scale: 0 }}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            transition={springConfig}
            onPointerDown={(e: any) => {
                e.stopPropagation();
                onClick?.();
            }}
        >
            <boxGeometry args={[size, size, isBig ? 0.4 : 0.2]} />
            <meshStandardMaterial
                color={color}
                flatShading={true}
                roughness={0.8}
                metalness={0}
                transparent={false}
                opacity={1}
            />
        </motion.mesh>
    );
};
