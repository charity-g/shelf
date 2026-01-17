import { StyleSheet, Text, View } from "react-native";

import { Screen } from "../components/Screen";
import { colors, typography } from "../styles/shared";

export default function Products() {
  return (
    <Screen>
      <Text style={styles.title}>My Products</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lotions</Text>
        <View style={styles.list}>
          <View style={styles.listRow}>
            <View style={styles.listIcon} />
            <View style={styles.listLine} />
          </View>
          <View style={styles.listRow}>
            <View style={styles.listIcon} />
            <View style={styles.listLine} />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Toners</Text>
        <View style={styles.list}>
          <View style={styles.listRow}>
            <View style={styles.listIcon} />
            <View style={styles.listLine} />
          </View>
          <View style={styles.listRow}>
            <View style={styles.listIcon} />
            <View style={styles.listLine} />
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.titleCaps,
    fontSize: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.subtle,
    alignSelf: "flex-start",
  },
  section: {
    gap: 8,
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
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: colors.subtle,
  },
  listLine: {
    flex: 1,
    height: 10,
    borderRadius: 6,
    backgroundColor: colors.subtle,
  },
});