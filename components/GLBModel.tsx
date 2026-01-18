import { useGLTF } from "@react-three/drei/native";
import { useFrame } from "@react-three/fiber/native";
import { useRef } from "react";
import { Object3D } from "three";

interface GLBModelProps {
  spinnable: boolean;
}

export default function GLBModel({ spinnable = false }: GLBModelProps) {
  const gltf = useGLTF(require("../assets/models/cylinder.glb"));

  // Typed ref for Three.js object
  const ref = useRef<Object3D>(null);

  // Handle both single GLTF object and array of GLTF objects
  const scene = Array.isArray(gltf) ? gltf[0]?.scene : gltf?.scene;

  // Rotation logic
  useFrame(() => {
    if (spinnable && ref.current) {
      ref.current.rotation.y += 0.01;
    }
  });

  if (!scene) return null;

  return (
    <primitive ref={ref} object={scene} scale={0.5} position={[0, 0, 4]} />
  );
}
