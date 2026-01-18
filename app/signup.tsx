import AuthPage from "@/components/AuthPage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { signup } from "../services/auth";

export default function SignUpScreen() {
  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const user = await signup(email, password, username);

      Alert.alert("Success", "Account created successfully!");
      router.push("/home");
    } catch (error: any) {
      console.error("Signup error:", error?.code, error?.message);
      Alert.alert("Sign Up Error", error?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPage>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
      />

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
        onPress={handleSignUp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Signing up..." : "Sign Up"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>Already have an account?</Text>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.loginLink}>Log in</Text>
      </TouchableOpacity>
    </AuthPage>
  );
}

const INPUT_WIDTH = 320;

const styles = StyleSheet.create({
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

  loginLink: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "600",
    color: "#FF8DA1",
  },
});
