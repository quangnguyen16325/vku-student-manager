import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import ChatBubble from "@/components/ChatBubble";

type Student = {
  username: string;
  email: string;
  password?: string;
  image?: string;
};

export default function UserProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      if (!id) return;
      try {
        const ref = doc(db, "students", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setStudent(snap.data() as Student);
        } else {
          Alert.alert("Không tìm thấy", "Tài khoản không tồn tại", [
            { text: "OK", onPress: () => router.replace("/userLogin") },
          ]);
        }
      } catch (error: any) {
        Alert.alert("Lỗi", error?.message ?? "Không thể tải thông tin", [
          { text: "OK", onPress: () => router.replace("/userLogin") },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0055a5" />
      </View>
    );
  }

  if (!student) {
    return null;
  }

  const goToEdit = () => {
    router.push({ pathname: "/userEditProfile", params: { id: id as string } });
  };

  const onLogout = () => {
    router.replace("/userLogin");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/images/vku_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Thông tin tài khoản</Text>
      </View>

      <Image
        source={{
          uri: student.image || "https://placehold.co/200x200?text=No+Img",
        }}
        style={styles.avatar}
      />

      <View style={styles.infoCard}>
        <View style={styles.row}>
          <FontAwesome5 name="user" size={18} color="#0055a5" />
          <Text style={styles.label}>  Username:</Text>
          <Text style={styles.value}>{student.username}</Text>
        </View>

        <View style={styles.row}>
          <MaterialIcons name="email" size={18} color="#0055a5" />
          <Text style={styles.label}>  Email:</Text>
          <Text style={styles.value}>{student.email}</Text>
        </View>

        {student.password ? (
          <View style={styles.row}>
            <FontAwesome5 name="lock" size={18} color="#0055a5" />
            <Text style={styles.label}>  Mật khẩu:</Text>
            <Text style={styles.value}>{student.password}</Text>
          </View>
        ) : null}
      </View>

      <TouchableOpacity
        style={[styles.button, styles.editButton]}
        onPress={goToEdit}
      >
        <MaterialIcons name="edit" size={18} color="#0055a5" />
        <Text style={[styles.buttonText, styles.editButtonText]}>Chỉnh sửa thông tin</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onLogout}>
        <MaterialIcons name="logout" size={22} color="#fff" />
        <Text style={styles.buttonText}>Đăng xuất</Text>
      </TouchableOpacity>

      <ChatBubble />
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f9fc",
  },
  container: {
    flexGrow: 1,
    backgroundColor: "#f7f9fc",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 50,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2d5a",
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#1f2d5a",
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    color: "#1f2d5a",
    fontSize: 15,
  },
  value: {
    marginLeft: 5,
    color: "#5c6b8a",
    fontSize: 14,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#0055a5",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
    marginLeft: 5,
  },
  editButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#0055a5",
  },
  editButtonText: {
    color: "#0055a5",
  },
});

