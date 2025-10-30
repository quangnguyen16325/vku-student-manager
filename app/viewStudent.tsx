import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db } from "../config/firebaseConfig";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function ViewStudent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const ref = doc(db, "students", id as string);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setStudent(snap.data());
        } else {
          Alert.alert("Lỗi", "Không tìm thấy sinh viên này!");
          router.back();
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Lỗi", "Không thể tải thông tin sinh viên");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchStudent();
  }, [id]);

  const onDelete = async () => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa sinh viên này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "students", id as string));
          Alert.alert("✅ Đã xóa sinh viên!");
          router.replace("/admin");
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0055a5" />
      </View>
    );
  }

  if (!student) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/images/vku_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Thông tin chi tiết</Text>
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
        

        <View style={styles.row}>
          <FontAwesome5 name="lock" size={18} color="#0055a5" />
          <Text style={styles.label}>  Mật khẩu:</Text>
          <Text style={styles.value}>{student.password}</Text>
        </View>
        
      </View>

      <View style={styles.btnGroup}>
        <TouchableOpacity
          style={[styles.btn, styles.editBtn]}
          onPress={() => router.push({ pathname: "/editStudent", params: { id } })}
        >
          <MaterialIcons name="edit" size={20} color="#fff" />
          <Text style={styles.btnText}>  Sửa thông tin</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.deleteBtn]} onPress={onDelete}>
          <MaterialIcons name="delete" size={20} color="#fff" />
          <Text style={styles.btnText}>  Xóa sinh viên</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flexGrow: 1,
    backgroundColor: "#f7f9fc",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
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
  btnGroup: {
    width: "100%",
    alignItems: "center",
    gap: 12,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    paddingVertical: 14,
    borderRadius: 30,
  },
  editBtn: {
    backgroundColor: "#3498db",
  },
  deleteBtn: {
    backgroundColor: "#e74c3c",
  },
  backBtn: {
    backgroundColor: "#7f8c8d",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});
