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

    // デフォルトのマテリアル設定
    const material = <meshStandardMaterial color={partsColor} roughness={0.8} />;

    let eyes;
    let mouth;

    // --- 表情による分岐 ---
    if (expression === 'sleep') {
        // === SLEEP (寝顔) ===
        // 目は横棒（閉じてる）、口は小さく
        eyes = (
            <>
                {/* 左目 (横棒) */}
                <mesh position={[-0.2, 0, 0]}>
                    <boxGeometry args={[0.12, 0.02, 0.02]} />
                    {material}
                </mesh>
                {/* 右目 (横棒) */}
                <mesh position={[0.2, 0, 0]}>
                    <boxGeometry args={[0.12, 0.02, 0.02]} />
                    {material}
                </mesh>
            </>
        );
        mouth = (
            // 小さな丸い口 (寝息)
            <mesh position={[0, -0.12, 0]}>
                <torusGeometry args={[0.03, 0.015, 8, 16, Math.PI * 2]} />
                {material}
            </mesh>
        );

    } else if (expression === 'yawn') {
        // === YAWN (あくび) ===
        // 目はぎゅっとつむる、口は大きく開ける

        // ぎゅっとつむった目 (「> <」のような形、あるいはへの字)
        const closedEye = (
            <mesh rotation={[0, 0, 0]}>
                <torusGeometry args={[0.05, 0.015, 8, 16, Math.PI]} />
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
            // 大きな縦長の楕円の口
            <mesh position={[0, -0.15, 0.05]}>
                <sphereGeometry args={[0.1, 16, 16]} />
                {material}
            </mesh>
        );

    } else {
        // === NORMAL (通常時の色ごとの個性) ===

        if (normalizedColor === '#F3594F') {
            // RED: スタンダード
            eyes = (
                <>
                    <mesh position={[-0.2, 0, 0]}><sphereGeometry args={[0.07, 12, 12]} />{material}</mesh>
                    <mesh position={[0.2, 0, 0]}><sphereGeometry args={[0.07, 12, 12]} />{material}</mesh>
                </>
            );
            mouth = (
                <mesh position={[0, 0, 0.08]} rotation={[-Math.PI / 2, 0, Math.PI]}>
                    <torusGeometry args={[0.1, 0.03, 8, 16, Math.PI]} />{material}
                </mesh>
            );
        } else if (normalizedColor === '#5C73E7') {
            // BLUE: クール
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
            // YELLOW: キュート
            const flatLashes = (
                <>
                    <mesh position={[-0.06, 0, -0.08]} rotation={[0, -0.5, 0]}><boxGeometry args={[0.015, 0.01, 0.05]} />{material}</mesh>
                    <mesh position={[0, 0, -0.09]}><boxGeometry args={[0.015, 0.01, 0.05]} />{material}</mesh>
                    <mesh position={[0.06, 0, -0.08]} rotation={[0, 0.5, 0]}><boxGeometry args={[0.015, 0.01, 0.05]} />{material}</mesh>
                </>
            );
            eyes = (
                <>
                    <group position={[-0.22, 0, 0]}><mesh><sphereGeometry args={[0.08, 12, 12]} />{material}</mesh>{flatLashes}</group>
                    <group position={[0.22, 0, 0]}><mesh><sphereGeometry args={[0.08, 12, 12]} />{material}</mesh>{flatLashes}</group>
                </>
            );
            mouth = (
                <mesh position={[0, 0, 0.12]} rotation={[-Math.PI / 2, 0, Math.PI]}>
                    <torusGeometry args={[0.06, 0.025, 8, 16, Math.PI]} />{material}
                </mesh>
            );
        } else {
            // GREEN & Fallback: のんびり
            eyes = (
                <>
                    <mesh position={[-0.2, 0, 0]} scale={[1, 0.4, 1]}><sphereGeometry args={[0.075, 12, 12]} />{material}</mesh>
                    <mesh position={[0.2, 0, 0]} scale={[1, 0.4, 1]}><sphereGeometry args={[0.075, 12, 12]} />{material}</mesh>
                </>
            );
            mouth = (
                <mesh position={[0, 0, 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.08, 0.025, 8, 16, Math.PI]} />{material}
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