import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { fetchUserProducts } from "../api/userProducts";
import { Screen } from "../components/Screen";
import { colors, typography } from "../styles/shared";
import { UserProduct } from "../types/UserProduct";

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

// TODO: Replace with actual user ID from auth context
const CURRENT_USER_ID = "user_001";

// Transform backend UserProduct to frontend Product format
function transformUserProduct(userProduct: UserProduct): Product {
  return {
    id: userProduct.PRODUCT_ID,
    name: userProduct.NAME || userProduct.PRODUCT_DESC || "Unknown Product",
    brand: userProduct.PRODUCT_DESC || "",
    category: userProduct.CATEGORY || "Uncategorized",
  };
}

async function fetchProducts(): Promise<Product[]> {
  try {
    const userProducts = await fetchUserProducts({ user_id: CURRENT_USER_ID });
    return userProducts.map(transformUserProduct);
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
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
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
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
