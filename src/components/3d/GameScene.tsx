import { Canvas } from '@react-three/fiber';
import { OrthographicCamera, Environment } from '@react-three/drei';
import { ReactiveGrid } from './ReactiveGrid';
import { Block3D } from './Block3D';
import type { GridState } from '../../types/game';
import { AnimatePresence } from 'framer-motion';

interface GameSceneProps {
    smallBlocks: GridState;
}

export const GameScene = ({ smallBlocks }: GameSceneProps) => {
    return (
        <div style={{ width: 'min(90vw, 500px)', height: 'min(90vw, 500px)', position: 'relative' }}>
            <Canvas shadows dpr={[1, 2]}>
                <OrthographicCamera
                    makeDefault
                    position={[0, 0, 10]}
                    zoom={50}
                />

                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
                <pointLight position={[-10, -10, -5]} intensity={0.5} />

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
                </AnimatePresence>

                <Environment preset="city" />
            </Canvas>
        </div>
    );
};
