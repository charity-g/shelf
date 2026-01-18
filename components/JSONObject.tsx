import { useEffect, useState } from "react";
import { ObjectLoader } from "three";
import modelJson from "../assets/models/spray_bottle.json";
// import modelJson from "../assets/models/cylinder.json";

interface JSONModelProps {
  category?: string;
  spinnable?: boolean;
}

export function JSONModel({
  category = "cleanser",
  spinnable = false,
}: JSONModelProps) {
  const [object, setObject] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    const loader = new ObjectLoader();
    const loadedObject = loader.parse(modelJson as any);
    setObject(loadedObject);
  }, []);

  if (!object) return null;
  return <primitive object={object} scale={1} position={[0, 0, -5]} />;
}
