import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/vku_logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>VKU Student Manager</Text>

      <Text style={styles.subtitle}>
        Ứng dụng hỗ trợ quản lý tài khoản sinh viên VKU
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/login")}>
        <Text style={styles.buttonText}>Đăng nhập Admin</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => router.push("/userLogin")}
      >
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>
          Đăng nhập Sinh viên
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkWrapper} onPress={() => router.push("/register")}>
        <Text style={styles.linkText}>Sinh viên mới? Đăng ký tài khoản</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>Developed by Nguyễn Ngọc Quang</Text>
    </View>
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
    width: 160,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1f2d5a",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#5c6b8a",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#0055a5",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
    alignItems: "center",
    marginBottom: 14,
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#0055a5",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  secondaryButtonText: {
    color: "#0055a5",
  },
  linkWrapper: {
    marginTop: 10,
  },
  linkText: {
    color: "#0055a5",
    fontSize: 13,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    fontSize: 12,
    color: "#8b9bb4",
    textAlign: "center",
  },
});

