import { Href, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import ShelfGrid from "@/components/ShelfGrid";
import { AddProductModal } from "../components/AddProductModal";
import { Screen } from "../components/Screen";
import { colors, typography } from "../styles/shared";

const sampleImages = [
  "https://via.placeholder.com/80x80.png?text=Item1",
  "https://via.placeholder.com/80x80.png?text=Item2",
];

export default function Home() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [items, setItems] = useState(sampleImages);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      `https://via.placeholder.com/80x80.png?text=Item${prev.length + 1}`,
    ]);
    //TODO: call backend to add item or something
  };
  const router = useRouter();

  return (
    <Screen>
      <ShelfGrid
        rows={2}
        columns={4}
        items={items}
        slotSize={80}
        spacing={10}
      />
      <AddProductModal
        visible={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={() => {
          addItem(); //TODO add item info
        }}
      />
      <View style={styles.header}>
        <Text style={styles.headerText}>Shelf</Text>
      </View>

      <View style={styles.shelf} />

      <TouchableOpacity
        style={styles.compareButton}
        activeOpacity={0.8}
        onPress={() => {
          router.push("/compare" as Href);
        }}
      >
        <View style={styles.compareIcon} />
        <Text style={styles.compareText}>compare</Text>
      </TouchableOpacity>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.8}
          onPress={() => {
            setIsAddOpen(true);
          }}
        >
          <Text style={styles.actionText}>add</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.8}
          onPress={() => {
            router.push("/discover" as Href);
          }}
        >
          <Text style={styles.actionText}>++</Text>
          <Text style={styles.actionSubText}>recommend</Text>
        </TouchableOpacity>
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
    borderRadius: 10,
    backgroundColor: colors.subtle,
  },
  shelf: {
    borderRadius: 18,
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: colors.subtle,
  },
  compareButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "center",
    minWidth: 160,
    justifyContent: "center",
    backgroundColor: colors.surface,
    shadowColor: colors.text,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  compareIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.subtle,
  },
  compareText: {
    fontSize: 14,
    color: colors.text,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    shadowColor: colors.text,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: 14,
    color: colors.text,
  },
  actionSubText: {
    marginTop: 4,
    fontSize: 10,
    color: colors.text,
  },
});
