import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useAuth } from "../../lib/auth";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const { userData, signOutUser, loading } = useAuth();
  const router = useRouter();

  const firstLetter = userData?.firstName?.[0]?.toUpperCase() || "?";

  const handleLogout = async () => {
    await signOutUser();
    router.replace("/login");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#219EBC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.profileCircle}>
          <Text style={styles.initial}>{firstLetter}</Text>
        </View>

        <Text style={styles.title}>
          {userData?.firstName} {userData?.lastName}
        </Text>
        <Text style={styles.email}>{userData?.email}</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>First Name</Text>
          <Text style={styles.infoValue}>{userData?.firstName}</Text>

          <Text style={styles.infoLabel}>Last Name</Text>
          <Text style={styles.infoValue}>{userData?.lastName}</Text>

          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{userData?.email}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFD6A5", justifyContent: "center", padding: 20 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#FFF7E6",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  profileCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#219EBC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  initial: { color: "#fff", fontSize: 40, fontWeight: "bold" },
  title: { fontSize: 22, fontWeight: "bold", color: "#7A4D00" },
  email: { fontSize: 16, color: "#555", marginBottom: 20 },
  infoContainer: { alignSelf: "stretch", marginTop: 10 },
  infoLabel: { color: "#7A4D00", fontSize: 15, fontWeight: "600", marginTop: 10 },
  infoValue: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    color: "#333",
    marginTop: 5,
  },
  logoutButton: {
    backgroundColor: "#FF6B6B",
    padding: 15,
    borderRadius: 12,
    marginTop: 30,
    width: "80%",
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
