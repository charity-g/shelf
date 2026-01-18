import { useGLTF } from "@react-three/drei/native";
import { useFrame } from "@react-three/fiber/native";
import { useRef } from "react";
import { Box3, Group, Vector3 } from "three";

interface GLBModelProps {
  category?: string;
  spinnable?: boolean;
}

const categoricalMapping: Record<string, any> = {
  cleanser: require("../assets/models/spray_bottle.glb"),
  toner: require("../assets/models/cylinder.glb"),
  exfoliant: require("../assets/models/cylinder.glb"),
  serum: require("../assets/models/cylinder.glb"),
  moisturizer: require("../assets/models/cylinder.glb"),
  sunscreen: require("../assets/models/spray_bottle.glb"),
  faceMasks: require("../assets/models/cylinder.glb"),
};

export default function GLBModel({
  category = "cleanser",
  spinnable = false,
}: GLBModelProps) {
  const gltf = useGLTF(categoricalMapping[category.toLowerCase()]);
  const pivotRef = useRef<Group>(null);

  // Get the actual scene/mesh
  const scene = Array.isArray(gltf) ? gltf[0]?.scene : gltf?.scene;
  if (!scene) return null;

  // Compute bounding box of the scene
  const box = new Box3().setFromObject(scene);
  const center = new Vector3();
  box.getCenter(center);

  // Position the scene relative to pivot so its visual center is at origin
  scene.position.sub(center);

  // Rotate the pivot group
  useFrame(() => {
    if (spinnable && pivotRef.current) {
      pivotRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={pivotRef} position={[0, 0, 0]}>
      <primitive object={scene} scale={2} />
    </group>
  );
}
