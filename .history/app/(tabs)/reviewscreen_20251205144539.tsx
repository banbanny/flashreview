import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { loadReviewers, deleteReviewer } from "../../lib/reviewers";
import type { Reviewer } from "../../lib/reviewers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "/fire";

export default function ReviewScreen() {
  const [sets, setSets] = useState<Reviewer[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const auth = getAuth();

  // Load authenticated user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        loadSets(user.uid);
      } else {
        setUserId(null);
        setSets([]);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  // Load reviewers for current user
  const loadSets = useCallback(async (uid: string) => {
    try {
      setLoading(true);
      const mine = await loadReviewers(uid); // Already filtered by userId
      setSets(mine);
    } catch (error) {
      console.error("Error loading sets:", error);
      Alert.alert("Error", "Failed to load reviewers.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete reviewer
 const handleDelete = async (firestoreId?: string) => {
  if (!firestoreId) return;

  Alert.alert("Confirm delete", "Are you sure you want to delete this reviewer?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Delete",
      style: "destructive",
      onPress: async () => {
        try {
          await deleteReviewer(firestoreId); // no need to pass userId
          setSets((prev) => prev.filter((p) => p.firestoreId !== firestoreId));
          Alert.alert("Deleted", "Reviewer removed successfully.");
        } catch (err) {
          console.error("Delete error:", err);
          Alert.alert("Error", "Failed to delete reviewer.");
        }
      },
    },
  ]);
};


  // Navigate to review section
  const handleReview = (item: Reviewer) => {
    if (!item.firestoreId) {
      Alert.alert("Error", "Reviewer ID missing.");
      return;
    }
    router.push(`/reviewsection?id=${encodeURIComponent(item.firestoreId)}`);
  };

  // Edit reviewer
  const handleEdit = async (set: Reviewer) => {
    try {
      await AsyncStorage.setItem(
        "editingSet",
        JSON.stringify({
          title: set.title,
          questions: set.questions,
          firestoreId: set.firestoreId,
        })
      );
      router.push("/(tabs)/addscreen");
    } catch (error) {
      console.error("Error opening edit mode:", error);
      Alert.alert("Error", "Could not open editor.");
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

  if (!userId) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Please log in to see your reviewers.</Text>
      </View>
    );
  }

  if (sets.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No saved reviewers yet.</Text>
        <Text style={styles.subText}>Go to the Add tab to create one!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 My Review Sets</Text>
      <FlatList
        data={sets}
        keyExtractor={(item) => item.firestoreId ?? item.title}
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
                onPress={() => handleDelete(item.firestoreId)}
                style={[styles.btn, { backgroundColor: "#FF6347" }]}
              >
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
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
