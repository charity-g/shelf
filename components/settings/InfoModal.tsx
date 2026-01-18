import { Text } from "react-native";
import { colors, typography } from "../../styles/shared";
import { BaseModal } from "./BaseModal";

interface InfoModalProps {
  visible: boolean;
  label: string;
  value: string;
  onClose: () => void;
}

export function InfoModal({ visible, label, value, onClose }: InfoModalProps) {
  return (
    <BaseModal visible={visible} title={label} onClose={onClose}>
      <Text style={{ ...typography.body, color: colors.text }}>{value}</Text>
    </BaseModal>
  );
}
