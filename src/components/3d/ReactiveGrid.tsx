import { extend } from '@react-three/fiber';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { GRID_SIZE } from '../../utils/gameUtils';

// Define the static shards grid material
const ShardsGridMaterial = shaderMaterial(
    {
        uColor: new THREE.Color('#ffffff'),
        uGridSize: GRID_SIZE,
    },
    // Vertex Shader: Standard position calculation
    `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    // Fragment Shader: Sharp static white grid lines on black background
    `
    varying vec2 vUv;
    uniform float uGridSize;
    uniform vec3 uColor;

    void main() {
        vec2 grid = fract(vUv * uGridSize);
        // Sharp lines with width ~0.02
        float line = step(0.98, grid.x) + step(0.98, grid.y);
        vec3 color = mix(vec3(0.0), uColor, clamp(line, 0.0, 1.0));
        gl_FragColor = vec4(color, 1.0);
    }
    `
);

// Register the material with R3F
extend({ ShardsGridMaterial });

// Type augmentation for JSX
declare module '@react-three/fiber' {
    interface ThreeElements {
        shardsGridMaterial: {
            attach?: string
            args?: any[]
            ref?: any
            key?: any
            onUpdate?: (self: THREE.ShaderMaterial) => void
            uColor?: THREE.Color
            uGridSize?: number
            transparent?: boolean
            wireframe?: boolean
            side?: THREE.Side
        }
    }
}

export const ReactiveGrid = () => {
    return (
        <mesh position={[0, 0, -0.05]}>
            <planeGeometry args={[10, 10]} />
            <shardsGridMaterial
                uColor={new THREE.Color('#ffffff')}
                transparent={false}
            />
        </mesh>
    );
};
