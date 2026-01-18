import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import { Screen } from "../components/Screen";
import { colors, typography } from "../styles/shared";

// Product type definition
interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
}

interface ProductsByCategory {
  [category: string]: Product[];
}

// Categories to display
const CATEGORIES = [
  "Cleanser",
  "Toner",
  "Exfoliant",
  "Serum",
  "Moisturizer",
  "Sunscreen",
  "Face Masks",
];

// Placeholder API endpoint
const API_ENDPOINT = "https://api.example.com/products";

// Mock API fetch function
async function fetchProducts(): Promise<Product[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Hardcoded skincare products (pretending this comes from API)
  const mockProducts: Product[] = [
    // Cleansers
    { id: "1", name: "Gentle Foaming Cleanser", brand: "CeraVe", category: "Cleanser" },
    { id: "2", name: "Soy Face Cleanser", brand: "Fresh", category: "Cleanser" },
    { id: "3", name: "Low pH Good Morning Gel Cleanser", brand: "COSRX", category: "Cleanser" },

    // Toners
    { id: "4", name: "Facial Treatment Essence", brand: "SK-II", category: "Toner" },
    { id: "5", name: "Glow Recipe Watermelon Toner", brand: "Glow Recipe", category: "Toner" },
    { id: "6", name: "Klairs Supple Preparation Toner", brand: "Klairs", category: "Toner" },

    // Exfoliants
    { id: "7", name: "BHA Blackhead Power Liquid", brand: "COSRX", category: "Exfoliant" },
    { id: "8", name: "Glycolic Acid 7% Toning Solution", brand: "The Ordinary", category: "Exfoliant" },
    { id: "9", name: "Paula's Choice 2% BHA Exfoliant", brand: "Paula's Choice", category: "Exfoliant" },

    // Serums
    { id: "10", name: "Hyaluronic Acid 2% + B5", brand: "The Ordinary", category: "Serum" },
    { id: "11", name: "Niacinamide 10% + Zinc 1%", brand: "The Ordinary", category: "Serum" },
    { id: "12", name: "C E Ferulic", brand: "SkinCeuticals", category: "Serum" },
    { id: "13", name: "Advanced Snail 96 Mucin Power Essence", brand: "COSRX", category: "Serum" },

    // Moisturizers
    { id: "14", name: "Moisturizing Cream", brand: "CeraVe", category: "Moisturizer" },
    { id: "15", name: "Water Cream", brand: "Tatcha", category: "Moisturizer" },
    { id: "16", name: "Laneige Water Bank Moisture Cream", brand: "Laneige", category: "Moisturizer" },

    // Sunscreens
    { id: "17", name: "UV Aqua Rich Watery Essence", brand: "Biore", category: "Sunscreen" },
    { id: "18", name: "Unseen Sunscreen SPF 40", brand: "Supergoop!", category: "Sunscreen" },
    { id: "19", name: "Beauty of Joseon Relief Sun", brand: "Beauty of Joseon", category: "Sunscreen" },

    // Face Masks
    { id: "20", name: "Hydrating Mask", brand: "Dr. Jart+", category: "Face Masks" },
    { id: "21", name: "Watermelon Glow Sleeping Mask", brand: "Glow Recipe", category: "Face Masks" },
    { id: "22", name: "Honey Overnight Mask", brand: "Farmacy", category: "Face Masks" },
  ];

  // In real implementation, this would be:
  // const response = await fetch(API_ENDPOINT);
  // const data = await response.json();
  // return data.products;

  return mockProducts;
}

// Group products by category
function groupByCategory(products: Product[]): ProductsByCategory {
  return products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as ProductsByCategory);
}

export default function Products() {
  const [products, setProducts] = useState<ProductsByCategory>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(groupByCategory(data));
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {CATEGORIES.map((category) => (
          <View key={category} style={styles.section}>
            <Text style={styles.sectionTitle}>{category}</Text>
            <View style={styles.list}>
              {products[category]?.map((product) => (
                <View key={product.id} style={styles.listRow}>
                  <View style={styles.listIcon} />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productBrand}>{product.brand}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    ...typography.body,
    color: colors.muted,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    ...typography.body,
    color: colors.accent,
  },
  section: {
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    ...typography.sectionTitle,
  },
  list: {
    gap: 10,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  listIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.lavender,
  },
  productInfo: {
    flex: 1,
    gap: 2,
  },
  productName: {
    ...typography.body,
    fontWeight: "500",
  },
  productBrand: {
    fontSize: 11,
    color: colors.muted,
  },
});
