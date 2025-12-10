
//reviewscreen.tsx
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";

export default function ReviewScreen() {
  const [sets, setSets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth();


const loadSets = async () => {
  try {
    setLoading(true);
    const user = auth.currentUser;
    const userKey = user ? `reviewSets_${user.uid}` : "reviewSets";
    const data = await AsyncStorage.getItem(userKey);
    setSets(data ? JSON.parse(data) : []);
  } catch (error) {
    console.error("Error loading sets:", error);
  } finally {
    setLoading(false);
  }
};

  useFocusEffect(
    useCallback(() => {
      loadSets();
    }, [])
  );

  const handleDelete = async (id: string) => {
  const user = auth.currentUser;
  const userKey = user ? `reviewSets_${user.uid}` : "reviewSets"; // fallback for non-auth users

  try {
    const stored = await AsyncStorage.getItem(userKey);
    const parsed = stored ? JSON.parse(stored) : [];

    // Filter out the deleted reviewer
    const updated = parsed.filter((s: any) => s.id !== id);

    // Save the updated list
    await AsyncStorage.setItem(userKey, JSON.stringify(updated));
    setSets(updated);

    Alert.alert("Deleted", "Reviewer removed successfully.");
  } catch (err) {
    console.error("Delete error:", err);
    Alert.alert("Error", "Failed to delete reviewer.");
  }
};


 const handleReview = async (item: any) => {
  const user = auth.currentUser;
  if (!user) return;

  const key = `reviewSets_${user.uid}`;

  // Make sure the reviewer exists in storage
  const stored = await AsyncStorage.getItem(key);
  const parsed = stored ? JSON.parse(stored) : [];
  const exists = parsed.find((s: any) => s.id === item.id);

  if (!exists) {
    Alert.alert("Error", "Reviewer not found. Please save it first.");
    return;
  }

  // Set for ReviewSection
  await AsyncStorage.setItem("currentReviewerId", item.id);
  await AsyncStorage.setItem("currentReviewerKey", key);

  router.push("/reviewsection");
};


  const handleEdit = async (set: any) => {
  try {
    // Save current editing set in AsyncStorage for AddScreen to read
    await AsyncStorage.setItem("editingSet", JSON.stringify(set));
    router.push("/(tabs)/addscreen");
  } catch (error) {
    console.error("Error opening edit mode:", error);
  }
};

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7A4D00" />
        <Text style={styles.loadingText}>Loading your reviewers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 My Review Sets</Text>

      {sets.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No saved reviewers yet.</Text>
          <Text style={styles.subText}>Go to the Add tab to create one!</Text>
        </View>
      ) : (
        <FlatList
          data={sets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <View style={styles.btnRow}>
                <TouchableOpacity
                  onPress={() => handleReview(item)}
                  style={[styles.btn, { backgroundColor: "#2E8B57" }]}
                >
                  <Text style={styles.btnText}>Review</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleEdit(item)}
                  style={[styles.btn, { backgroundColor: "#FFA500" }]}
                >
                  <Text style={styles.btnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={[styles.btn, { backgroundColor: "#FF6347" }]}
                >
                  <Text style={styles.btnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF7E6", padding: 20 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#7A4D00",
    marginBottom: 15,
    textAlign: "center",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: "#7A4D00", fontSize: 16 },
  emptyText: { color: "#7A4D00", fontSize: 18, fontWeight: "bold" },
  subText: { color: "#A36A00", marginTop: 5 },
  card: {
    backgroundColor: "#FFE0B2",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#7A4D00",
    marginBottom: 8,
  },
  btnRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
  btn: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8 },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
});
