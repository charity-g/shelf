import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, typography } from "../../styles/shared";

interface BaseModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function BaseModal({
  visible,
  title,
  onClose,
  children,
}: BaseModalProps) {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          {children}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  title: {
    ...typography.sectionTitle,
  },
});
