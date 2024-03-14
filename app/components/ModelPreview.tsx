import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls, OrbitControls } from "@react-three/drei";

type Props = {
    url: string;
};

function ModelPreview({ url }: Props) {
    const { scene } = useGLTF(url);
    useEffect(() => {
        return () => {
            URL.revokeObjectURL(url);
        };
    }, [url]);
    return (
        <Canvas style={{ borderRadius: "20px" }} dpr={[1, 2]} camera={{ fov: 45 }}>
            <color attach="background" args={["#343444"]} />
            <OrbitControls />
            <PresentationControls speed={1.5} global zoom={0.5} polar={[-0.1, Math.PI / 4]}>
                <Stage shadows>
                    <primitive object={scene} />
                </Stage>
            </PresentationControls>
        </Canvas>
    );
}

export default ModelPreview;
