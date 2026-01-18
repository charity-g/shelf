import { useFrame } from "@react-three/fiber/native";
import { useEffect, useRef } from "react";
import { Color, Group, ObjectLoader } from "three";
import cream from "../assets/models/cream.json";
import cylinder from "../assets/models/cylinder.json";
import serum from "../assets/models/inverted_squeez_bootle.json";
import lotion from "../assets/models/lotion.json";
import spray from "../assets/models/spray_bottle.json";

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

  const config = getModelConfig(category);

  useEffect(() => {
    const loader = new ObjectLoader();
    const loadedObject = loader.parse(config.obj as any);
    object.current = loadedObject;
  }, []);

  if (!object.current) return null;
  return <JSONModelContent object={object.current} spinnable={spinnable} />;
}

interface ModelConfig {
  obj: any;
  scale: number;
  position: [number, number, number];
}

const categoricalMapping: Record<string, ModelConfig> = {
  cleanser: {
    obj: spray,
    scale: 3,
    position: [0, 0, 6],
  },
  toner: {
    obj: lotion,
    scale: 2,
    position: [0, 0, 3],
  },
  exfoliant: {
    obj: cylinder,
    scale: 2,
    position: [0, 0, 3],
  },
  serum: {
    obj: serum,
    scale: 2,
    position: [0, 0, 3],
  },
  moisturizer: {
    obj: lotion,
    scale: 2,
    position: [0, 0, 3],
  },
  sunscreen: {
    obj: spray,
    scale: 1.5,
    position: [0, -0.5, 0],
  },
  facemasks: {
    obj: cream,
    scale: 2,
    position: [0, 0, 3],
  },
};

export default function getModelConfig(category: string): ModelConfig {
  category = category.toLowerCase().replace(" ", "");
  if (category in categoricalMapping) {
    return categoricalMapping[category];
  }
  console.log("Category not found, defaulting to spray_bottle.glb:", category);
  return {
    obj: spray,
    scale: 1.5,
    position: [0, -0.5, 0],
  };
}
