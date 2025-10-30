import React, { useEffect, useState } from "react";
import {
  TextInput,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { db } from "../config/firebaseConfig";
import { doc, getDoc, updateDoc, getDocs, collection, query, where } from "firebase/firestore";
import { uploadImage } from "../config/cloudinary";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";

export default function EditStudent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchOne = async () => {
      const ref = doc(db, "students", id as string);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const d = snap.data() as any;
        setUsername(d.username || "");
        setEmail(d.email || "");
        setPassword(d.password || "");
        setImageUrl(d.image || "");
      } else {
        Alert.alert("Lỗi", "Không tìm thấy sinh viên!");
        router.back();
      }
    };
    if (id) fetchOne();
  }, [id]);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });
    if (!res.canceled) setLocalUri(res.assets[0].uri);
  };

  const onUpdate = async () => {
    // if (!username.trim() || !email.trim()) {
    //   return Alert.alert("Thiếu thông tin", "Vui lòng nhập Username và Email");
    // }
    const trimmedName = username.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail) {
      return Alert.alert("Thiếu thông tin", "Vui lòng nhập Username và Email");
    }

    if (!trimmedEmail.endsWith("@vku.udn.vn")) {
      Alert.alert("Email không hợp lệ", "Email phải có đuôi @vku.udn.vn");
      return;
    }

    try {
      setSaving(true);

       const usernameQuery = query(
        collection(db, "students"),
        where("username", "==", trimmedName)
      );
      const usernameSnap = await getDocs(usernameQuery);

      const usernameConflict = usernameSnap.docs.some((d) => d.id !== id);
      if (usernameConflict) {
        Alert.alert("Tên người dùng đã tồn tại", "Vui lòng nhập username khác!");
        setSaving(false);
        return;
      }

      const emailQuery = query(collection(db, "students"), where("email", "==", trimmedEmail));
      const emailSnap = await getDocs(emailQuery);

      const emailConflict = emailSnap.docs.some((d) => d.id !== id);
      if (emailConflict) {
        Alert.alert("Email đã tồn tại", "Vui lòng sử dụng email khác!");
        setSaving(false);
        return;
      }

      let finalImage = imageUrl;
      if (localUri) {
        finalImage = await uploadImage(localUri, email);
      }

      await updateDoc(doc(db, "students", id as string), {
        username: username.trim(),
        email: email.trim(),
        password,
        image: finalImage,
      });

      Alert.alert("✅ Thành công", "Đã cập nhật thông tin sinh viên!");
      router.back();
    } catch (e: any) {
      Alert.alert("❌ Lỗi", e?.message ?? "Không thể cập nhật");
    } finally {
      setSaving(false);
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
        <Text style={styles.headerTitle}>Chỉnh sửa tài khoản</Text>
      </View>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {localUri ? (
          <Image source={{ uri: localUri }} style={styles.preview} />
        ) : (
          <Image
            source={{
              uri: imageUrl || "https://placehold.co/200x200?text=No+Img",
            }}
            style={styles.preview}
          />
        )}
        <Text style={styles.changeText}>＋ Chọn ảnh mới</Text>
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
        style={[styles.saveBtn, saving && { opacity: 0.7 }]}
        onPress={onUpdate}
        disabled={saving}
      >
          <FontAwesome name="cloud-upload" size={20} color="#fff" />
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>Cập nhật tài khoản</Text>
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
    color: "#1f2d5a",
    flexShrink: 1,
  },
  imagePicker: {
    alignItems: "center",
    marginBottom: 20,
  },
  preview: {
    width: 200,
    height: 200,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#0055a5",
    backgroundColor: "#eee",
  },
  changeText: {
    color: "#0055a5",
    marginTop: 8,
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
