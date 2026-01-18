import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, typography } from "../styles/shared";
import { Product, ProductsByCategory } from "../types/UserProduct";

interface ProductStatisticsProps {
  productsByCategory: ProductsByCategory;
}

interface CategoryStats {
  category: string;
  totalProducts: number;
  uniqueProducts: number;
  duplicates: number;
  duplicateNames: string[];
}

function calculateCategoryStats(
  category: string,
  products: Product[],
): CategoryStats {
  // Count products by name
  const productCounts = products.reduce(
    (acc, product) => {
      const key = `${product.name.toLowerCase()}-${product.brand.toLowerCase()}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Find duplicates
  const duplicateNames = Object.entries(productCounts)
    .filter(([_, count]) => count > 1)
    .map(([key, count]) => {
      const product = products.find(
        (p) => `${p.name.toLowerCase()}-${p.brand.toLowerCase()}` === key,
      );
      return `${product?.name} (${count}×)`;
    });

  const uniqueProducts = Object.keys(productCounts).length;
  const duplicates = products.length - uniqueProducts;

  return {
    category,
    totalProducts: products.length,
    uniqueProducts,
    duplicates,
    duplicateNames,
  };
}

export default function ProductStatistics({
  productsByCategory,
}: ProductStatisticsProps) {
  const categories = Object.keys(productsByCategory).sort();

  if (categories.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No products to analyze</Text>
      </View>
    );
  }

  const totalStats = categories.reduce(
    (acc, category) => {
      const stats = calculateCategoryStats(
        category,
        productsByCategory[category],
      );
      acc.total += stats.totalProducts;
      acc.unique += stats.uniqueProducts;
      acc.duplicates += stats.duplicates;
      return acc;
    },
    { total: 0, unique: 0, duplicates: 0 },
  );

  return (
    <View style={styles.container}>
      {/* Overall Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Overall Statistics</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Products:</Text>
          <Text style={styles.summaryValue}>{totalStats.total}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Unique Products:</Text>
          <Text style={styles.summaryValue}>{totalStats.unique}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Duplicates:</Text>
          <Text style={[styles.summaryValue, styles.duplicateHighlight]}>
            {totalStats.duplicates}
          </Text>
        </View>
      </View>

      {/* Category Breakdown */}
      <Text style={styles.sectionTitle}>By Category</Text>
      {categories.map((category) => {
        const stats = calculateCategoryStats(
          category,
          productsByCategory[category],
        );

        return (
          <View key={category} style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryName}>{category}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryCount}>{stats.totalProducts}</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Unique</Text>
                <Text style={styles.statValue}>{stats.uniqueProducts}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Duplicates</Text>
                <Text
                  style={[
                    styles.statValue,
                    stats.duplicates > 0 && styles.duplicateHighlight,
                  ]}
                >
                  {stats.duplicates}
                </Text>
              </View>
            </View>

            {stats.duplicateNames.length > 0 && (
              <View style={styles.duplicateList}>
                <Text style={styles.duplicateListTitle}>Duplicate items:</Text>
                {stats.duplicateNames.map((name, idx) => (
                  <Text key={idx} style={styles.duplicateItem}>
                    • {name}
                  </Text>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    ...typography.body,
    color: colors.muted,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    ...typography.body,
    color: colors.muted,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    marginTop: 8,
  },
  categoryCard: {
    borderRadius: 12,
    padding: 14,
    backgroundColor: colors.subtle,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 10,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  categoryBadge: {
    backgroundColor: colors.lavender,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryCount: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.line,
  },
  statLabel: {
    fontSize: 12,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  duplicateHighlight: {
    color: colors.accent,
  },
  duplicateList: {
    marginTop: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    gap: 4,
  },
  duplicateListTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.muted,
    marginBottom: 4,
  },
  duplicateItem: {
    fontSize: 13,
    color: colors.text,
    paddingLeft: 8,
  },
});
