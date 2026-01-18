import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { OcrResponse, performOcr } from "../api/ocr";
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
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Ask for camera permissions on mount
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
      if (status !== "granted") {
        Alert.alert("Camera permission is required to take photos.");
      }
    })();
  }, []);

  const pickImage = async () => {
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      const photo = result.assets[0];
      setImage(photo.uri);
      await uploadImage(photo);
    }
  };

  const uploadImage = async (photo: ImagePicker.ImagePickerAsset) => {
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: photo.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      } as unknown as Blob);

      let data: OcrResponse;
      try {
        data = await performOcr(formData);
        if (data.error || !data.structuredData) {
          throw new Error(data.error || "Failed to extract data from image.");
        }
        setText(data.structuredData?.name || "No text detected");
      } catch (err) {
        console.error("Server error:", err);
        Alert.alert(
          "Server error",
          err instanceof Error ? err.message : "Unknown error",
        );
      }
    } catch (err) {
      console.error("Upload failed:", err);
      Alert.alert(
        "Error",
        err instanceof Error ? err.message : "Unknown error",
      );
    }
  };

  const handleClose = () => {
    setImage(null);
    setText("");
    onClose();
  };

  const isReady = !!image;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalRoot}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        <View style={styles.popup}>
          <View style={styles.popupHandle} />
          <Text style={styles.popupTitle}>Add a Product</Text>

          <Pressable style={styles.cameraButton} onPress={pickImage}>
            <Text style={styles.cameraButtonText}>📷 Take Photo</Text>
          </Pressable>

          {image && (
            <Image source={{ uri: image }} style={styles.previewImage} />
          )}

          {text ? <Text style={styles.popupBody}>{text}</Text> : null}

          <Pressable
            style={[
              styles.primaryButton,
              !isReady && styles.primaryButtonDisabled,
            ]}
            onPress={isReady ? onAdd : undefined}
            disabled={!isReady}
          >
            <Text
              style={[
                styles.primaryButtonText,
                !isReady && styles.primaryButtonTextDisabled,
              ]}
            >
              Put on Shelf
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "stretch",
  },
  popup: {
    height: "60%",
    width: "100%",
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
    gap: 14,
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
  cameraButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: colors.line,
  },
  cameraButtonText: {
    fontSize: 16,
    color: colors.text,
  },
  previewImage: {
    height: 150,
    width: 150,
    alignSelf: "center",
    borderRadius: 8,
  },
  primaryButton: {
    marginTop: "auto",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: colors.text,
  },
  primaryButtonDisabled: {
    backgroundColor: colors.line,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  primaryButtonTextDisabled: {
    color: colors.muted,
  },
});
