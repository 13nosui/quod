import { extend } from '@react-three/fiber';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { GRID_SIZE } from '../../utils/gameUtils';

const QuodGridMaterial = shaderMaterial(
    {
        uBgColor: new THREE.Color('#ffffff'),
        uTileColor: new THREE.Color('#ebebeb'),
        uGridSize: GRID_SIZE,
    },
    `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    `
    varying vec2 vUv;
    uniform float uGridSize;
    uniform vec3 uBgColor;
    uniform vec3 uTileColor;

    void main() {
        vec2 grid = fract(vUv * uGridSize);
        float margin = 0.02;
        float mask = step(margin, grid.x) * step(margin, grid.y) * step(grid.x, 1.0 - margin) * step(grid.y, 1.0 - margin);
        vec3 color = mix(uBgColor, uTileColor, mask);
        gl_FragColor = vec4(color, 1.0);
    }
    `
);

extend({ QuodGridMaterial });

declare module '@react-three/fiber' {
    interface ThreeElements {
        quodGridMaterial: {
            attach?: string
            args?: any[]
            ref?: any
            key?: any
            onUpdate?: (self: THREE.ShaderMaterial) => void
            uBgColor?: THREE.Color
            uTileColor?: THREE.Color
            uGridSize?: number
            transparent?: boolean
            wireframe?: boolean
            side?: THREE.Side
        }
    }
}

export const ReactiveGrid = () => {
    return (
        // receiveShadow を削除
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[GRID_SIZE, GRID_SIZE]} />
            <quodGridMaterial
                uBgColor={new THREE.Color('#ffffff')}
                uTileColor={new THREE.Color('#ebebeb')}
                uGridSize={GRID_SIZE}
                transparent={false}
            />
        </mesh>
    );
};