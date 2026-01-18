import { Canvas } from "@react-three/fiber/native";
import React, { Suspense, useRef } from "react";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { UserProduct } from "../types/UserProduct";
import { JSONModel } from "./JSONObject";

// Get device width for carousel sizing
const { width } = Dimensions.get("window");

const SpinnableShelfItem = ({ item }: { item: UserProduct }) => {
  return (
    <View style={[styles.itemContainer, { width: width - 120 }]}>
      <Text style={styles.category}>{item.CATEGORY}</Text>
      <Text style={styles.brand}>{item.NAME}</Text>
      <Text style={styles.ingredients}>
        Ingredients: {item.INGREDIENTS?.join(", ")}
      </Text>

      <View style={{ height: 200 }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Suspense fallback={null}>
            <JSONModel category={item.CATEGORY} spinnable={true} />
          </Suspense>
        </Canvas>
      </View>
    </View>
  );
};

const SpinnableShelf = ({
  data,
  currItemIndex,
  setCurrItemIndex,
}: {
  data: UserProduct[];
  currItemIndex: number;
  setCurrItemIndex: (index: number) => void;
}) => {
  if (!data || data.length === 0) {
    return <Text style={styles.emptyText}>No items to display</Text>;
  }

  const listRef = useRef<FlatList<UserProduct>>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems?.length) {
      const idx = viewableItems[0].index ?? 0;
      setCurrItemIndex(idx);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  return (
    <View>
      <FlatList
        data={data}
        renderItem={({ item }) => <SpinnableShelfItem item={item} />}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: width - 120,
          offset: (width - 120) * index,
          index,
        })}
        contentContainerStyle={styles.carouselContainer}
      />
      <View style={styles.dotsContainer}>
        {data.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === currItemIndex && styles.dotActive]}
          />
        ))}
      </View>
    </View>
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
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: "#333",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default SpinnableShelf;
