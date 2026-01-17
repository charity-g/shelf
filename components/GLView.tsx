import { GLView } from "expo-gl";
import ExpoTHREE from "expo-three";
import React from "react";
import { View } from "react-native";

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <GLView
        style={{ width: 300, height: 300 }}
        onContextCreate={onContextCreate}
      />
    </View>
  );
}

function onContextCreate(gl) {
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  const scene = new ExpoTHREE.Scene();
  const camera = new ExpoTHREE.PerspectiveCamera(
    75,
    gl.drawingBufferWidth / gl.drawingBufferHeight,
    0.1,
    1000,
  );
  camera.position.z = 5;
  const loader = new ExpoTHREE.GLTFLoader();
  loader.loadAsync("path/to/your/model.glb").then((gltf) => {
    scene.add(gltf.scene);
  });
  const renderer = new ExpoTHREE.WebGLRenderer({ gl, scene, camera });
  renderer.render();
}
