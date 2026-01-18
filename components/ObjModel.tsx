import { useLoader } from "@react-three/fiber/native";
import React from "react";
import { ColorRepresentation, MeshStandardMaterial, Object3D } from "three";
import { OBJLoader } from "three-stdlib";

interface ObjModelProps {
  file: string | number; // number for require('./file.obj'), string for URL
  color?: ColorRepresentation; // Three.js color type (string, number, or Color)
  scale?: number;
}

const ObjModel: React.FC<ObjModelProps> = ({
  file,
  color = "orange",
  scale = 1,
}) => {
  // Load OBJ
  const obj = useLoader(OBJLoader, file) as Object3D;

  // Traverse meshes and assign color
  obj.traverse((child) => {
    if ((child as any).isMesh) {
      (child as THREE.Mesh).material = new MeshStandardMaterial({ color });
    }
  });

  // Scale model
  obj.scale.set(scale, scale, scale);

  return <primitive object={obj} />;
};

export default ObjModel;
