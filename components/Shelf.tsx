import { Canvas } from "@react-three/fiber/native";
import { Suspense, useEffect, useState } from "react";
import { ObjectLoader } from "three";
import shelf from "../assets/models/shelf.json";
import { ShelfItem } from "../types/ShelfItem";
import getModelConfig from "../utils/getModelConfig";
import { JSONModel } from "./JSONObject";

export function Shelf({ data }: { data: ShelfItem[] }) {
  return (
    <Canvas camera={{ position: [0, 10, 14] }}>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} />

      <ShelfModel />
      {data.map((item, index) => {
        const [x, y, z] = getModelConfig(item.category).position;
        return (
          <Suspense key={index} fallback={null}>
            <JSONModel
              category={item.category}
              spinnable={false}
              scaleMultiplier={2}
              position={[x - 2 * data.length + index * 3, y + 2, z]}
            />
          </Suspense>
        );
      })}
    </Canvas>
  );
}

function ShelfModel() {
  const [object, setObject] = useState<THREE.Object3D | null>(null);
  const config = getModelConfig("cleanser");

  useEffect(() => {
    const loader = new ObjectLoader();
    const loadedObject = loader.parse(shelf as any);
    setObject(loadedObject);
  }, [config]);

  if (!object) return null;

  return <primitive object={object} scale={1} position={[0, 0, 0]} />;
}
