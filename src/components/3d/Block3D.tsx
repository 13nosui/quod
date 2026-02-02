import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion-3d';
import { GRID_SIZE } from '../../utils/gameUtils';
import { Face } from './Face';

interface Block3DProps {
    x: number;
    y: number;
    type: 'small';
    color: string;
    isGhost?: boolean;
    bumpEvent?: { x: number; y: number; id: number } | null;
    expression?: 'normal' | 'sleep' | 'yawn'; // 追加
}

export const Block3D = ({ x, y, color, isGhost = false, bumpEvent, expression = 'normal' }: Block3DProps) => {
    const [bumpOffset, setBumpOffset] = useState({ x: 0, z: 0 });

    useEffect(() => {
        if (bumpEvent) {
            setBumpOffset({
                x: bumpEvent.x * 0.2,
                z: bumpEvent.y * 0.2
            });
            const timer = setTimeout(() => {
                setBumpOffset({ x: 0, z: 0 });
            }, 60);
            return () => clearTimeout(timer);
        }
    }, [bumpEvent]);

    const spawnDelay = useMemo(() => isGhost ? 0 : Math.random() * 0.15, [isGhost]);

    const size = 0.96;
    const targetX = (x - (GRID_SIZE - 1) / 2);
    const targetZ = (y - (GRID_SIZE - 1) / 2);

    const springConfig = useMemo(() => {
        if (isGhost) return { stiffness: 100, damping: 20 };
        return { stiffness: 120, damping: 10, mass: 1 };
    }, [isGhost]);

    // アニメーションの定義
    let animateProps: any = {
        scale: isGhost ? 0.95 : 1,
        opacity: isGhost ? 0.4 : 1,
        x: targetX + bumpOffset.x,
        y: size / 2,
        z: targetZ + bumpOffset.z
    };

    // 寝ているときは呼吸アニメーション（Y軸スケールをゆっくり伸縮）
    // animatePropsの一部として上書きする
    if (!isGhost && expression === 'sleep') {
        animateProps = {
            ...animateProps,
            scaleY: [1, 1.05, 1], // 1 -> 1.05 -> 1 と伸縮
            transition: {
                ...springConfig,
                scaleY: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }
            }
        };
    } else {
        // 通常時
        animateProps.scaleY = 1;
    }

    return (
        <motion.mesh
            initial={{ scale: 0, x: targetX, y: size / 2, z: targetZ }}
            animate={animateProps}
            exit={{ scale: 0 }}
            transition={{
                duration: 0.3,
                type: "spring",
                ...springConfig,
                delay: spawnDelay
            }}
        >
            <boxGeometry args={[size, size, size]} />
            <meshStandardMaterial
                color={color}
                roughness={0.2}
                metalness={0.1}
                transparent
                opacity={isGhost ? 0.5 : 1}
            />

            {!isGhost && <Face color={color} expression={expression} />}

        </motion.mesh>
    );
};