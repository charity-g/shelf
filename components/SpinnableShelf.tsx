import { Canvas } from "@react-three/fiber/native";
import React, { Suspense } from "react";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import getModelConfig from "../types/modelConfig";
import { ShelfItem } from "../types/ShelfItem";
import { JSONModel } from "./JSONObject";

// Get device width for carousel sizing
const { width } = Dimensions.get("window");

const SpinnableShelfItemView = ({ category }: { category: string }) => {
  return (
    <View style={{ flex: 1 }}>
      <Canvas camera={{ position: getModelConfig(category).position, fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <JSONModel category={category} spinnable={true} />
        </Suspense>
      </Canvas>
    </View>
  );
};

const SpinnableShelf = ({ data }: { data: ShelfItem[] }) => {
  if (!data || data.length === 0) {
    return <Text style={styles.emptyText}>No items to display</Text>;
  }

  const renderItem = ({ item }: { item: ShelfItem }) => (
    <View style={[styles.itemContainer, { width: width - 120 }]}>
      <Text style={styles.category}>{item.category}</Text>
      <Text style={styles.brand}>{item.brand}</Text>
      <Text style={styles.ingredients}>
        Ingredients: {item.ingredients.join(", ")}
      </Text>

      <View style={{ height: 200 }}>
        <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Suspense fallback={null}>
            <JSONModel category={item.category} spinnable={true} />
          </Suspense>
        </Canvas>
      </View>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  itemContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 10,
  },
  category: {
    fontSize: 18,
    fontWeight: "bold",
  },
  brand: {
    fontSize: 16,
    marginTop: 5,
  },
  ingredients: {
    marginTop: 10,
    fontSize: 14,
  },
  arrowLeft: {
    position: "absolute",
    left: 10,
    zIndex: 1,
  },
  arrowRight: {
    position: "absolute",
    right: 10,
    zIndex: 1,
  },
  arrowText: {
    fontSize: 30,
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
    color: "#888",
  },
});

export default SpinnableShelf;
