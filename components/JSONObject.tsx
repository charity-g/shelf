import { Asset } from "expo-asset";
import { useEffect, useState } from "react";
import { ObjectLoader } from "three";

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
    async function load() {
      const asset = Asset.fromModule(
        require("../assets/models/spray_bottle.json"),
      );
      await asset.downloadAsync();

      const response = await fetch(asset.uri);
      const json = await response.json();

      const loader = new ObjectLoader();
      const loadedObject = loader.parse(json);

      setObject(loadedObject);
    }

    load();
  }, []);

  if (!object) return null;

  return <primitive object={object} />;
}
