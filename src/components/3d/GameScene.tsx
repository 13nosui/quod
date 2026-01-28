import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import { ReactiveGrid } from './ReactiveGrid';
import { Block3D } from './Block3D';
import type { GridState, Point } from '../../types/game';
import { AnimatePresence } from 'framer-motion';

interface GameSceneProps {
    smallBlocks: GridState;
    nextSpawnPos: Point | null;
    nextSpawnColors: string[];
}

export const GameScene = ({ smallBlocks, nextSpawnPos, nextSpawnColors }: GameSceneProps) => {
    return (
        <div style={{ width: 'min(90vw, 500px)', height: 'min(90vw, 500px)', position: 'relative' }}>
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera
                    makeDefault
                    position={[0, 7, 0]}
                    up={[0, 0, -1]}
                    fov={50}
                    onUpdate={(c) => c.lookAt(0, 0, 0)}
                />

                <ReactiveGrid />

                <AnimatePresence>
                    {smallBlocks.flatMap((col, x) =>
                        col.map((block, y) => {
                            if (!block) return null;
                            return (
                                <Block3D
                                    key={block.id}
                                    x={x}
                                    y={y}
                                    type="small"
                                    color={block.color}
                                />
                            );
                        })
                    )}

                    {nextSpawnPos && nextSpawnColors.length === 4 && (
                        <>
                            <Block3D key="ghost-0" x={nextSpawnPos.x} y={nextSpawnPos.y} type="small" color={nextSpawnColors[0]} isGhost />
                            <Block3D key="ghost-1" x={nextSpawnPos.x + 1} y={nextSpawnPos.y} type="small" color={nextSpawnColors[2]} isGhost />
                            <Block3D key="ghost-2" x={nextSpawnPos.x} y={nextSpawnPos.y + 1} type="small" color={nextSpawnColors[1]} isGhost />
                            <Block3D key="ghost-3" x={nextSpawnPos.x + 1} y={nextSpawnPos.y + 1} type="small" color={nextSpawnColors[3]} isGhost />
                        </>
                    )}
                </AnimatePresence>

                <Environment preset="city" />
            </Canvas>
        </div>
    );
};
