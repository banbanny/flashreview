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
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { loadReviewers, deleteReviewer } from "../../lib/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ReviewScreen() {
  const [sets, setSets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth();

  const loadSets = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        setSets([]);
        return;
      }
      const all = await loadReviewers();
      setSets(all.filter((r: any) => r.userId === user.uid));
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
    try {
      await deleteReviewer(id);
      setSets((prev) => prev.filter((s) => s.firestoreId !== id));
      Alert.alert("Deleted", "Reviewer removed successfully.");
    } catch (err) {
      console.error("Delete error:", err);
      Alert.alert("Error", "Failed to delete reviewer.");
    }
  };

  const handleReview = (item: any) => {
    router.push({ pathname: "/reviewsection", params: { id: item.firestoreId } });
  };

  const handleEdit = async (set: any) => {
    await AsyncStorage.setItem("editingSet", JSON.stringify(set));
    router.push("/(tabs)/addscreen");
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
