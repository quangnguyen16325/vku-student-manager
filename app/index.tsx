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
        Ứng dụng quản lý tài khoản sinh viên VKU
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/dashboard")}>
        <Text style={styles.buttonText}>BẮT ĐẦU</Text>
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
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    fontSize: 12,
    color: "#8b9bb4",
    textAlign: "center",
  },
});
