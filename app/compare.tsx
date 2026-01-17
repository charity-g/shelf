import { StyleSheet, Text, View } from "react-native";

import { Screen } from "../components/Screen";
import { colors, typography } from "../styles/shared";

export default function Compare() {
  return (
    <Screen>
      <View style={styles.hero}>
        <View style={styles.heroIcon} />
      </View>

      <Text style={styles.title}>CeraVe Gentle Cleanser</Text>
      <Text style={styles.subtitle}>This product contains:</Text>

      <View style={styles.ingredients}>
        <View style={styles.ingredientRow}>
          <View style={styles.ingredientBullet} />
          <View style={styles.ingredientLine} />
        </View>
        <View style={styles.ingredientRow}>
          <View style={styles.ingredientBullet} />
          <View style={styles.ingredientLine} />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Your similar products:</Text>
      <View style={styles.similarList}>
        <View style={styles.similarCard}>
          <View style={styles.similarLine} />
          <View style={styles.similarLineShort} />
        </View>
        <View style={styles.similarCard}>
          <View style={styles.similarLine} />
          <View style={styles.similarLineShort} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 110,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: colors.subtle,
  },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    color: colors.muted,
  },
  ingredients: {
    gap: 10,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  ingredientBullet: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.subtle,
  },
  ingredientLine: {
    flex: 1,
    height: 10,
    borderRadius: 6,
    backgroundColor: colors.subtle,
  },
  sectionTitle: {
    marginTop: 6,
    ...typography.sectionTitle,
    color: colors.muted,
  },
  similarList: {
    gap: 12,
  },
  similarCard: {
    borderRadius: 10,
    padding: 12,
    gap: 8,
    backgroundColor: colors.subtle,
  },
  similarLine: {
    height: 10,
    borderRadius: 6,
    backgroundColor: colors.surface,
  },
  similarLineShort: {
    width: "60%",
    height: 10,
    borderRadius: 6,
    backgroundColor: colors.surface,
  },
});
