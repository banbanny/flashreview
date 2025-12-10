///app/(tabs)/ addscreen.tsx

import React, { useState, useEffect } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { saveReviewer } from "../path/to/firestoreHelpers";

export default function AddScreen() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<
    { id: string; question: string; answer: string }[]
  >([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();
  const auth = getAuth();

useFocusEffect(
  useCallback(() => {
    // When screen is focused, check if editing; if not, clear everything
    const loadData = async () => {
      const editing = await AsyncStorage.getItem("editingSet");
      if (editing) {
        const parsed = JSON.parse(editing);
        setTitle(parsed.title);
        setQuestions(parsed.questions);
        setEditingId(parsed.id);
      } else {
        setTitle("");
        setQuestions([]);
        setEditingId(null);
      }
    };
    loadData();

  }, [])
);
  // Load editing set if available
  useEffect(() => {
    const loadEditingSet = async () => {
      const editing = await AsyncStorage.getItem("editingSet");
      if (editing) {
        const parsed = JSON.parse(editing);
        setTitle(parsed.title);
        setQuestions(parsed.questions);
        setEditingId(parsed.id);
      }
    };
    loadEditingSet();
  }, []);

  const addQuestion = () => {
    if (!currentQuestion.trim() || !currentAnswer.trim()) {
      Alert.alert("Error", "Please enter both question and answer.");
      return;
    }
    setQuestions((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        question: currentQuestion.trim(),
        answer: currentAnswer.trim(),
      },
    ]);
    setCurrentQuestion("");
    setCurrentAnswer("");
  };

  const handleSave = async () => {
  if (!title.trim()) {
    Alert.alert("Error", "Please enter a title.");
    return;
  }
  if (questions.length === 0) {
    Alert.alert("Error", "Please add at least one question.");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    Alert.alert("Error", "No user logged in.");
    return;
  }

  try {
    if (editingId) {
      // Update existing reviewer
      const reviewerRef = doc(db, "users", user.uid, "reviewSets", editingId);
      await updateDoc(reviewerRef, {
        title,
        questions,
        updatedAt: new Date().toISOString(),
      });
    } else {
      // Create new reviewer
      const newId = Math.random().toString();
      const reviewerRef = doc(db, "users", user.uid, "reviewSets", newId);
      await setDoc(reviewerRef, {
        id: newId,
        title,
        questions,
        createdAt: new Date().toISOString(),
      });
    }

    // Clear local editing state
    await AsyncStorage.removeItem("editingSet");

    Alert.alert("Success", editingId ? "Reviewer updated in Firestore!" : "Reviewer saved to Firestore!");
    setTitle("");
    setQuestions([]);
    setEditingId(null);
    router.push("/reviewscreen");
  } catch (error) {
    console.error("Error saving reviewer:", error);
    Alert.alert("Error", "Failed to save reviewer to Firestore.");
  }
};

const handleReview = async () => {
  if (!title.trim()) {
    Alert.alert("Error", "Please enter a title.");
    return;
  }
  if (questions.length === 0) {
    Alert.alert("Error", "Please add at least one question.");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    Alert.alert("Error", "No user logged in.");
    return;
  }

  const key = `reviewSets_${user.uid}`;
  const data = await AsyncStorage.getItem(key);
  const parsed = data ? JSON.parse(data) : [];

  let id = editingId;

  // If creating new reviewer → first save it
  if (!editingId) {
    id = Math.random().toString();
    const newSet = { id, title, questions };
    await AsyncStorage.setItem(key, JSON.stringify([...parsed, newSet]));
  } else {
    // Updating an existing reviewer in storage
    const updated = parsed.map((s: any) =>
      s.id === editingId ? { ...s, title, questions } : s
    );
    await AsyncStorage.setItem(key, JSON.stringify(updated));
  }

  // Now this ID is guaranteed to exist in storage
  await AsyncStorage.setItem("currentReviewerId", id!);
  await AsyncStorage.setItem("currentReviewerKey", key);

  router.push("/reviewsection");
};


  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>
          {editingId ? "✏️ Edit Reviewer" : "📝 Create a New Reviewer"}
        </Text>

        <Text style={styles.label}>Reviewer Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter reviewer title"
          placeholderTextColor="#A36A00"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Question</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter question"
          placeholderTextColor="#A36A00"
          value={currentQuestion}
          onChangeText={setCurrentQuestion}
        />

        <Text style={styles.label}>Answer</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter answer"
          placeholderTextColor="#A36A00"
          value={currentAnswer}
          onChangeText={setCurrentAnswer}
        />

        <TouchableOpacity style={styles.addBtn} onPress={addQuestion}>
          <Text style={styles.addBtnText}>+ Add Question</Text>
        </TouchableOpacity>

        {questions.length > 0 && (
          <View style={styles.questionsList}>
            <Text style={styles.listTitle}>Questions Added:</Text>
            {questions.map((q) => (
              <View key={q.id} style={styles.questionItem}>
                <Text style={styles.qText}>• {q.question}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#2E8B57" }]}
          onPress={handleSave}
        >
          <Text style={styles.btnText}>
            {editingId ? "Update Reviewer" : "Save Reviewer"}
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFD6A5" },
  card: {
    backgroundColor: "#FFF7E6",
    borderRadius: 16,
    padding: 20,
    margin: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#7A4D00",
    marginBottom: 20,
  },
  label: { fontWeight: "bold", color: "#7A4D00", marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#7A4D00",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
    fontSize: 16,
    color: "#333",
  },
  addBtn: {
    backgroundColor: "#219EBC",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  addBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  questionsList: {
    marginTop: 20,
    backgroundColor: "#FFE0B2",
    borderRadius: 10,
    padding: 10,
  },
  listTitle: { fontWeight: "bold", color: "#7A4D00", marginBottom: 8 },
  questionItem: {
    backgroundColor: "#FFF7E6",
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
  },
  qText: { color: "#7A4D00", fontSize: 15 },
  btn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 18,
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
