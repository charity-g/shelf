import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";

import AuthPage from "@/components/AuthPage";
import { login, signup } from "../services/auth";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>(""); // For sign-up
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.push("/home");
    } catch (error: any) {
      Alert.alert("Login Error", error?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !username) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await signup(email, password, username);
      router.push("/home"); // Navigate after sign-up
    } catch (error: any) {
      Alert.alert("Sign Up Error", error?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
      <AuthPage>
    
          <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
          />

          <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
          />

          <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
          >
              <Text style={styles.buttonText}>
                  {loading ? "Logging in..." : "Login"}
              </Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>Don’t have an account?</Text>

          <TouchableOpacity onPress={() => router.push("/signup")}>
              <Text style={styles.signUp}>Create one</Text>
          </TouchableOpacity>
      </AuthPage>
  );
}

const INPUT_WIDTH = 320;

const styles = StyleSheet.create({
    header: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 24,
        color: "#111",
    },

    input: {
        width: INPUT_WIDTH,
        height: 52,
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#ddd",
        fontSize: 16,
    },

    button: {
        width: INPUT_WIDTH,
        height: 52,
        backgroundColor: "#FF8DA1",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
    },

    buttonDisabled: {
        opacity: 0.6,
    },

    buttonText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "600",
    },

    footerText: {
        marginTop: 20,
        fontSize: 14,
        color: "#555",
    },

    signUp: {
        marginTop: 6,
        fontSize: 16,
        fontWeight: "600",
        color: "#FF8DA1",
    },
});