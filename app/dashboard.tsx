import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import { db, auth } from "../config/firebaseConfig";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import ChatBubble from "../components/ChatBubble";

export default function Dashboard() {
  const [totalStudents, setTotalStudents] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "students"), (snap) => {
      setTotalStudents(snap.size);
    });
    return () => unsub();
  }, []);

  const onLogout = async () => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          await signOut(auth);
          Alert.alert("Đã đăng xuất!");
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/images/vku_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>VKU Student Manager</Text>
      </View>
      <ChatBubble />

      <Text style={styles.subHeader}>BẢNG ĐIỀU KHIỂN</Text>

      <View style={styles.card}>
        <FontAwesome5 name="users" size={42} color="#0055a5" style={{ marginBottom: 8 }} />
        <Text style={styles.title}>Tổng số sinh viên</Text>

        {totalStudents === null ? (
          <ActivityIndicator size="large" color="#0055a5" style={{ marginTop: 10 }} />
        ) : (
          <Text style={styles.count}>{totalStudents}</Text>
        )}
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.manageBtn}
          onPress={() => router.push("/admin")}
        >
          <MaterialIcons name="people" size={22} color="#fff" />
          <Text style={styles.manageText}>  Quản lý tài khoản</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <MaterialIcons name="logout" size={22} color="#fff" />
          <Text style={styles.logoutText}>  Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  header: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2d5a",
  },

  subHeader: {
    marginTop: 120,
    fontSize: 24,
    fontWeight: "bold",
    color: "#0055a5",
    textAlign: "center",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  card: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 10,
    marginTop: 30,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 16,
    color: "#5c6b8a",
    marginTop: 4,
  },
  count: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#0055a5",
    marginTop: 4,
  },

  buttonGroup: {
    marginTop: 40,
    alignItems: "center",
    gap: 16,
  },

  manageBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0055a5",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 3,
  },
  manageText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e74c3c",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 3,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
