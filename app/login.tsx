import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email.endsWith("@vku.udn.vn")) {
      Alert.alert("Email không hợp lệ", "Vui lòng sử dụng email @vku.udn.vn");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      router.replace("/admin");
    } catch {
      Alert.alert("Đăng nhập thất bại", "Tài khoản hoặc mật khẩu không đúng.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Image
        source={require("../assets/images/vku_logo.png")} 
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Đăng nhập Admin</Text>
      <Text style={styles.subtitle}>
        Quản lý thông tin sinh viên VKU - Phân hệ quản trị
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email @vku.udn.vn"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/")}>
        <Text style={styles.backText}>← Quay lại trang chào</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logo: {
    width: 150,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2d5a",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#5c6b8a",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 6,
    lineHeight: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#0055a5",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  backText: {
    color: "#5c6b8a",
    marginTop: 20,
    fontSize: 13,
  },
});
