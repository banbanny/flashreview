import React, { useState, useEffect, useCallback } from "react";
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

      return () => {
        setTitle("");
        setQuestions([]);
        setEditingId(null);
      };
    }, [])
  );

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

    const key = `reviewSets_${user.uid}`;
    const data = await AsyncStorage.getItem(key);
    const parsed = data ? JSON.parse(data) : [];

    let updatedSets;
    if (editingId) {
      updatedSets = parsed.map((set: any) =>
        set.id === editingId ? { ...set, title, questions } : set
      );
    } else {
      const newSet = { id: Math.random().toString(), title, questions };
      updatedSets = [...parsed, newSet];
    }

    await AsyncStorage.setItem(key, JSON.stringify(updatedSets));
    await AsyncStorage.removeItem("editingSet");

    Alert.alert("Success", editingId ? "Reviewer updated!" : "Reviewer saved!");
    setTitle("");
    setQuestions([]);
    setEditingId(null);
    router.push("/(tabs)/reviewscreen");
  };

  const handleReview = async () => {
    if (questions.length === 0) {
      Alert.alert("Error", "Please add at least one question.");
      return;
    }

    const currentSet = {
      id: Math.random().toString(),
      title: title || "Untitled Reviewer",
      questions,
    };
    await AsyncStorage.setItem("currentSet", JSON.stringify(currentSet));
    router.push("/reviewsection");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>
          {editingId ? "✏️ Edit Reviewer" : "CREATE A NEW"}
        </Text>

        <Text style={styles.label}>Reviewer Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter reviewer title"
          placeholderTextColor="#6B7280"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Question</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter question"
          placeholderTextColor="#6B7280"
          value={currentQuestion}
          onChangeText={setCurrentQuestion}
        />

        <Text style={styles.label}>Answer</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter answer"
          placeholderTextColor="#6B7280"
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

        <TouchableOpacity style={styles.btn} onPress={handleSave}>
          <Text style={styles.btnText}>
            {editingId ? "Update Reviewer" : "Save Reviewer"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, { backgroundColor: "#1F2937" }]} onPress={handleReview}>
          <Text style={styles.btnText}>Start Review</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    margin: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1F2937",
    marginBottom: 20,
  },
  label: { fontWeight: "bold", color: "#374151", marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
    fontSize: 16,
    color: "#111827",
  },
  addBtn: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  addBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  questionsList: {
    marginTop: 20,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    padding: 10,
  },
  listTitle: { fontWeight: "bold", color: "#1F2937", marginBottom: 8 },
  questionItem: {
    backgroundColor: "#F3F4F6",
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
  },
  qText: { color: "#374151", fontSize: 15 },
  btn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 18,
    backgroundColor: "#2563EB",
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
