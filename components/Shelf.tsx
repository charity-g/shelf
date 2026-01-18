import { useEffect, useState } from "react";
import { ObjectLoader } from "three";
import shelf from "../assets/models/shelf.json";
import { ShelfItem } from "../types/ShelfItem";
import getModelConfig from "../utils/getModelConfig";

export function Shelf({ data }: { data: ShelfItem[] }) {
  return <ShelfModel />;
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
