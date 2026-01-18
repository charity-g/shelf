import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, typography } from "../../styles/shared";
import { Setting } from "../../types"; // or keep inline

interface Props {
  setting: Setting;
  onPress: () => void;
}

export function SettingRow({ setting, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <View
        style={[
          styles.dot,
          setting.type === "toggle" && styles.dotToggle,
          setting.type === "link" && styles.dotLink,
        ]}
      />

      <Text style={styles.label}>{setting.label}</Text>

      {setting.type === "info" && setting.value && (
        <Text style={styles.value}>{String(setting.value)}</Text>
      )}

      {setting.type === "toggle" && (
        <Text style={styles.toggle}>{setting.value ? "On" : "Off"}</Text>
      )}

      {setting.type === "link" && <Text style={styles.arrow}>›</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.lavender,
  },
  dotToggle: {
    backgroundColor: colors.mint,
  },
  dotLink: {
    backgroundColor: colors.accentSoft,
  },
  label: {
    flex: 1,
    ...typography.body,
  },
  value: {
    ...typography.body,
    color: colors.muted,
  },
  toggle: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.accent,
  },
  arrow: {
    fontSize: 18,
    color: colors.muted,
  },
});
