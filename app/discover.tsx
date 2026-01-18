import { StyleSheet, Text, View } from "react-native";

import { Screen } from "../components/Screen";
import { colors, typography } from "../styles/shared";

export default function Discover() {
  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.headerText}>Discover New Products</Text>
      </View>

      <View style={styles.searchBlock}>
        <View style={styles.searchBar}>
          <Text style={styles.searchPlaceholder}>skincare (e.g. toner)</Text>
        </View>
        <View style={styles.searchButton}>
          <Text style={styles.searchButtonText}>search</Text>
        </View>
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
        <View style={styles.resultCard}>
          <Text style={styles.resultText}>Product 1</Text>
        </View>
        <View style={styles.resultCard}>
          <Text style={styles.resultText}>Product 2</Text>
        </View>
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
  searchPlaceholder: {
    fontSize: 12,
    color: colors.muted,
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
  resultCard: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: colors.subtle,
    borderWidth: 1,
    borderColor: colors.line,
  },
  resultText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "600",
  },
});
