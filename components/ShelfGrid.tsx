import React, { Suspense } from "react";
import { Image, StyleSheet, View } from "react-native";

import { Canvas } from "@react-three/fiber/native";
import GLBModel from "./GLBModel";

interface ShelfGridProps {
  rows: number;
  columns: number;
  items: string[]; // URIs of images to display
  slotSize?: number; // width/height of each slot
  spacing?: number; // space between slots
}

const ShelfGrid = ({
  rows,
  columns,
  items,
  slotSize = 80,
  spacing = 10,
}: ShelfGridProps) => {
  return (
    <View style={{ flex: 1 }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <GLBModel spinnable={true} />
        </Suspense>
      </Canvas>
    </View>
  );
};

const ShelfGrid1 = ({
  rows,
  columns,
  items,
  slotSize = 80,
  spacing = 10,
}: ShelfGridProps) => {
  const totalSlots = rows * columns;

  // Fill empty slots with null
  const displayItems = [...items];
  while (displayItems.length < totalSlots) {
    displayItems.push(null);
  }

  return (
    <View style={[styles.gridContainer, { gap: spacing }]}>
      {displayItems.map((item, index) => (
        <View
          key={index}
          style={[
            styles.slot,
            {
              width: slotSize,
              height: slotSize,
              borderColor: "#aaa",
              borderWidth: 1,
              backgroundColor: item ? "transparent" : "#f0f0f0",
            },
          ]}
        >
          {item && (
            <Image
              source={{ uri: item }}
              style={{ width: "100%", height: "100%", resizeMode: "contain" }}
            />
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  slot: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ShelfGrid;
