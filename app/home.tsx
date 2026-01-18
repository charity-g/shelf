import { Href, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import SpinnableShelf from "@/components/SpinnableShelf";
import { AddProductModal } from "../components/AddProductModal";
import { Screen } from "../components/Screen";
import { colors, typography } from "../styles/shared";
import { ShelfItem } from "../types/ShelfItem";

export const carouselData: ShelfItem[] = [
  {
    category: "Cleanser",
    ingredients: ["Water", "Glycerin", "Cocamidopropyl Betaine"],
    brand: "Fresh Glow",
  },
  {
    category: "Toner",
    ingredients: ["Witch Hazel", "Aloe Vera", "Rose Water"],
    brand: "Pure Essence",
  },
  {
    category: "Exfoliant",
    ingredients: ["Salicylic Acid", "Lactic Acid", "Jojoba Beads"],
    brand: "SmoothSkin",
  },
  {
    category: "Serum",
    ingredients: ["Hyaluronic Acid", "Vitamin C", "Niacinamide"],
    brand: "Radiance Labs",
  },
  {
    category: "Moisturizer",
    ingredients: ["Shea Butter", "Squalane", "Ceramides"],
    brand: "HydraSoft",
  },
  {
    category: "Sunscreen",
    ingredients: ["Zinc Oxide", "Titanium Dioxide", "Aloe Vera"],
    brand: "SunShield",
  },
  {
    category: "Face Masks",
    ingredients: ["Charcoal", "Kaolin Clay", "Green Tea Extract"],
    brand: "GlowMask",
  },
];

export default function Home() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [items, setItems] = useState<ShelfItem[]>(carouselData);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        category: "cleanser",
        ingredients: ["Ingredient 1", "Ingredient 2"],
        brand: "New Brand",
      },
    ]);
    //TODO: call backend to add item or something
  };
  const router = useRouter();

  return (
    <Screen>
      <SpinnableShelf data={[]} />
      {/* <ShelfGrid
        rows={2}
        columns={4}
        items={items}
        slotSize={80}
        spacing={10}
      /> */}
      <AddProductModal
        visible={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={() => {
          addItem(); //TODO add item info
        }}
      />
      <View style={styles.container}>
        {/* Empty shelf placeholder */}
        <View style={styles.shelfPlaceholder} />

        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={styles.compareButton}
            activeOpacity={0.8}
            onPress={() => {
              router.push("/compare" as Href);
            }}
          >
            <Text style={styles.compareText}>Compare</Text>
          </TouchableOpacity>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.8}
              onPress={() => {
                setIsAddOpen(true);
              }}
            >
              <Text style={styles.actionText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.8}
              onPress={() => {
                router.push("/discover" as Href);
              }}
            >
              <Text style={styles.actionText}>Recommend</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  shelfPlaceholder: {
    flex: 1,
  },
  bottomButtons: {
    gap: 12,
    paddingBottom: 16,
  },
  compareButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignSelf: "center",
    minWidth: 160,
    justifyContent: "center",
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.line,
    shadowColor: colors.shadow,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  compareIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.accent,
  },
  compareText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    shadowColor: colors.shadow,
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  actionText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "600",
  },
  actionSubText: {
    marginTop: 4,
    fontSize: 10,
    color: colors.muted,
  },
});
