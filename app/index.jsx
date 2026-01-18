import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, Pressable, StyleSheet } from "react-native";
import { colors } from "../styles/shared";

const { width, height } = Dimensions.get("window");
const gradientSize = Math.max(width, height) * 6;

export default function App() {
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const gradientAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Brand fade-in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: true,
    }).start();

    // Infinite gradient animation
    Animated.loop(
      Animated.timing(gradientAnim, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: false,
      }),
    ).start();
  }, []);

  const colorInterpolation = gradientAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Pressable style={styles.container} onPress={() => router.replace("/home")}>
      <Animated.View style={styles.container}>
        <Animated.View
          style={{
            transform: [{ rotate: colorInterpolation }],
          }}
        >
          <LinearGradient
            colors={[colors.subtle, colors.line, colors.text, "#91EAE4"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.gradient,
              {
                width: gradientSize,
                height: gradientSize,
                top: -gradientSize / 2,
                left: -gradientSize / 2,
              },
            ]}
          />
        </Animated.View>

        <Animated.Text
          style={[
            styles.brand,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          shelf.
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: "absolute",
  },
  brand: {
    position: "absolute",
    alignSelf: "center",
    top: height / 2 - 40,
    fontSize: 42,
    fontWeight: "700",
    color: colors.text,
    letterSpacing: 2,
  },
});
