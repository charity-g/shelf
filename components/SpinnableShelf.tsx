import React, { useState } from "react";
import {
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { ShelfItem } from "../types/ShelfItem";

// Get device width for carousel sizing
const { width } = Dimensions.get("window");

const SpinnableShelf = ({ data }: { data: ShelfItem[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!data || data.length === 0) {
    return <Text style={styles.emptyText}>No items to display</Text>;
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const renderItem = ({ item }: { item: ShelfItem }) => (
    <View style={[styles.itemContainer, { width: width - 80 }]}>
      <Text style={styles.category}>{item.category}</Text>
      <Text style={styles.brand}>{item.brand}</Text>
      <Text style={styles.ingredients}>
        Ingredients: {item.ingredients.join(", ")}
      </Text>
    </View>
  );

  return (
    <View style={styles.carouselContainer}>
      {currentIndex > 0 && (
        <TouchableOpacity style={styles.arrowLeft} onPress={handlePrev}>
          <Text style={styles.arrowText}>◀</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={[data[currentIndex]]} // Show only the current item
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        scrollEnabled={false} // Disable manual scrolling
        showsHorizontalScrollIndicator={false}
      />

      {currentIndex < data.length - 1 && (
        <TouchableOpacity style={styles.arrowRight} onPress={handleNext}>
          <Text style={styles.arrowText}>▶</Text>
        </TouchableOpacity>
      )}
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
    backgroundColor: "#f0f0f0",
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
