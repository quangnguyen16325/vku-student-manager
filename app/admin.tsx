import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../config/firebaseConfig";
import { signOut } from "firebase/auth";
import { collection, onSnapshot, doc, deleteDoc, query, orderBy } from "firebase/firestore";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

type Student = {
  id: string;
  username: string;
  email: string;
  password?: string;
  image?: string;
};

export default function Admin() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [filtered, setFiltered] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = query(collection(db, "students"), orderBy("username", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const list: Student[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
      setStudents(list);
      setFiltered(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text.trim() === "") {
      setFiltered(students);
      return;
    }
    const lower = text.toLowerCase();
    const filteredList = students.filter(
      (s) =>
        s.username.toLowerCase().includes(lower) ||
        s.email.toLowerCase().includes(lower)
    );
    setFiltered(filteredList);
  };

  const onDelete = async (id: string) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa sinh viên này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "students", id));
          Alert.alert("Đã xóa sinh viên!");
        },
      },
    ]);
  };

  // const onLogout = async () => {
  //   Alert.alert("Xác nhận", "Bạn có chắc muốn đăng xuất?", [
  //     { text: "Hủy", style: "cancel" },
  //     {
  //       text: "Đăng xuất",
  //       style: "destructive",
  //       onPress: async () => {
  //         await signOut(auth);
  //         Alert.alert("Đã đăng xuất!");
  //         router.replace("/login");
  //       },
  //     },
  //   ]);
  // };

  const renderStudent = ({ item }: { item: Student }) => (
    <View style={styles.card}>
      {/* <Image
        source={{
          uri: item.image || "https://placehold.co/100x100?text=No+Img",
        }}
        style={styles.avatar}
      /> */}
      <TouchableOpacity
        onPress={() =>
          router.push({ pathname: "/viewStudent", params: { id: item.id } })
        }
      >
        <Image
          source={{ uri: item.image || "https://placehold.co/100x100?text=No+Img" }}
          style={styles.avatar}
      />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.username}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
      <View style={styles.actionGroup}>
        <TouchableOpacity
          onPress={() =>
            router.push({ pathname: "/editStudent", params: { id: item.id } })
          }
          style={[styles.smallButton, styles.editButton]}
        >
          <MaterialIcons name="edit" size={18} color="#fff" />
          <Text style={styles.btnText}> Sửa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onDelete(item.id)}
          style={[styles.smallButton, styles.deleteButton]}
        >
          <MaterialIcons name="delete" size={18} color="#fff" />
          <Text style={styles.btnText}> Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/images/vku_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        {/* <MaterialIcons name="verified-user" size={18} color="#1f2d5a" /> */}
        <Text style={styles.headerTitle}>Danh sách tài khoản sinh viên</Text>
      </View>

      <View style={styles.topActions}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push("/addStudent")}
        >
          <Text style={styles.addBtnText}>＋ Thêm tài khoản</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutText}>⎋ Đăng xuất</Text>
        </TouchableOpacity> */}
      </View>

      <View style={styles.searchBar}>
        <FontAwesome name="search" size={18} color="#555" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm sinh viên theo username hoặc email..."
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0055a5" style={{ marginTop: 50 }} />
      ) : filtered.length === 0 ? (
        <Text style={styles.emptyText}>Không tìm thấy sinh viên phù hợp.</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(it) => it.id}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={renderStudent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    // paddingLeft: 6,
    fontWeight: "bold",
    color: "#1f2d5a",
    flexShrink: 1,
  },
  topActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  addBtn: {
    backgroundColor: "#0055a5",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    elevation: 3,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  logoutBtn: {
    backgroundColor: "#e74c3c",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 14,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginVertical: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: "#eee",
    marginRight: 12,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#1f2d5a",
  },
  email: {
    color: "#5c6b8a",
    fontSize: 13,
    marginTop: 4,
  },
  actionGroup: {
    flexDirection: "column",
    gap: 6,
  },
  smallButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  editButton: {
    backgroundColor: "#3498db",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
    paddingLeft: 5,
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 50,
    fontSize: 14,
  },
});
