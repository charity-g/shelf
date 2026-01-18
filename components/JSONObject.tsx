import { useFrame } from "@react-three/fiber/native";
import { useEffect, useRef, useState } from "react";
import { Color, Group, ObjectLoader } from "three";
import cream from "../assets/models/cream.json";
import cylinder from "../assets/models/cylinder.json";
import lotion from "../assets/models/lotion.json";
import spray from "../assets/models/spray_bottle.json";

interface JSONModelProps {
  category?: string;
  spinnable?: boolean;
}

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
      <primitive object={object} scale={scale} position={position} />
    </group>
  );
}

export function JSONModel({
  category = "cleanser",
  spinnable = false,
}: JSONModelProps) {
  const [object, setObject] = useState<THREE.Object3D | null>(null);
  const config = getModelConfig(category);

  useEffect(() => {
    const loader = new ObjectLoader();
    const loadedObject = loader.parse(config.obj as any);
    setObject(loadedObject); // 🔥 triggers re-render
  }, [config]);

  if (!object) return null;

  return (
    <JSONModelContent
      object={object}
      spinnable={spinnable}
      scale={config.scale}
      position={config.position}
    />
  );
}

interface ModelConfig {
  obj: any;
  scale: number;
  position: [number, number, number];
}

const categoricalMapping: Record<string, ModelConfig> = {
  cleanser: {
    obj: spray,
    scale: 0.8,
    position: [0, 0, 0],
  },
  toner: {
    obj: lotion,
    scale: 0.6,
    position: [0, 0, 0],
  },
  exfoliant: {
    obj: cylinder,
    scale: 0.6,
    position: [0, 0, 0],
  },
  serum: {
    obj: lotion,
    scale: 0.6,
    position: [0, 0, 0],
  },
  moisturizer: {
    obj: lotion,
    scale: 0.6,
    position: [0, 0, 0],
  },
  sunscreen: {
    obj: spray,
    scale: 0.8,
    position: [0, 0, 0],
  },
  facemasks: {
    obj: cream,
    scale: 1,
    position: [0, 0, 0],
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
    scale: 0.7,
    position: [0, 0, 0],
  };
}
