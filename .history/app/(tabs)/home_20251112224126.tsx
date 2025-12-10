import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../lib/auth";

export default function HomeScreen() {
  const { userData } = useAuth();
  const router = useRouter();

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
    backgroundColor: "#F3F4F6", // professional light gray
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcome: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1F2937", // dark gray/navy
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#374151", // medium gray
    marginVertical: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2563EB", // professional blue
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: "70%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
