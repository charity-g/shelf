import { useFrame } from "@react-three/fiber/native";
import { useEffect, useRef, useState } from "react";
import { Group, ObjectLoader } from "three";
import getModelConfig from "../utils/getModelConfig";
import { useModelColoring } from "../utils/useModelColouring";

function JSONModelContent({
  object,
  spinnable,
  scale,
  position,
}: {
  object: THREE.Object3D;
  spinnable: boolean;
  scale: number;
  position: [number, number, number];
}) {
  const pivotRef = useRef<Group>(null);

  useModelColoring(object);

  useFrame(() => {
    if (spinnable && pivotRef.current) {
      pivotRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={pivotRef}>
      <primitive object={object} scale={scale} position={position} />
    </group>
  );
}

interface JSONModelProps {
  category?: string;
  spinnable?: boolean;
  scaleMultiplier?: number;
  position?: [number, number, number];
}

export function JSONModel({
  category = "cleanser",
  spinnable = false,
  scaleMultiplier,
  position,
}: JSONModelProps) {
  const [object, setObject] = useState<THREE.Object3D | null>(null);
  const config = getModelConfig(category);

  useEffect(() => {
    const loader = new ObjectLoader();
    const loadedObject = loader.parse(config.obj as any);
    setObject(loadedObject); // triggers re-render instead of lost useRef
  }, [config]);

  if (!object) return null;

  return (
    <JSONModelContent
      object={object}
      spinnable={spinnable}
      scale={scaleMultiplier ? config.scale * scaleMultiplier : config.scale}
      position={position ?? config.position}
    />
  );
}
