import { StyleSheet } from "react-native";


import * as ImagePicker from 'expo-image-picker';

const PlaceholderImage = require("@/assets/images/background-image.png");

export default function Index() {
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
    } else {
      alert("You did not select any image.");
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#25292e",
      alignItems: "center",
    },
    imageContainer: {
      flex: 1,
    },
    footerContainer: {
      flex: 1 / 3,
      alignItems: "center",
    },
  });
}
