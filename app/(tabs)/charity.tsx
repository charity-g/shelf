import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import React, { Component } from "react";
import * as THREE from "three";

export default class Charity extends Component {
  render() {
    return (
      <GLView style={{ flex: 1 }} onContextCreate={this._onGLContextCreate} />
    );
  }
  _onGLContextCreate = async (gl: WebGLRenderingContext) => {
    // 1. Scene
    let scene = new THREE.Scene();
    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000,
    );
    // 3. Renderer
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    const geometry = new THREE.BoxGeometry();
    let material = new THREE.MeshBasicMaterial({
      vertexColors: THREE.FaceColors,
      overdraw: 0.5,
    });
    let cube = new THREE.Mesh(geometry, material);

    camera.position.z = 5;

    scene.add(cube);

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    animate();
  };
}
