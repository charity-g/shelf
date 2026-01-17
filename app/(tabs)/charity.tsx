import Llama from "@/models/Llama";
// import { OrbitControls } from "@react-three/drei/native";
import { Canvas } from "@react-three/fiber/native";
import React, { Suspense } from "react";
import { View } from "react-native";

export default function Charity() {
  const renderLlamaCanvas = () => {
    return (
      <Canvas shadows>
        <directionalLight position={[5, 10, 15]} intensity={1} castShadow />
        <directionalLight position={[-10, 10, 15]} intensity={1} />
        <directionalLight position={[10, 10, 15]} intensity={1} />
        <Suspense fallback={null}>
          <Llama /> This renders the Llama model
          <mesh
            receiveShadow
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -1, 0]}
          >
            <planeGeometry args={[10, 10]} />
            <shadowMaterial opacity={0.5} />
          </mesh>
        </Suspense>
        {/* <OrbitControls enableZoom={false} /> */}
      </Canvas>
    );
  };

  return <View style={{ flex: 1 }}>{renderLlamaCanvas()}</View>;
}
