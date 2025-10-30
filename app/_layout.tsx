import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="admin" options={{ title: "", headerBackTitle: "Quay lại ", headerShadowVisible: false, headerStyle: { backgroundColor: '#f7f9fc' } }} />
      <Stack.Screen name="addStudent" options={{ title: "", headerBackTitle: "Quay lại ", headerShadowVisible: false, headerStyle: { backgroundColor: '#f7f9fc' } }} />
      <Stack.Screen name="editStudent" options={{ title: "", headerBackTitle: "Quay lại ", headerShadowVisible: false, headerStyle: { backgroundColor: '#f7f9fc' } }} />
      <Stack.Screen name="viewStudent" options={{ title: "", headerBackTitle: "Quay lại ", headerShadowVisible: false, headerStyle: { backgroundColor: '#f7f9fc' } }} />
    </Stack>
  );
}
