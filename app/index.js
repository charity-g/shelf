import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Alert, Button, Image, Text, View } from "react-native";

export default function App() {
    const [image, setImage] = useState(null);
    const [text, setText] = useState("");
    const [hasPermission, setHasPermission] = useState(null);

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

    const uploadImage = async (photo) => {
        try {
            const formData = new FormData();
            formData.append("image", {
                uri: photo.uri,
                name: "photo.jpg",
                type: "image/jpeg",
            });

            const res = await fetch("http://128.189.150.85:3001/ocr", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const textResponse = await res.text();
                console.error("Server error:", textResponse);
                Alert.alert("Server error", textResponse);
                return;
            }

            const data = await res.json();
            setText(data.text || "No text detected");
        } catch (err) {
            console.error("Upload failed:", err);
            Alert.alert("Error", err.message);
        }
    };


    return (
        <View style={{ padding: 40 }}>
            <Button title="Take Photo" onPress={pickImage} />
            {image && (
                <Image
                    source={{ uri: image }}
                    style={{ height: 200, width: 200, marginVertical: 20 }}
                />
            )}
            <Text>{text}</Text>
        </View>
    );
}
