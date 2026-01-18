import { useEffect } from "react";
import { Color, Object3D } from "three";
import { colors } from "../styles/shared";

const palette = [
  colors.accentSoft,
  colors.accent,
  colors.lavender,
  colors.mint,
].map((c) => new Color(c));

export function useModelColoring(object: Object3D | null) {
  useEffect(() => {
    if (!object) return;

    let index = 0;

    object.traverse((child: any) => {
      if (child.isMesh && child.material) {
        const base = palette[index % palette.length].clone();
        child.material = child.material.clone();
        child.material.color.copy(base);
        index++;
      }
    });
  }, [object]);
}
