import { useMemo } from 'react';
import { motion } from 'framer-motion-3d';
import { COLORS, GRID_SIZE } from '../../utils/gameUtils';

interface Block3DProps {
    x: number;
    y: number;
    type: 'small';
    color: string;
}

export const Block3D = ({ x, y, color }: Block3DProps) => {
    // Random stagger for spawn animation
    const spawnDelay = useMemo(() => Math.random() * 0.15, []);

    // Convert grid coordinates to world coordinates (XZ Floor Plane)
    const size = 0.96;
    const targetX = (x - (GRID_SIZE - 1) / 2);
    const targetZ = (y - (GRID_SIZE - 1) / 2); // Map grid Y to 3D Z axis

    // Dynamic spring profile based on jelly color
    const springConfig = useMemo(() => {
        if (color === COLORS[0]) return { stiffness: 120, damping: 10, mass: 1 };
        if (color === COLORS[1]) return { stiffness: 160, damping: 15, mass: 1.2 };
        if (color === COLORS[2]) return { stiffness: 80, damping: 6, mass: 0.8 };
        if (color === COLORS[3]) return { stiffness: 180, damping: 8, mass: 1 };
        return { stiffness: 120, damping: 10, mass: 1 };
    }, [color]);

    return (
        <motion.mesh
            initial={{ scale: 0, x: targetX, y: size / 2, z: targetZ }}
            animate={{
                scale: 1,
                x: targetX,
                y: size / 2,
                z: targetZ
            }}
            exit={{ scale: 0 }}
            castShadow
            receiveShadow
            transition={{
                type: "spring",
                ...springConfig,
                delay: spawnDelay
            }}
        >
            <boxGeometry args={[size, size, size]} />
            <meshPhysicalMaterial
                color={color}
                transparent={true}
                opacity={0.85}
                roughness={0.1}
                metalness={0.0}
                transmission={1.0}
                ior={1.4}
                thickness={1.5}
                attenuationColor={color}
                attenuationDistance={1.0}
                specularIntensity={1.0}
            />
        </motion.mesh>
    );
};
