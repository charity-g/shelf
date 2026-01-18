import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, typography } from "../../styles/shared";
import { BaseModal } from "./BaseModal";

interface ToggleModalProps {
  visible: boolean;
  label: string;
  value: boolean;
  onConfirm: (nextValue: boolean) => void;
  onClose: () => void;
}

export function ToggleModal({
  visible,
  label,
  value,
  onConfirm,
  onClose,
}: ToggleModalProps) {
  return (
    <BaseModal visible={visible} title={label} onClose={onClose}>
      <Text style={styles.description}>
        {value
          ? "This setting is currently enabled."
          : "This setting is currently disabled."}
      </Text>

      <View style={styles.actions}>
        <Pressable style={styles.cancel} onPress={onClose}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>

        <Pressable
          style={[styles.confirm, value && styles.confirmOff]}
          onPress={() => onConfirm(!value)}
        >
          <Text style={styles.confirmText}>Turn {value ? "Off" : "On"}</Text>
        </Pressable>
      </View>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  description: {
    ...typography.body,
    color: colors.muted,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },
  cancel: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelText: {
    ...typography.body,
    color: colors.muted,
  },
  confirm: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: colors.accent,
  },
  confirmOff: {
    backgroundColor: colors.error,
  },
  confirmText: {
    ...typography.body,
    color: colors.surface,
    fontWeight: "600",
  },
});
