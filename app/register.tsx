import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    const trimmedName = username.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();
    const trimmedConfirm = confirm.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPass || !trimmedConfirm) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ Username / Email / Mật khẩu");
      return;
    }

    if (!trimmedEmail.endsWith("@vku.udn.vn")) {
      Alert.alert("Email không hợp lệ", "Email phải thuộc tên miền @vku.udn.vn");
      return;
    }

    if (trimmedPass.length < 6) {
      Alert.alert("Mật khẩu quá ngắn", "Mật khẩu tối thiểu 6 ký tự");
      return;
    }

    if (trimmedPass !== trimmedConfirm) {
      Alert.alert("Mật khẩu không khớp", "Vui lòng kiểm tra lại" );
      return;
    }

    try {
      setLoading(true);

      const usernameSnapshot = await getDocs(
        query(collection(db, "students"), where("username", "==", trimmedName))
      );
      if (!usernameSnapshot.empty) {
        Alert.alert("Username đã tồn tại", "Vui lòng chọn username khác");
        setLoading(false);
        return;
      }

      const emailSnapshot = await getDocs(
        query(collection(db, "students"), where("email", "==", trimmedEmail))
      );
      if (!emailSnapshot.empty) {
        Alert.alert("Email đã đăng ký", "Vui lòng sử dụng email khác");
        setLoading(false);
        return;
      }

      await addDoc(collection(db, "students"), {
        username: trimmedName,
        email: trimmedEmail,
        password: trimmedPass,
        image: "",
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Đăng ký thành công", "Bạn có thể đăng nhập ngay bây giờ", [
        { text: "Đăng nhập", onPress: () => router.replace("/userLogin") },
      ]);
    } catch (error: any) {
      Alert.alert("Đăng ký thất bại", error?.message ?? "Vui lòng thử lại sau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require("../assets/images/vku_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Đăng ký tài khoản sinh viên</Text>
        <Text style={styles.subtitle}>
          Tạo tài khoản để xem thông tin cá nhân của bạn trên hệ thống VKU
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Email @vku.udn.vn"
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Nhập lại mật khẩu"
          value={confirm}
          secureTextEntry
          onChangeText={setConfirm}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={onRegister}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingContent}>
              <ActivityIndicator color="#fff" />
              <Text style={styles.buttonText}>  Đang xử lý...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Đăng ký</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/userLogin")}>
          <Text style={styles.backText}>Đã có tài khoản? Đăng nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/")}>
          <Text style={styles.backText}>Quay lại trang chào</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
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
  buttonDisabled: {
    opacity: 0.7,
  },
  loadingContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  backText: {
    color: "#5c6b8a",
    marginTop: 16,
    fontSize: 13,
    textAlign: "center",
  },
});

