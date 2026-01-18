import { useGLTF } from "@react-three/drei/native";
import { useFrame } from "@react-three/fiber/native";
import { useRef } from "react";
import { Box3, Group, Vector3 } from "three";

interface GLBModelProps {
  spinnable?: boolean;
}

export default function GLBModel({ spinnable = false }: GLBModelProps) {
  const gltf = useGLTF(require("../assets/models/cylinder.glb"));
  const groupRef = useRef<Group>(null);

  // Handle both single GLTF object and array of GLTF objects
  const scene = centerGLBModel(gltf);

  // Rotate the group in place
  useFrame(() => {
    if (spinnable && groupRef.current) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  if (!scene) return null;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Object must be at origin to rotate in place */}
      <primitive object={scene} scale={2} position={[0, 0, 0]} />
    </group>
  );
}

function centerGLBModel(gltf: any) {
  const scene = Array.isArray(gltf) ? gltf[0]?.scene : gltf?.scene;

  if (scene) {
    // Compute bounding box
    const box = new Box3().setFromObject(scene);
    const center = new Vector3();
    box.getCenter(center);

    // Offset the object so its center is at [0,0,0]
    scene.position.x -= center.x;
    scene.position.y -= center.y;
    scene.position.z -= center.z;
  }

  return scene;
}
