import { useGLTF } from "@react-three/drei/native";
import { Canvas } from "@react-three/fiber/native";
import { View } from "react-native";

function Model() {
  const gltf = useGLTF(require("@/assets/models/llama.glb"));
  return <primitive object={gltf.scene} scale={1.5} />;
}

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <Canvas>
        <ambientLight />
        <directionalLight position={[5, 5, 5]} />
        <Model />
      </Canvas>
    </View>
  );
}
