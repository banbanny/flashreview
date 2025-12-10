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

export default function AddScreen() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [editingId, setEditingId] = useState(null);

  const router = useRouter();
  const auth = getAuth();

  // Load editing data
  useFocusEffect(
    React.useCallback(() => {
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
    if (!user) return;

    const key = `reviewSets_${user.uid}`;
    const existing = await AsyncStorage.getItem(key);
    const parsed = existing ? JSON.parse(existing) : [];

    let updated;
    if (editingId) {
      updated = parsed.map((s) =>
        s.id === editingId ? { ...s, title, questions } : s
      );
    } else {
      updated = [...parsed, { id: Math.random().toString(), title, questions }];
    }

    await AsyncStorage.setItem(key, JSON.stringify(updated));
    await AsyncStorage.removeItem("editingSet");

    Alert.alert("Success", "Reviewer saved!");
    router.push("/(tabs)/reviewscreen");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>
          {editingId ? "✏️ Edit Reviewer" : "📝 Create Reviewer"}
        </Text>

        <Text style={styles.label}>Reviewer Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter title"
        />

        <Text style={styles.label}>Question</Text>
        <TextInput
          style={styles.input}
          value={currentQuestion}
          onChangeText={setCurrentQuestion}
          placeholder="Enter question"
        />

        <Text style={styles.label}>Answer</Text>
        <TextInput
          style={styles.input}
          value={currentAnswer}
          onChangeText={setCurrentAnswer}
          placeholder="Enter answer"
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

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFD6A5" },
  card: { backgroundColor: "#FFF7E6", padding: 20, margin: 20, borderRadius: 16 },
  header: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  label: { marginTop: 12, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
    backgroundColor: "white",
  },
  addBtn: { backgroundColor: "#219EBC", padding: 12, borderRadius: 10, marginTop: 20 },
  addBtnText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  questionsList: { marginTop: 20, backgroundColor: "#FFE0B2", padding: 10, borderRadius: 10 },
  listTitle: { fontWeight: "bold" },
  questionItem: { padding: 10, backgroundColor: "#FFF7E6", marginVertical: 5, borderRadius: 8 },
  qText: { fontSize: 15 },
  btn: { padding: 12, borderRadius: 10, marginTop: 20 },
  btnText: { color: "white", fontWeight: "bold", textAlign: "center" },
});
