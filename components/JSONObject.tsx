import { useFrame } from "@react-three/fiber/native";
import { useEffect, useRef } from "react";
import { Color, Group, ObjectLoader } from "three";
import modelJson from "../assets/models/spray_bottle.json";

interface JSONModelProps {
  category?: string;
  spinnable?: boolean;
}

function JSONModelContent({
  object,
  spinnable,
}: {
  object: THREE.Object3D;
  spinnable: boolean;
}) {
  const pivotRef = useRef<Group>(null);

  useEffect(() => {
    // Generate random color and apply to all materials
    const randomColor = new Color(Math.random() * 0xffffff);
    object.traverse((child: any) => {
      if (child.isMesh && child.material) {
        child.material.color.copy(randomColor);
      }
    });
  }, [object]);

  useFrame(() => {
    if (spinnable && pivotRef.current) {
      pivotRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={pivotRef}>
      <primitive object={object} scale={0.7} position={[0, 0, 0]} />
    </group>
  );
}

export function JSONModel({
  category = "cleanser",
  spinnable = false,
}: JSONModelProps) {
  const object = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    const loader = new ObjectLoader();
    const loadedObject = loader.parse(modelJson as any);
    object.current = loadedObject;
  }, []);

  if (!object.current) return null;
  return <JSONModelContent object={object.current} spinnable={spinnable} />;
}
