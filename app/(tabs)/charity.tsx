import { useGLTF } from "@react-three/drei/native";
import { Canvas } from "@react-three/fiber/native";
import { View } from "react-native";

function Model() {
  const gltf = useGLTF(require("../../assets/models/shelf.glb"));

  // Handle both single GLTF object and array of GLTF objects
  const scene = Array.isArray(gltf) ? gltf[0]?.scene : gltf?.scene;

  if (!scene) return null;
  return <primitive object={scene} scale={1.5} />;
}

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight />
        <directionalLight position={[5, 5, 5]} />
        <Model />
      </Canvas>
    </View>
  );
}
