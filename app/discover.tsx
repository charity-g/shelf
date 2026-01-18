import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { fetchUserProductGeneralSearch } from "../api/userProducts";
import { Screen } from "../components/Screen";
import { colors, typography } from "../styles/shared";
import { Product } from "../types/UserProduct";

const defaultProducts: Product[] = [
  {
    brand: "",
    category: "cleanser",
    id: "1768760660159-g6oxw73",
    name: "SENKA Perfect Whip",
  },
  {
    brand:
      "Aqua, Stearic Acid, PEG-8, Myristic Acid, Potassium Hydroxide, Glycerin, Lauric Acid, Butylene Glycol, Glyceryl Stearate (SE), Polyquaternium-7, Sodium Hyaluronate, Sericin, Sodium Acetylated Hyaluronate, Hydrolyzed Silk, Disodium EDTA, Sodium Metabisulfite, Citric Acid, Sodium Benzoate, Fragrance, Ethanol",
    category: "cleanser",
    id: "1768761364442-qv5kzh3",
    name: "SHISEIDO Perfect Whip Facial Wash",
  },
];

export default function Discover() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [searchProducts, setSearchProducts] =
    useState<Product[]>(defaultProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const results = await fetchUserProductGeneralSearch(query);
        setSearchProducts(results);
        console.log("Fetched products:", results);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.headerText}>Discover New Products</Text>
      </View>

      <View style={styles.searchBlock}>
        <View style={[styles.searchBar, isFocused && styles.searchBarFocused]}>
          <TextInput
            placeholder="skincare (e.g. toner)"
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={setQuery}
            onFocus={() => setIsFocused(true)}
            style={[styles.searchInput, isFocused && styles.searchInputFocused]}
          />
        </View>
        <Pressable
          style={styles.searchButton}
          onPress={() => {
            console.log("Search query:", query);
            setIsFocused(false);
          }}
        >
          <Text style={styles.searchButtonText}>search</Text>
        </Pressable>
      </View>

      <View style={styles.filterRow}>
        <View style={styles.filterChip}>
          <Text style={styles.filterText}>oily</Text>
        </View>
        <View style={styles.filterChip}>
          <Text style={styles.filterText}>dry</Text>
        </View>
        <View style={styles.filterChip}>
          <Text style={styles.filterText}>acne</Text>
        </View>
      </View>

      <View style={styles.results}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.accent} />
            <Text style={styles.loadingText}>Loading recommendations...</Text>
          </View>
        ) : searchProducts.length > 0 ? (
          searchProducts.map((product) => (
            <View key={product.id} style={styles.resultCard}>
              <Text style={styles.resultTitle}>{product.name}</Text>
              <Text style={styles.resultBrand}>{product.brand}</Text>
              <Text style={styles.resultCategory}>{product.category}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No products available</Text>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
  },
  headerText: {
    ...typography.titleCaps,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: colors.accentSoft,
  },
  searchBlock: {
    gap: 10,
  },
  searchBar: {
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.subtle,
    borderWidth: 1,
    borderColor: colors.line,
  },
  searchBarFocused: {
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  searchInput: {
    fontSize: 12,
    color: colors.text,
  },
  searchInputFocused: {
    color: colors.accent,
  },
  searchButton: {
    alignSelf: "flex-end",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: colors.accent,
  },
  searchButtonText: {
    fontSize: 12,
    color: colors.surface,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  filterRow: {
    flexDirection: "row",
    gap: 10,
  },
  filterChip: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.lavender,
  },
  filterText: {
    fontSize: 12,
    color: colors.text,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  results: {
    gap: 12,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 16,
  },
  loadingText: {
    fontSize: 12,
    color: colors.muted,
  },
  resultCard: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: colors.subtle,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 4,
  },
  resultTitle: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "600",
  },
  resultBrand: {
    fontSize: 12,
    color: colors.muted,
  },
  resultCategory: {
    fontSize: 11,
    color: colors.accent,
    textTransform: "uppercase",
    fontWeight: "600",
    marginTop: 4,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 14,
    color: colors.muted,
    paddingVertical: 16,
  },
});
