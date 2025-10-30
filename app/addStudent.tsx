import React, { useState } from "react";
import {
  View,
  TextInput,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { uploadImage } from "../config/cloudinary";
import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";

export default function AddStudent() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });
    if (!res.canceled) {
      setLocalUri(res.assets[0].uri);
    }
  };

  const onSave = async () => {
    const trimmedName = username.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || !password) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ Username / Email / Password!");
      return;
    }

    if (!trimmedEmail.endsWith("@vku.udn.vn")) {
      Alert.alert("Email không hợp lệ", "Vui lòng sử dụng email có đuôi @vku.udn.vn");
      return;
    }

    try {
      setUploading(true);

      const usernameQuery = query(collection(db, "students"), where("username", "==", trimmedName));
      const usernameSnapshot = await getDocs(usernameQuery);

      if (!usernameSnapshot.empty) {
        Alert.alert("Tên người dùng đã tồn tại", "Vui lòng nhập username khác!");
        setUploading(false);
        return;
      }

      const emailQuery = query(collection(db, "students"), where("email", "==", trimmedEmail));
      const emailSnapshot = await getDocs(emailQuery);

      if (!emailSnapshot.empty) {
        Alert.alert("Email đã tồn tại", "Vui lòng sử dụng email khác!");
        setUploading(false);
        return;
      }

      let imageUrl = "";
      if (localUri) {
        imageUrl = await uploadImage(localUri, email); 
      }

      await addDoc(collection(db, "students"), {
        username: username.trim(),
        email: email.trim(),
        password,
        image: imageUrl,
      });

      Alert.alert("Thành công", "Đã thêm sinh viên!");
      router.back();
    } catch (e: any) {
      Alert.alert("Lỗi", e?.message ?? "Không thể thêm sinh viên");
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/images/vku_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        {/* <MaterialIcons name="verified-user" size={18} color="#1f2d5a" /> */}
        <Text style={styles.headerTitle}>Thêm tài khoản</Text>
      </View>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {localUri ? (
          <Image source={{ uri: localUri }} style={styles.preview} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imageText}>＋ Chọn ảnh sinh viên</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        // secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.saveBtn, uploading && { opacity: 0.7 }]}
        onPress={onSave}
        disabled={uploading}
      >
          <MaterialIcons name="save" size={20} color="#fff" />
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>Lưu tài khoản</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f7f9fc",
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
    fontSize: 18,
    fontWeight: "bold",
    // paddingLeft: 6,
    color: "#1f2d5a",
    flexShrink: 1,
  },
  imagePicker: {
    marginBottom: 20,
    alignItems: "center",
  },
  preview: {
    width: 200,
    height: 200,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#0055a5",
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#ccc",
    backgroundColor: "#e9eef7",
    justifyContent: "center",
    alignItems: "center",
  },
  imageText: {
    color: "#0055a5",
    fontWeight: "bold",
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
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0055a5",
    paddingVertical: 14,
    borderRadius: 30,
    width: "100%",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
    paddingLeft: 8,
  },
  backText: {
    color: "#5c6b8a",
    marginTop: 20,
    fontSize: 13,
  },
});
