import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../lib/auth";

export default function HomeScreen() {
  const { userData, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#219EBC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        Welcome, {userData?.firstName || "User"} 👋
      </Text>
      <Text style={styles.subtitle}>
        Ready to create and review your flashcards?
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/addscreen")}
      >
        <Text style={styles.buttonText}>Create Flashcards</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFD6A5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  welcome: { fontSize: 26, fontWeight: "bold", color: "#7A4D00" },
  subtitle: { fontSize: 16, color: "#7A4D00", marginVertical: 10 },
  button: {
    backgroundColor: "#219EBC",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
