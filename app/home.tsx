import { LinearGradient } from "expo-linear-gradient";
import { Href, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Shelf } from "@/components/Shelf";
import SpinnableShelf from "@/components/SpinnableShelf";
import { AddProductModal } from "../components/AddProductModal";
import { Screen } from "../components/Screen";
import { colors, typography } from "../styles/shared";

import { UserProduct } from "@/types/UserProduct";
import { fetchUserProducts } from "../api/userProducts";
import { getUidFromAsyncStorage } from "../services/auth";

export default function Home() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [items, setItems] = useState<UserProduct[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadItems = async () => {
      const userId = await getUidFromAsyncStorage();
      if (!userId) {
        router.replace("/");
      }
      const products = await fetchUserProducts();
      setItems(products);
    };
    loadItems();
  }, []);

  const addItem = (item: {}) => {
    setItems((prev) => [...prev]); //TODO: call backend to add item or something
  };

  return (
    <Screen>
      <Shelf data={items}></Shelf>
      <SpinnableShelf data={items} />
      <AddProductModal
        visible={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={(item) => {
          addItem(item); //TODO add item info
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
            <LinearGradient
              colors={[colors.accentSoft, colors.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.compareGradient}
            >
              <Text style={styles.compareText}>Compare</Text>
            </LinearGradient>
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
    paddingVertical: 0,
    paddingHorizontal: 0,
    alignSelf: "center",
    minWidth: 160,
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },
  compareGradient: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 18,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
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
