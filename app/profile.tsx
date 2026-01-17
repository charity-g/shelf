import { StyleSheet, Text, View } from "react-native";

import { Screen } from "../components/Screen";
import { colors, typography } from "../styles/shared";

export default function Profile() {
  return (
    <Screen>
      <View style={styles.headerCard}>
        <View style={styles.avatar} />
        <View style={styles.nameBlock}>
          <Text style={styles.nameLine} />
          <Text style={styles.nameLineSmall} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingRow}>
          <View style={styles.settingDot} />
          <View style={styles.settingLine} />
        </View>
        <View style={styles.settingRow}>
          <View style={styles.settingDot} />
          <View style={styles.settingLine} />
        </View>
        <View style={styles.settingRow}>
          <View style={styles.settingDot} />
          <View style={styles.settingLine} />
        </View>
        <View style={styles.settingRow}>
          <View style={styles.settingDot} />
          <View style={styles.settingLine} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.subtle,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surface,
  },
  nameBlock: {
    flex: 1,
    gap: 6,
  },
  nameLine: {
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.surface,
  },
  nameLineSmall: {
    height: 8,
    width: "70%",
    borderRadius: 6,
    backgroundColor: colors.surface,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    ...typography.sectionTitle,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.subtle,
  },
  settingLine: {
    flex: 1,
    height: 10,
    borderRadius: 6,
    backgroundColor: colors.subtle,
  },
});