import { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { ReactiveGrid } from './ReactiveGrid';
import { Block3D } from './Block3D';
import type { GridState, Point } from '../../types/game';
import { GRID_SIZE } from '../../utils/gameUtils'; // GRID_SIZEを使用
import { AnimatePresence } from 'framer-motion';

// レスポンシブ対応カメラコントローラー
const ResponsiveCamera = () => {
    const { camera, size } = useThree();

    useEffect(() => {
        // 盤面全体が見えるようにするための計算
        // GRID_SIZE に少し余白(margin)を足したサイズを基準にする
        const margin = 1.2;
        const targetSize = GRID_SIZE + margin;

        const fov = 50;
        const fovRad = (fov * Math.PI) / 180;

        // 基本距離（縦が収まる距離）
        // distance = (height / 2) / tan(fov / 2)
        let dist = (targetSize / 2) / Math.tan(fovRad / 2);

        const aspect = size.width / size.height;

        // アスペクト比が1未満（縦長画面・スマホ等）の場合
        // 横幅が見切れないように、アスペクト比分だけ距離を離す
        if (aspect < 1) {
            dist = dist / aspect;
        }

        camera.position.set(0, dist, 0);
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
    const activeBlocks = smallBlocks.flatMap((col, x) =>
        col.map((block, y) => block ? { ...block, x, y } : null)
    ).filter((b): b is NonNullable<typeof b> => b !== null);

    return (
        <div style={{
            width: '100%',
            height: '100%', // 親要素に合わせて100%にする
            aspectRatio: '1/1', // 正方形を維持
            position: 'relative',
            margin: '0 auto'
        }}>
            <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
                <PerspectiveCamera
                    makeDefault
                    fov={50}
                // positionはResponsiveCameraで制御するため初期値は何でも良い
                />

                {/* ここでカメラ位置を制御 */}
                <ResponsiveCamera />

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