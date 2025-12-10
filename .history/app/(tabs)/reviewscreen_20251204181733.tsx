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
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth();

  const loadSets = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      const key = `reviewSets_${user.uid}`;
      const data = await AsyncStorage.getItem(key);
      setSets(data ? JSON.parse(data) : []);
    } catch (error) {
      console.log("Load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSets();
    }, [])
  );

  const handleReview = async (item) => {
    const user = auth.currentUser;
    const key = `reviewSets_${user.uid}`;

    await AsyncStorage.setItem("currentReviewerId", item.id);
    await AsyncStorage.setItem("currentReviewerKey", key);

    router.push("/reviewsection");
  };

  const handleEdit = async (item) => {
    await AsyncStorage.setItem("editingSet", JSON.stringify(item));
    router.push("/(tabs)/addscreen");
  };

  const handleDelete = async (id) => {
    const user = auth.currentUser;
    const key = `reviewSets_${user.uid}`;
    const stored = await AsyncStorage.getItem(key);
    const parsed = stored ? JSON.parse(stored) : [];

    const updated = parsed.filter((x) => x.id !== id);
    await AsyncStorage.setItem(key, JSON.stringify(updated));
    setSets(updated);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 My Review Sets</Text>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF7E6", padding: 20 },
  title: { fontSize: 26, textAlign: "center", fontWeight: "bold", marginBottom: 15 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#FFE0B2",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold" },
  btnRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  btn: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8 },
  btnText: { color: "white", fontWeight: "bold" },
});
