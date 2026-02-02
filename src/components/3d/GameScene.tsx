import { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { ReactiveGrid } from './ReactiveGrid';
import { Block3D } from './Block3D';
import type { GridState, Point } from '../../types/game';
import { GRID_SIZE } from '../../utils/gameUtils';
import { AnimatePresence } from 'framer-motion';

const CameraController = () => {
    const { camera, size } = useThree();

    useEffect(() => {
        const aspect = size.width / size.height;
        const targetSize = GRID_SIZE * 1.3; // 少し引きの画角に調整

        const fov = 50;
        const fovRad = (fov * Math.PI) / 180;

        let dist = (targetSize / 2) / Math.tan(fovRad / 2);

        if (aspect < 1) {
            dist = dist / aspect;
        }

        // カメラ位置を少し手前に傾けて見やすくする
        camera.position.set(0, dist, dist * 0.1);
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();

    }, [camera, size]);

    return null;
};

interface GameSceneProps {
    smallBlocks: GridState;
    nextSpawnPos: Point | null;
    nextSpawnColors: string[];
    bumpEvent: { x: number; y: number; id: number } | null;
}

export const GameScene = ({ smallBlocks, bumpEvent }: GameSceneProps) => {
    // 描画すべきブロックのリストを事前に作成（nullを除外）
    const activeBlocks = smallBlocks.flatMap((col, x) =>
        col.map((block, y) => block ? { ...block, x, y } : null)
    ).filter((b): b is NonNullable<typeof b> => b !== null);

    return (
        <div style={{
            width: '100%',
            aspectRatio: '1/1',
            position: 'relative',
            margin: '0 auto'
        }}>
            <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
                <PerspectiveCamera
                    makeDefault
                    position={[0, 12, 0]}
                    fov={50}
                // onUpdateでのlookAt強制を削除し、Controllerに任せる
                />

                <CameraController />

                <ambientLight intensity={1.5} color="#ffffff" />
                <directionalLight
                    position={[10, 20, 10]}
                    intensity={1.0}
                    color="#ffffff"
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                />
                <pointLight position={[-10, 10, -10]} intensity={0.5} color="#ffffff" />

                <ReactiveGrid />

                {/* ブロックの描画 */}
                <AnimatePresence>
                    {activeBlocks.map((block) => (
                        <Block3D
                            key={block.id}
                            x={block.x}
                            y={block.y}
                            type="small"
                            color={block.color}
                            bumpEvent={bumpEvent}
                        />
                    ))}
                </AnimatePresence>
            </Canvas>
        </div>
    );
};