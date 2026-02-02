interface FaceProps {
    color: string;
    expression?: 'normal' | 'sleep' | 'yawn';
}

export const Face = ({ color, expression = 'normal' }: FaceProps) => {
    const normalizedColor = color.toUpperCase();

    // ブロックの色に合わせて顔パーツの色(濃い同系色)を決定
    let partsColor = "#333333";

    if (normalizedColor === '#F3594F') {
        partsColor = "#851D18"; // Dark Red
    } else if (normalizedColor === '#5C73E7') {
        partsColor = "#202B5C"; // Dark Blue
    } else if (normalizedColor === '#FFD60A') {
        partsColor = "#8A5600"; // Dark Brown/Amber
    } else if (normalizedColor === '#5BB96A') {
        partsColor = "#1A5226"; // Dark Green
    }

    // 最適化: meshStandardMaterial -> meshLambertMaterial (計算が軽い)
    const material = <meshLambertMaterial color={partsColor} />;

    let eyes;
    let mouth;

    // --- 表情による分岐 ---
    if (expression === 'sleep') {
        // === SLEEP (寝顔) ===
        eyes = (
            <>
                <mesh position={[-0.2, 0, 0]}>
                    <boxGeometry args={[0.12, 0.02, 0.02]} />
                    {material}
                </mesh>
                <mesh position={[0.2, 0, 0]}>
                    <boxGeometry args={[0.12, 0.02, 0.02]} />
                    {material}
                </mesh>
            </>
        );
        mouth = (
            <mesh position={[0, -0.12, 0]}>
                {/* 最適化: 分割数を 16 -> 8 に削減 */}
                <torusGeometry args={[0.03, 0.015, 6, 8, Math.PI * 2]} />
                {material}
            </mesh>
        );

    } else if (expression === 'yawn') {
        // === YAWN (あくび) ===
        const closedEye = (
            <mesh rotation={[0, 0, 0]}>
                {/* 最適化: 分割数を削減 */}
                <torusGeometry args={[0.05, 0.015, 6, 8, Math.PI]} />
                {material}
            </mesh>
        );

        eyes = (
            <>
                <group position={[-0.2, 0.02, 0]}>{closedEye}</group>
                <group position={[0.2, 0.02, 0]}>{closedEye}</group>
            </>
        );

        mouth = (
            <mesh position={[0, -0.15, 0.05]}>
                {/* 最適化: 分割数を 16 -> 8, 16 -> 8 に削減 */}
                <sphereGeometry args={[0.1, 8, 8]} />
                {material}
            </mesh>
        );

    } else {
        // === NORMAL (通常時の色ごとの個性) ===

        if (normalizedColor === '#F3594F') {
            // RED
            eyes = (
                <>
                    {/* 最適化: 球体の分割数を 12 -> 8 に削減 */}
                    <mesh position={[-0.2, 0, 0]}><sphereGeometry args={[0.07, 8, 8]} />{material}</mesh>
                    <mesh position={[0.2, 0, 0]}><sphereGeometry args={[0.07, 8, 8]} />{material}</mesh>
                </>
            );
            mouth = (
                <mesh position={[0, 0, 0.08]} rotation={[-Math.PI / 2, 0, Math.PI]}>
                    <torusGeometry args={[0.1, 0.03, 6, 8, Math.PI]} />{material}
                </mesh>
            );
        } else if (normalizedColor === '#5C73E7') {
            // BLUE
            eyes = (
                <>
                    <mesh position={[-0.2, 0.02, 0]}><boxGeometry args={[0.12, 0.03, 0.02]} />{material}</mesh>
                    <mesh position={[0.2, 0.02, 0]}><boxGeometry args={[0.12, 0.03, 0.02]} />{material}</mesh>
                </>
            );
            mouth = (
                <mesh position={[0, 0, 0.12]}><boxGeometry args={[0.12, 0.03, 0.02]} />{material}</mesh>
            );
        } else if (normalizedColor === '#FFD60A') {
            // YELLOW
            const flatLashes = (
                <>
                    <mesh position={[-0.06, 0, -0.08]} rotation={[0, -0.5, 0]}><boxGeometry args={[0.015, 0.01, 0.05]} />{material}</mesh>
                    <mesh position={[0, 0, -0.09]}><boxGeometry args={[0.015, 0.01, 0.05]} />{material}</mesh>
                    <mesh position={[0.06, 0, -0.08]} rotation={[0, 0.5, 0]}><boxGeometry args={[0.015, 0.01, 0.05]} />{material}</mesh>
                </>
            );
            eyes = (
                <>
                    <group position={[-0.22, 0, 0]}><mesh><sphereGeometry args={[0.08, 8, 8]} />{material}</mesh>{flatLashes}</group>
                    <group position={[0.22, 0, 0]}><mesh><sphereGeometry args={[0.08, 8, 8]} />{material}</mesh>{flatLashes}</group>
                </>
            );
            mouth = (
                <mesh position={[0, 0, 0.12]} rotation={[-Math.PI / 2, 0, Math.PI]}>
                    <torusGeometry args={[0.06, 0.025, 6, 8, Math.PI]} />{material}
                </mesh>
            );
        } else {
            // GREEN & Fallback
            eyes = (
                <>
                    <mesh position={[-0.2, 0, 0]} scale={[1, 0.4, 1]}><sphereGeometry args={[0.075, 8, 8]} />{material}</mesh>
                    <mesh position={[0.2, 0, 0]} scale={[1, 0.4, 1]}><sphereGeometry args={[0.075, 8, 8]} />{material}</mesh>
                </>
            );
            mouth = (
                <mesh position={[0, 0, 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.08, 0.025, 6, 8, Math.PI]} />{material}
                </mesh>
            );
        }
    }

    return (
        <group position={[0, 0.501, 0.2]}>
            {eyes}
            {mouth}
        </group>
    );
};