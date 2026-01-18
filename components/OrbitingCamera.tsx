import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export const OrbitingCamera = ({ radius = 5, speed = 0.5 }) => {
  const angle = useRef(0);

  useFrame(({ camera }) => {
    angle.current += speed * 0.03;
    const x = radius * Math.sin(angle.current);
    const z = radius * Math.cos(angle.current);
    camera.position.set(x, 0, z);
    camera.lookAt(0, 0, 0); // look at the center
  });

  return null; // this component doesn’t render anything
};
