import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { uploadImage } from "../config/cloudinary";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";

export default function UserEditProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      if (!id) return;
      try {
        const ref = doc(db, "students", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as any;
          setUsername(data.username || "");
          setEmail(data.email || "");
          setPassword(data.password || "");
          setImageUrl(data.image || "");
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

  const handleUpdate = async () => {
    const trimmedName = username.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ Username, Email và Mật khẩu");
      return;
    }

    if (!trimmedEmail.endsWith("@vku.udn.vn")) {
      Alert.alert("Email không hợp lệ", "Email phải thuộc tên miền @vku.udn.vn");
      return;
    }

    try {
      setSaving(true);

      const usernameSnap = await getDocs(
        query(collection(db, "students"), where("username", "==", trimmedName))
      );
      const usernameConflict = usernameSnap.docs.some((docSnap) => docSnap.id !== id);
      if (usernameConflict) {
        Alert.alert("Username đã tồn tại", "Vui lòng chọn username khác");
        setSaving(false);
        return;
      }

      const emailSnap = await getDocs(
        query(collection(db, "students"), where("email", "==", trimmedEmail))
      );
      const emailConflict = emailSnap.docs.some((docSnap) => docSnap.id !== id);
      if (emailConflict) {
        Alert.alert("Email đã đăng ký", "Vui lòng sử dụng email khác");
        setSaving(false);
        return;
      }

      let finalImage = imageUrl;
      if (localUri) {
        finalImage = await uploadImage(localUri, trimmedEmail);
      }

      await updateDoc(doc(db, "students", id as string), {
        username: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
        image: finalImage,
      });

      setUsername(trimmedName);
      setEmail(trimmedEmail);
      setPassword(trimmedPassword);
      setImageUrl(finalImage);
      setLocalUri(null);

      Alert.alert("Cập nhật thành công", "Thông tin đã được lưu", [
        {
          text: "Xem thông tin",
          onPress: () =>
            router.replace({ pathname: "/userProfile", params: { id: id as string } }),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Cập nhật thất bại", error?.message ?? "Vui lòng thử lại sau");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0055a5" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/images/vku_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Chỉnh sửa thông tin</Text>
      </View>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {localUri ? (
          <Image source={{ uri: localUri }} style={styles.avatar} />
        ) : (
          <Image
            source={{
              uri: imageUrl || "https://placehold.co/200x200?text=No+Img",
            }}
            style={styles.avatar}
          />
        )}
        <Text style={styles.changeText}>Chọn ảnh mới</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

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

      <TouchableOpacity
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={handleUpdate}
        disabled={saving}
      >
        <FontAwesome name="cloud-upload" size={20} color="#fff" />
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>Lưu thay đổi</Text>
        )}
      </TouchableOpacity>

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
    marginTop: 0,
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
  imagePicker: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
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
    fontWeight: "600",
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
  saveButton: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#0055a5",
    paddingVertical: 14,
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
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
    marginLeft: 5,
  },
  cancelButton: {
    marginTop: 18,
  },
  cancelText: {
    color: "#5c6b8a",
    fontSize: 13,
  },
});
