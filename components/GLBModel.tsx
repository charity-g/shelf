import { useGLTF } from "@react-three/drei/native";

interface GLBModelProps {
  spinnable: boolean;
}

export default function GLBModel({ spinnable }: GLBModelProps) {
  const gltf = useGLTF(require("../assets/models/cylinder.glb"));

  // Handle both single GLTF object and array of GLTF objects
  const scene = Array.isArray(gltf) ? gltf[0]?.scene : gltf?.scene;

  if (!scene) return null;
  return <primitive object={scene} scale={0.5} position={[0, 0, 4]} />;
}
