import Statistics from "@/components/statistics";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  fetchProductDetails,
  fetchSimilarProducts,
  fetchUserProductsByUser,
} from "../api/userProducts";
import { Screen } from "../components/Screen";
import { getUidFromAsyncStorage } from "../services/auth";
import { colors, typography } from "../styles/shared";
import { Product, ProductDetails, SimilarProduct } from "../types/UserProduct";

export default function Compare() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(
    null,
  );
  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const router = useRouter();

  // Load user's products on mount
  useEffect(() => {
    async function loadProducts() {
      try {
        const uid = await getUidFromAsyncStorage();
        if (!uid) {
          router.replace("/");
        }
        setUserId(uid);
        const data = await fetchUserProductsByUser(uid as string);
        setProducts(data);
        setFilteredProducts(data);
      } finally {
        setLoadingProducts(false);
      }
    }

    loadProducts();
  }, []);

  // Filter products based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query),
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  // Load product details and similar products when a product is selected
  async function handleSelectProduct(product: Product) {
    setSelectedProduct(product);
    setLoadingDetails(true);
    setProductDetails(null);
    setSimilarProducts([]);

    try {
      const [details, similar] = await Promise.all([
        fetchProductDetails(userId, product.id),
        fetchSimilarProducts(userId, product.id),
      ]);
      setProductDetails(details);
      setSimilarProducts(similar);
    } finally {
      setLoadingDetails(false);
    }
  }

  function handleClearSelection() {
    setSelectedProduct(null);
    setProductDetails(null);
    setSimilarProducts([]);
    setSearchQuery("");
  }

  if (loadingProducts) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Loading your products...</Text>
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
        {/* Search Section */}
        {!selectedProduct && (
          <View style={styles.searchSection}>
            <Text style={styles.sectionLabel}>Search Your Products</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or brand..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            {/* Product List */}
            <View style={styles.productList}>
              {filteredProducts.length === 0 ? (
                <Text style={styles.emptyText}>No products found</Text>
              ) : (
                filteredProducts.map((product) => (
                  <TouchableOpacity
                    key={product.id}
                    style={styles.productRow}
                    onPress={() => handleSelectProduct(product)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.productIcon} />
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>{product.name}</Text>
                      <Text style={styles.productBrand}>{product.brand}</Text>
                    </View>
                    <View style={styles.arrow}>
                      <Text style={styles.arrowText}>→</Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </View>
        )}

        {selectedProduct && (
          <View style={styles.detailsSection}>
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleClearSelection}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonText}>← Back to search</Text>
            </TouchableOpacity>

            {/* Hero */}
            <View style={styles.hero}>
              <View style={styles.heroIcon} />
            </View>

            <Text style={styles.title}>{selectedProduct.name}</Text>
            <Text style={styles.brandText}>{selectedProduct.brand}</Text>

            {loadingDetails ? (
              <View style={styles.detailsLoading}>
                <ActivityIndicator size="small" color={colors.accent} />
                <Text style={styles.loadingText}>Loading details...</Text>
              </View>
            ) : (
              <>
                {/* Ingredients */}
                {productDetails && (
                  <View style={styles.ingredientsSection}>
                    <Text style={styles.sectionTitle}>
                      This product contains:
                    </Text>
                    <View style={styles.ingredients}>
                      {productDetails.ingredients.map((ingredient, index) => (
                        <View key={index} style={styles.ingredientRow}>
                          <View style={styles.ingredientBullet} />
                          <Text style={styles.ingredientText}>
                            {ingredient}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Similar Products */}
                <View style={styles.similarSection}>
                  <Text style={styles.sectionTitle}>
                    Your similar products:
                  </Text>
                  {similarProducts.length === 0 ? (
                    <Text style={styles.emptyText}>
                      No similar products found in your collection
                    </Text>
                  ) : (
                    <View style={styles.similarList}>
                      {similarProducts.map((similar) => (
                        <View key={similar.id} style={styles.similarCard}>
                          <View style={styles.similarHeader}>
                            <View style={styles.similarIcon} />
                            <View style={styles.similarInfo}>
                              <Text style={styles.similarName}>
                                {similar.name}
                              </Text>
                              <Text style={styles.similarBrand}>
                                {similar.brand}
                              </Text>
                            </View>
                            <View style={styles.matchBadge}>
                              <Text style={styles.matchText}>
                                {similar.matchPercentage}%
                              </Text>
                            </View>
                          </View>
                          <View style={styles.sharedIngredients}>
                            <Text style={styles.sharedLabel}>
                              Shared ingredients:
                            </Text>
                            <Text style={styles.sharedList}>
                              {similar.sharedIngredients.join(", ")}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </>
            )}
          </View>
        )}

        <Statistics />
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
  searchSection: {
    gap: 12,
  },
  sectionLabel: {
    ...typography.sectionTitle,
  },
  searchInput: {
    backgroundColor: colors.subtle,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.line,
  },
  productList: {
    gap: 8,
  },
  emptyText: {
    ...typography.body,
    color: colors.muted,
    textAlign: "center",
    paddingVertical: 20,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.subtle,
    borderRadius: 12,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  productIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.lavender,
  },
  productInfo: {
    flex: 1,
    gap: 2,
  },
  productName: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },
  productBrand: {
    fontSize: 11,
    color: colors.muted,
  },
  arrow: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowText: {
    fontSize: 16,
    color: colors.accent,
    fontWeight: "600",
  },
  detailsSection: {
    gap: 12,
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: "600",
  },
  hero: {
    height: 110,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: colors.lavender,
    borderWidth: 1,
    borderColor: colors.line,
  },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.accent,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
  },
  brandText: {
    fontSize: 12,
    color: colors.muted,
    textAlign: "center",
    marginTop: -8,
  },
  detailsLoading: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 20,
  },
  ingredientsSection: {
    gap: 10,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    marginTop: 4,
  },
  ingredients: {
    gap: 8,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  ingredientBullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accentSoft,
  },
  ingredientText: {
    fontSize: 13,
    color: colors.text,
  },
  similarSection: {
    gap: 10,
    marginTop: 4,
  },
  similarList: {
    gap: 12,
  },
  similarCard: {
    borderRadius: 14,
    padding: 12,
    gap: 10,
    backgroundColor: colors.subtle,
    borderWidth: 1,
    borderColor: colors.line,
  },
  similarHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  similarIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.mint,
  },
  similarInfo: {
    flex: 1,
    gap: 2,
  },
  similarName: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },
  similarBrand: {
    fontSize: 11,
    color: colors.muted,
  },
  matchBadge: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  matchText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  sharedIngredients: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 10,
    gap: 4,
  },
  sharedLabel: {
    fontSize: 10,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sharedList: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 18,
  },
});
