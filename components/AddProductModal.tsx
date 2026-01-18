import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { OcrResponse, performOcr } from "../api/ocr";
import { createUserProductText } from "../api/userProducts";
import { colors, typography } from "../styles/shared";
import { auth } from "../utils/firebase";

type AddProductModalProps = {
  visible: boolean;
  onClose: () => void;
  onAdd?: (response: any) => void;
};

type ProductData = OcrResponse["structuredData"];

export function AddProductModal({
  visible,
  onClose,
  onAdd,
}: AddProductModalProps) {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
    setIsLoading(true);
    try {
      console.log("Photo object:", JSON.stringify(photo, null, 2));
      console.log("Platform:", Platform.OS);

      const formData = new FormData();

      if (Platform.OS === "web") {
        // On web, we need to fetch the blob from the URI
        const response = await fetch(photo.uri);
        const blob = await response.blob();
        const fileName = photo.fileName || "photo.jpg";
        const file = new File([blob], fileName, {
          type: photo.mimeType || "image/jpeg",
        });
        formData.append("image", file);
        console.log("Web: Appended file blob, size:", blob.size);
      } else {
        // On native (iOS/Android), use the object format
        formData.append("image", {
          uri: photo.uri,
          name: photo.fileName || "photo.jpg",
          type: photo.mimeType || "image/jpeg",
        } as any);
        console.log("Native: Appended file object");
      }

      let data: OcrResponse;
      try {
        data = await performOcr(formData);
        if (data.error || !data.structuredData) {
          throw new Error(data.error || "Failed to extract data from image.");
        }
        setProductData(data.structuredData);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setImage(null);
    setText("");
    setProductData(null);
    setIsLoading(false);
    setIsSaving(false);
    onClose();
  };

  const handleAddProduct = async () => {
    if (!productData) {
      Alert.alert("Error", "No product data available");
      return;
    }

    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert("Error", "You must be logged in to add products");
      return;
    }

    setIsSaving(true);
    try {
      // Generate a unique product ID using timestamp + random string
      const productId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const response = await createUserProductText({
        user_id: userId,
        product_id: productId,
        name: productData.name,
        category: productData.type,
        skin_type: productData.skinType,
        time_of_day: productData.timeOfDay,
        product_desc: productData.ingredients?.join(", "),
      });

      Alert.alert("Success", `${productData.name} added to your shelf!`);
      onAdd?.(response);
      handleClose();
    } catch (err) {
      console.error("Failed to add product:", err);
      Alert.alert(
        "Error",
        err instanceof Error ? err.message : "Failed to add product",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const isReady = !!image && !!productData && !isLoading;

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

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.text} />
              <Text style={styles.loadingText}>Analyzing product...</Text>
            </View>
          )}

          {text && !isLoading ? (
            <Text style={styles.popupBody}>{text}</Text>
          ) : null}

          {productData && !isLoading && (
            <View style={styles.productDetails}>
              <Text style={styles.detailText}>Type: {productData.type}</Text>
              <Text style={styles.detailText}>
                Skin Type: {productData.skinType}
              </Text>
              <Text style={styles.detailText}>
                Time: {productData.timeOfDay}
              </Text>
            </View>
          )}

          <Pressable
            style={[
              styles.primaryButton,
              (!isReady || isSaving) && styles.primaryButtonDisabled,
            ]}
            onPress={isReady && !isSaving ? handleAddProduct : undefined}
            disabled={!isReady || isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={colors.muted} />
            ) : (
              <Text
                style={[
                  styles.primaryButtonText,
                  !isReady && styles.primaryButtonTextDisabled,
                ]}
              >
                Put on Shelf
              </Text>
            )}
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
    height: "80%",
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
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loadingText: {
    ...typography.body,
    color: colors.muted,
  },
  productDetails: {
    padding: 12,
    backgroundColor: colors.line,
    borderRadius: 8,
  },
  detailText: {
    ...typography.body,
    fontSize: 13,
    marginBottom: 4,
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
