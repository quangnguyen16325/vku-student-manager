import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { OPENROUTER_API_KEY, OPENROUTER_URL } from "../config/openrouterConfig";
import Markdown from 'react-native-markdown-display';

export default function ChatBubble() {
  const [visible, setVisible] = useState(false);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<{ sender: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  }, [chat]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const newChat = [...chat, { sender: "user", text: input }];
    setChat(newChat);
    setInput("");
    setLoading(true);

    const apiMessages = newChat.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    }));

    try {
      const res = await axios.post(
        OPENROUTER_URL,
        {
          // model: "openai/gpt-oss-safeguard-20b", 
          // model: "meta-llama/llama-4-maverick:free", nvidia/nemotron-nano-12b-v2-vl:free
          model: "x-ai/grok-4-fast", 
          messages: apiMessages,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "HTTP-Referer": "https://vku-student-manager-demo.vercel.app",
            "X-Title": "VKU Student Manager",
          },
        }
      );

      const reply =
        res.data?.choices?.[0]?.message?.content ||
        "Xin lỗi, tôi chưa có câu trả lời cho câu hỏi này.";
      setChat((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch (error) {
      console.log(
        "OpenRouter API Error",
      );
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: "Lỗi khi kết nối OpenRouter API." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.bubble} onPress={() => setVisible(true)}>
        <Ionicons name="chatbubbles" size={26} color="#fff" />
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, justifyContent: "flex-end" }}
          >
            <View style={styles.chatBox}>
              <View style={styles.header}>
                <Text style={styles.title}>Trợ lý VKU (AI Chat)</Text>
                <TouchableOpacity onPress={() => setVisible(false)}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <ScrollView
                ref={scrollRef}
                style={styles.chatArea}
                contentContainerStyle={{ paddingVertical: 10 }}
                onContentSizeChange={() =>
                  scrollRef.current?.scrollToEnd({ animated: true })
                }
              >
                {chat.map((msg, i) => (
                  <View
                    key={i}
                    style={[
                      styles.msg,
                      msg.sender === "user" ? styles.userMsg : styles.botMsg,
                    ]}
                  >
                    {/* <Text
                      style={[
                        styles.msgText,
                        msg.sender === "user"
                          ? { color: "#fff" }
                          : { color: "#1f2d5a" },
                      ]}
                    >
                      {msg.text}
                    </Text> */}
                    {msg.sender === "user" ? (
                      <Text style={{ color: "#fff" }}>
                        {msg.text}
                      </Text>
                    ) : (
                      <Markdown>
                        {msg.text}
                      </Markdown>
                    )}
                  </View>
                ))}
                {loading && <ActivityIndicator color="#0055a5" />}
              </ScrollView>

              <View style={styles.inputArea}>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập câu hỏi..."
                  value={input}
                  onChangeText={setInput}
                  placeholderTextColor="#888"
                  onSubmitEditing={sendMessage}
                  blurOnSubmit={false}
                />
                <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
                  <Ionicons name="send" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#0055a5",
    width: 55,
    height: 55,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  chatBox: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    height: "70%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#0055a5",
    padding: 14,
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    fontFamily: "System",
  },
  chatArea: {
    flex: 1,
    paddingHorizontal: 14,
  },
  msg: {
    padding: 10,
    borderRadius: 16,
    marginVertical: 6,
    maxWidth: "85%",
    lineHeight: 22,
  },
  msgText: {
    fontFamily: "System",
    fontSize: 15,
  },
  userMsg: {
    alignSelf: "flex-end",
    backgroundColor: "#0055a5",
    borderBottomRightRadius: 4,
  },
  botMsg: {
    alignSelf: "flex-start",
    backgroundColor: "#e8eef7",
    borderBottomLeftRadius: 4,
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 15,
    color: "#1f2d5a",
    fontFamily: "System",
  },
  sendBtn: {
    backgroundColor: "#0055a5",
    borderRadius: 25,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
