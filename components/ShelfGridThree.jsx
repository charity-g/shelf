import { useGLTF } from "@react-three/drei/native";

function ShelfSlot({ object, position, scale = 0.2 }) {
  if (!object) return null;

  const gltf = useGLTF(object);
  const scene = Array.isArray(gltf) ? gltf[0]?.scene : gltf?.scene;

  if (!scene) return null;

  scene.scale.set(scale, scale, scale);
  scene.position.set(...position);

  return <primitive object={scene} />;
}

export default function ShelfGridThree({ rows, columns, items, spacing = 1 }) {
  const totalSlots = rows * columns;

  const displayItems = [...items];
  while (displayItems.length < totalSlots) displayItems.push(null);

  const positions = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      // center grid around origin
      positions.push([
        (c - (columns - 1) / 2) * spacing,
        0,
        -(r - (rows - 1) / 2) * spacing,
      ]);
    }
  }

  return (
    <>
      {displayItems.map((obj, idx) => (
        <ShelfSlot key={idx} object={obj} position={positions[idx]} />
      ))}
    </>
  );
}
