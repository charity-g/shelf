import { useGLTF } from "@react-three/drei/native";
import { useFrame } from "@react-three/fiber/native";
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

  const pivotRef = useRef(null);

  const scene = useMemo(() => {
    return gltf.scene.clone(true);
  }, [gltf]);

  useFrame(() => {
    if (spinnable && pivotRef.current) {
      pivotRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={pivotRef}>
      <primitive object={scene} scale={config.scale} />oned;
    </group>  }, [gltf, threeScene]);
  );
}
