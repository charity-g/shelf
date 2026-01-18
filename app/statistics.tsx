import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { fetchUserProducts, groupByCategory } from "../api/userProducts";
import ProductStatistics from "../components/ProductStatistics";
import { Screen } from "../components/Screen";
import { colors, typography } from "../styles/shared";
import { ProductsByCategory, UserProduct } from "../types/UserProduct";

function transformUserProduct(userProduct: UserProduct) {
  return {
    id: userProduct.PRODUCT_ID,
    name: userProduct.NAME || userProduct.PRODUCT_DESC || "Unknown Product",
    brand: userProduct.PRODUCT_DESC || "",
    category: userProduct.CATEGORY || "Uncategorized",
  };
}

export default function Statistics() {
  const [productsByCategory, setProductsByCategory] = useState<ProductsByCategory>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const userProducts = await fetchUserProducts();
        const products = userProducts.map(transformUserProduct);
        const grouped = groupByCategory(products);
        setProductsByCategory(grouped);
      } catch (err) {
        console.error("Failed to load products:", err);
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
          <Text style={styles.loadingText}>Loading statistics...</Text>
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Product Statistics</Text>
          <Text style={styles.headerSubtitle}>
            Analyze your collection and find duplicates
          </Text>
        </View>
        <ProductStatistics productsByCategory={productsByCategory} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  header: {
    marginBottom: 20,
    gap: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.muted,
  },
});
