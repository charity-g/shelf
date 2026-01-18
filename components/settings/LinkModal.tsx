import { Pressable, Text } from "react-native";
import { colors, typography } from "../../styles/shared";
import { BaseModal } from "./BaseModal";

interface LinkModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
}

export function LinkModal({ visible, title, onClose }: LinkModalProps) {
  return (
    <BaseModal visible={visible} title={title} onClose={onClose}>
      <Pressable onPress={onClose}>
        <Text style={{ ...typography.body, color: colors.accent }}>
          Open {title}
        </Text>
      </Pressable>
    </BaseModal>
  );
}
