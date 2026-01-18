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

      <Text style={styles.title}>Don't have an account yet?</Text>

      <TouchableOpacity
        style={styles.signUpContainer}
        onPress={() => router.push("/signup")}
      >
        <Text style={styles.signUp}>Sign Up</Text>
      </TouchableOpacity>
    </AuthPage>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 200,
    height: 100,
    resizeMode: "contain",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  button: {
    width: "80%",
    backgroundColor: "#ff5a5f",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {
    textAlign: "center",
    fontSize: 15,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  signUpContainer: {
    marginTop: 12,
  },
  signUp: {
    color: "#00a86b",
    fontSize: 16,
    fontWeight: "bold",
  },
});
