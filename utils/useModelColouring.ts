import { useEffect } from "react";
import { Color, Object3D } from "three";
import { colors } from "../styles/shared";

const palette = [
  colors.accentSoft,
  colors.accent,
  colors.lavender,
  colors.mint,
].map((c) => new Color(c));

export function useModelColoring(object: Object3D | null, highlight = false) {
  useEffect(() => {
    if (!object) return;

    let index = 0;

    object.traverse((child: any) => {
      if (child.isMesh && child.material) {
        if (highlight) {
          const highlightColor = new Color(0xffff00); // Yellow for highlight
          child.material = child.material.clone();
          child.material.color.copy(highlightColor);
        } else {
          const base = palette[index % palette.length].clone();
          child.material = child.material.clone();
          child.material.color.copy(base);
        }
        index++;
      }
    });
  }, [object]);
}
