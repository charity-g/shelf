import shelf from "../assets/models/shelf.json";

export function JSONModel({
  category = "cleanser",
  spinnable = false,
}: JSONModelProps) {
  const [object, setObject] = useState<THREE.Object3D | null>(null);
  const config = getModelConfig(category);

  useEffect(() => {
    const loader = new ObjectLoader();
    const loadedObject = loader.parse(shelf as any);
    setObject(loadedObject);
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
