interface FaceProps {
    color: string;
}

export const Face = ({ color }: FaceProps) => {
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

    // 色に応じた表情の定義
    if (normalizedColor === '#F3594F') {
        // --- RED: スタンダード (丸目・にっこり) ---
        eyes = (
            <>
                <mesh position={[-0.2, 0, 0]}>
                    <sphereGeometry args={[0.07, 12, 12]} />
                    {material}
                </mesh>
                <mesh position={[0.2, 0, 0]}>
                    <sphereGeometry args={[0.07, 12, 12]} />
                    {material}
                </mesh>
            </>
        );
        mouth = (
            // U字の口 (Smile)
            <mesh position={[0, 0, 0.08]} rotation={[-Math.PI / 2, 0, Math.PI]}>
                <torusGeometry args={[0.1, 0.03, 8, 16, Math.PI]} />
                {material}
            </mesh>
        );

    } else if (normalizedColor === '#5C73E7') {
        // --- BLUE: クール (横棒目・一直線の口) ---
        eyes = (
            <>
                <mesh position={[-0.2, 0.02, 0]}>
                    <boxGeometry args={[0.12, 0.03, 0.02]} />
                    {material}
                </mesh>
                <mesh position={[0.2, 0.02, 0]}>
                    <boxGeometry args={[0.12, 0.03, 0.02]} />
                    {material}
                </mesh>
            </>
        );
        mouth = (
            // 直線の口
            <mesh position={[0, 0, 0.12]}>
                <boxGeometry args={[0.12, 0.03, 0.02]} />
                {material}
            </mesh>
        );

    } else if (normalizedColor === '#FFD60A') {
        // --- YELLOW: キュート (ぱっちり目 + まつ毛・笑顔の口) ---

        const flatLashes = (
            <>
                <mesh position={[-0.06, 0, -0.08]} rotation={[0, -0.5, 0]}>
                    <boxGeometry args={[0.015, 0.01, 0.05]} />
                    {material}
                </mesh>
                <mesh position={[0, 0, -0.09]}>
                    <boxGeometry args={[0.015, 0.01, 0.05]} />
                    {material}
                </mesh>
                <mesh position={[0.06, 0, -0.08]} rotation={[0, 0.5, 0]}>
                    <boxGeometry args={[0.015, 0.01, 0.05]} />
                    {material}
                </mesh>
            </>
        );

        eyes = (
            <>
                <group position={[-0.22, 0, 0]}>
                    <mesh>
                        <sphereGeometry args={[0.08, 12, 12]} />
                        {material}
                    </mesh>
                    {flatLashes}
                </group>

                <group position={[0.22, 0, 0]}>
                    <mesh>
                        <sphereGeometry args={[0.08, 12, 12]} />
                        {material}
                    </mesh>
                    {flatLashes}
                </group>
            </>
        );

        mouth = (
            // 笑顔の口
            <mesh position={[0, 0, 0.12]} rotation={[-Math.PI / 2, 0, Math.PI]}>
                <torusGeometry args={[0.06, 0.025, 8, 16, Math.PI]} />
                {material}
            </mesh>
        );

    } else if (normalizedColor === '#5BB96A') {
        // --- GREEN: のんびり (たれ目/眠り目・への字口) ---
        eyes = (
            <>
                <mesh position={[-0.2, 0, 0]} scale={[1, 0.4, 1]}>
                    <sphereGeometry args={[0.075, 12, 12]} />
                    {material}
                </mesh>
                <mesh position={[0.2, 0, 0]} scale={[1, 0.4, 1]}>
                    <sphereGeometry args={[0.075, 12, 12]} />
                    {material}
                </mesh>
            </>
        );
        mouth = (
            // への字口
            <mesh position={[0, 0, 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.08, 0.025, 8, 16, Math.PI]} />
                {material}
            </mesh>
        );
    } else {
        // フォールバック
        eyes = (
            <>
                <mesh position={[-0.2, 0, 0]}><sphereGeometry args={[0.07, 12, 12]} />{material}</mesh>
                <mesh position={[0.2, 0, 0]}><sphereGeometry args={[0.07, 12, 12]} />{material}</mesh>
            </>
        );
        mouth = (
            <mesh position={[0, 0, 0.08]} rotation={[-Math.PI / 2, 0, Math.PI]}>
                <torusGeometry args={[0.1, 0.03, 8, 16, Math.PI]} />
                {material}
            </mesh>
        );
    }

    return (
        <group position={[0, 0.501, 0.2]}>
            {eyes}
            {mouth}
        </group>
    );
};