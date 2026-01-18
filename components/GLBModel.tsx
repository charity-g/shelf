import { useGLTF } from "@react-three/drei/native";
import { useFrame } from "@react-three/fiber/native";
import { useRef } from "react";
import { Box3, Group, Vector3 } from "three";

interface GLBModelProps {
  category?: keyof typeof categoricalMapping;
  spinnable?: boolean;
}

const categoricalMapping = {
  cleanser: "../assets/models/cylinder.glb",
  toner: "../assets/models/toner.glb",
  exfoliant: "../assets/models/exfoliant.glb",
  serum: "../assets/models/serum.glb",
  moisturizer: "../assets/models/moisturizer.glb",
  sunscreen: "../assets/models/sunscreen.glb",
  faceMasks: "../assets/models/face_masks.glb",
};

export default function GLBModel({
  category = "cleanser",
  spinnable = false,
}: GLBModelProps) {
  const gltf = useGLTF(require(categoricalMapping[category.toLowerCase()]));
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
