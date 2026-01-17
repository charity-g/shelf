import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import Button from "@/components/Button";
import ImageViewer from "@/components/ImageViewer";

const PlaceholderImage = require("@/assets/images/react-logo.png");

import { fetchCategories } from "@/src/api/snowflake";
import * as ImagePicker from 'expo-image-picker';

type Category = {
  name?: string;
  description?: string;
  [key: string]: any;
};

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert('You did not select any image.');
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError(null);
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        setCategoriesError(error instanceof Error ? error.message : 'Failed to load categories');
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <ImageViewer imgSource={selectedImage ? { uri: selectedImage } : PlaceholderImage} />
        </View>
        <View style={styles.footerContainer}>
          <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
          <Button label="Use this photo" onPress={() => alert('Photo selected!')} />
        </View>

        {/* Categories Section */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Skincare Categories</Text>
          {categoriesLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#ffd33d" />
              <Text style={styles.loadingText}>Loading categories...</Text>
            </View>
          )}
          {categoriesError && (
            <Text style={styles.errorText}>Error: {categoriesError}</Text>
          )}
          {!categoriesLoading && !categoriesError && categories.length === 0 && (
            <Text style={styles.emptyText}>No categories found</Text>
          )}
          {!categoriesLoading && !categoriesError && categories.map((category, index) => (
            <View key={index} style={styles.categoryItem}>
              {category.name && (
                <Text style={styles.categoryName}>{category.name}</Text>
              )}
              {category.description && (
                <Text style={styles.categoryDescription}>{category.description}</Text>
              )}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#25292e",
  },
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    paddingBottom: 20,
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
    marginTop: 20,
  },
  categoriesSection: {
    width: "100%",
    padding: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    color: "#fff",
    marginLeft: 10,
  },
  errorText: {
    color: "#ff6b6b",
    textAlign: "center",
    padding: 20,
  },
  emptyText: {
    color: "#999",
    textAlign: "center",
    padding: 20,
  },
  categoryItem: {
    backgroundColor: "#2d3339",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  categoryName: {
    color: "#ffd33d",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  categoryDescription: {
    color: "#ccc",
    fontSize: 14,
  },
});
