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
            // U字の口 (Smile)
            // X軸で-90度回転させて寝かせ、Z軸で180度回転させてU字にする
            <mesh position={[0, 0, 0.08]} rotation={[-Math.PI / 2, 0, Math.PI]}>
                <torusGeometry args={[0.1, 0.03, 8, 16, Math.PI]} />
                {material}
            </mesh>
        );

    } else if (normalizedColor === '#5C73E7') {
        // --- BLUE: クール (横棒目・一直線の口) ---
        eyes = (
            <>
                {/* 目: 表面に貼り付くボックス */}
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

        // まつ毛 (表面に寝かせる形に調整)
        const flatLashes = (
            <>
                {/* 左寄り・上向き(Zマイナス方向) */}
                <mesh position={[-0.06, 0, -0.08]} rotation={[0, -0.5, 0]}>
                    <boxGeometry args={[0.015, 0.01, 0.05]} /> {/* W, H(厚み), D(長さ) */}
                    {material}
                </mesh>
                {/* 中央・上向き */}
                <mesh position={[0, 0, -0.09]}>
                    <boxGeometry args={[0.015, 0.01, 0.05]} />
                    {material}
                </mesh>
                {/* 右寄り・上向き */}
                <mesh position={[0.06, 0, -0.08]} rotation={[0, 0.5, 0]}>
                    <boxGeometry args={[0.015, 0.01, 0.05]} />
                    {material}
                </mesh>
            </>
        );

        eyes = (
            <>
                {/* 左目エリア */}
                <group position={[-0.22, 0, 0]}>
                    <mesh>
                        <sphereGeometry args={[0.08, 12, 12]} />
                        {material}
                    </mesh>
                    {flatLashes}
                </group>

                {/* 右目エリア */}
                <group position={[0.22, 0, 0]}>
                    <mesh>
                        <sphereGeometry args={[0.08, 12, 12]} />
                        {material}
                    </mesh>
                    {flatLashes}
                </group>
            </>
        );

        // 笑顔の口 (Smile)
        mouth = (
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
            // への字口 (Frown)
            // Z軸回転なしだとアーチ状(への字)になる
            <mesh position={[0, 0, 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.08, 0.025, 8, 16, Math.PI]} />
                {material}
            </mesh>
        );
    } else {
        // フォールバック (Redと同じ)
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

    // 顔全体をブロック上面(Y=0.501)に配置
    // Z=0.2 は顔の中心を少し手前(アゴ寄り)にずらすオフセット
    return (
        <group position={[0, 0.501, 0.2]}>
            {eyes}
            {mouth}
        </group>
    );
};