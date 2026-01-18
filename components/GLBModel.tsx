import { useGLTF } from "@react-three/drei/native";
import { useFrame, useThree } from "@react-three/fiber/native";
import { useMemo, useRef } from "react";
import getModelConfig from "../types/modelConfig";

interface GLBModelProps {
  category?: string;
  spinnable?: boolean;
}

export default function GLBModel({
  category = "cleanser",
  spinnable = false,
}: GLBModelProps) {
  const config = getModelConfig(category);
  const gltf = useGLTF(config.path);
  const { scene: threeScene } = useThree();

  const pivotRef = useRef(null);

  const scene = useMemo(() => {
    const original = gltf.scene;
    const cloned = original.clone(true);

    // Center the cloned object
    const box = new (threeScene.constructor as any).Box3().setFromObject(
      cloned,
    );
    const center = new (threeScene.constructor as any).Vector3();
    box.getCenter(center);
    cloned.position.sub(center);

    return cloned;
  }, [gltf, threeScene]);

  useFrame(() => {
    if (spinnable && pivotRef.current) {
      pivotRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={pivotRef}>
      <primitive object={scene} scale={config.scale} />
    </group>
  );
}
