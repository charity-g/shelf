import { BlurView } from "expo-blur";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, typography } from "../styles/shared";

type AddProductModalProps = {
  visible: boolean;
  onClose: () => void;
  onAdd?: () => void;
};

export function AddProductModal({
  visible,
  onClose,
  onAdd,
}: AddProductModalProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalRoot}>
        <BlurView style={StyleSheet.absoluteFill} intensity={25} tint="dark" />
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.popup}>
          <View style={styles.popupHandle} />
          <Text style={styles.popupTitle}>Add a Product</Text>
          <Text style={styles.popupBody}>Product Name</Text>
          <Pressable style={styles.primaryButton} onPress={onAdd}>
            <Text style={styles.primaryButtonText}>Add Me</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  popup: {
    height: "70%",
    width: "100%",
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    gap: 14,
    shadowColor: colors.text,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 8,
  },
  popupHandle: {
    width: 48,
    height: 5,
    borderRadius: 3,
    alignSelf: "center",
    backgroundColor: colors.line,
  },
  popupTitle: {
    ...typography.titleCaps,
    fontSize: 16,
    textAlign: "center",
  },
  popupBody: {
    ...typography.body,
    textAlign: "center",
  },
  primaryButton: {
    marginTop: 6,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: colors.text,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
