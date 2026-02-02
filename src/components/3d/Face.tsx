interface FaceProps {
    color: string;
}

export const Face = ({ color }: FaceProps) => {
    const partsColor = "#333333";
    const normalizedColor = color.toUpperCase();

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
            // U字の口 (Torusの下半分)
            <mesh position={[0, -0.02, 0]} rotation={[0, 0, Math.PI]}>
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
            <mesh position={[0, -0.12, 0]}>
                <boxGeometry args={[0.12, 0.03, 0.02]} />
                {material}
            </mesh>
        );

    } else if (normalizedColor === '#FFD60A') {
        // --- YELLOW: キュート (ぱっちり目 + まつ毛・笑顔の口) ---

        // まつ毛の定義
        const lashes = (
            <>
                <mesh position={[-0.06, 0.1, 0]} rotation={[0, 0, -0.5]}>
                    <boxGeometry args={[0.015, 0.05, 0.01]} />
                    {material}
                </mesh>
                <mesh position={[0, 0.11, 0]}>
                    <boxGeometry args={[0.015, 0.05, 0.01]} />
                    {material}
                </mesh>
                <mesh position={[0.06, 0.1, 0]} rotation={[0, 0, 0.5]}>
                    <boxGeometry args={[0.015, 0.05, 0.01]} />
                    {material}
                </mesh>
            </>
        );

        eyes = (
            <>
                {/* 左目エリア */}
                <group position={[-0.22, 0.02, 0]}>
                    <mesh>
                        <sphereGeometry args={[0.08, 12, 12]} />
                        {material}
                    </mesh>
                    {lashes}
                </group>

                {/* 右目エリア */}
                <group position={[0.22, 0.02, 0]}>
                    <mesh>
                        <sphereGeometry args={[0.08, 12, 12]} />
                        {material}
                    </mesh>
                    {lashes}
                </group>
            </>
        );

        // 修正: 笑顔の口に変更 (U字)
        mouth = (
            <mesh position={[0, -0.12, 0]} rotation={[0, 0, Math.PI]}>
                <torusGeometry args={[0.06, 0.025, 8, 16, Math.PI]} />
                {material}
            </mesh>
        );

    } else if (normalizedColor === '#5BB96A') {
        // --- GREEN: のんびり (たれ目/眠り目・への字口) ---
        eyes = (
            <>
                {/* 少し平たい目 */}
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
            // への字口 (Torusの上半分)
            <mesh position={[0, -0.12, 0]} rotation={[0, 0, 0]}>
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
            <mesh position={[0, -0.02, 0]} rotation={[0, 0, Math.PI]}>
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