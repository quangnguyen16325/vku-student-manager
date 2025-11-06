import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import {
  collection,
  getDocs,
  query,
  where,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export default function UserLogin() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const trimmedIdentifier = identifier.trim();
    const trimmedPassword = password.trim();

    if (!trimmedIdentifier || !trimmedPassword) {
      Alert.alert(
        "Thiếu thông tin",
        "Vui lòng nhập Username hoặc Email cùng mật khẩu"
      );
      return;
    }

    try {
      setLoading(true);

      const isEmail = trimmedIdentifier.includes("@");
      const normalizedEmail = trimmedIdentifier.toLowerCase();

      let snapshot: QuerySnapshot<DocumentData>;

      if (isEmail) {
        if (!normalizedEmail.endsWith("@vku.udn.vn")) {
          Alert.alert("Email không hợp lệ", "Email phải thuộc tên miền @vku.udn.vn");
          setLoading(false);
          return;
        }

        snapshot = await getDocs(
          query(collection(db, "students"), where("email", "==", normalizedEmail))
        );

        if (snapshot.empty) {
          snapshot = await getDocs(
            query(collection(db, "students"), where("username", "==", trimmedIdentifier))
          );
        }
      } else {
        snapshot = await getDocs(
          query(collection(db, "students"), where("username", "==", trimmedIdentifier))
        );
      }

      if (snapshot.empty) {
        Alert.alert("Đăng nhập thất bại", "Không tìm thấy tài khoản phù hợp");
        setLoading(false);
        return;
      }

      const docSnap = snapshot.docs[0];
      const data = docSnap.data() as { password?: string };

      if (data.password !== trimmedPassword) {
        Alert.alert("Đăng nhập thất bại", "Mật khẩu không chính xác");
        setLoading(false);
        return;
      }

      router.push({ pathname: "/userProfile", params: { id: docSnap.id } });
    } catch (error: any) {
      Alert.alert("Đăng nhập thất bại", error?.message ?? "Vui lòng thử lại sau");
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

        <Text style={styles.title}>Đăng nhập Sinh viên</Text>
        <Text style={styles.subtitle}>
          Đăng nhập quản lý thông tin cá nhân
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Username hoặc Email @vku.udn.vn"
          autoCapitalize="none"
          value={identifier}
          onChangeText={setIdentifier}
        />

        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingContent}>
              <ActivityIndicator color="#fff" />
              <Text style={styles.buttonText}>  Đang kiểm tra...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Đăng nhập</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/register")}>
          <Text style={styles.linkText}>Chưa có tài khoản? Đăng ký</Text>
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
  linkText: {
    color: "#0055a5",
    marginTop: 18,
    fontSize: 13,
    textAlign: "center",
  },
  backText: {
    color: "#5c6b8a",
    marginTop: 12,
    fontSize: 13,
    textAlign: "center",
  },
});

