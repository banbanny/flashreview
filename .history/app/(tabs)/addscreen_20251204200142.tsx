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
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveReviewer, updateReviewer } from "../../lib/firestore";

export default function AddScreen() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<{ id: string; question: string; answer: string }[]>([]);
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
          setEditingId(parsed.firestoreId);
        } else {
          setTitle("");
          setQuestions([]);
          setEditingId(null);
        }
      };
      loadData();
    }, [])
  );

  const addQuestion = () => {
    if (!currentQuestion.trim() || !currentAnswer.trim()) {
      Alert.alert("Error", "Please enter both question and answer.");
      return;
    }
    setQuestions((prev) => [...prev, { id: Math.random().toString(), question: currentQuestion.trim(), answer: currentAnswer.trim() }]);
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
        await updateReviewer(editingId, { title, questions, userId: user.uid, updatedAt: new Date().toISOString() });
        Alert.alert("Success", "Reviewer updated!");
      } else {
        await saveReviewer({ title, questions, userId: user.uid, createdAt: new Date().toISOString() });
        Alert.alert("Success", "Reviewer saved!");
      }

      await AsyncStorage.removeItem("editingSet");
      setTitle("");
      setQuestions([]);
      setEditingId(null);
      router.push("/reviewscreen");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save reviewer.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>{editingId ? "✏️ Edit Reviewer" : "📝 Create a New Reviewer"}</Text>

        <Text style={styles.label}>Reviewer Title</Text>
        <TextInput style={styles.input} placeholder="Enter reviewer title" value={title} onChangeText={setTitle} />

        <Text style={styles.label}>Question</Text>
        <TextInput style={styles.input} placeholder="Enter question" value={currentQuestion} onChangeText={setCurrentQuestion} />

        <Text style={styles.label}>Answer</Text>
        <TextInput style={styles.input} placeholder="Enter answer" value={currentAnswer} onChangeText={setCurrentAnswer} />

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

        <TouchableOpacity style={[styles.btn, { backgroundColor: "#2E8B57" }]} onPress={handleSave}>
          <Text style={styles.btnText}>{editingId ? "Update Reviewer" : "Save Reviewer"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFD6A5" },
  card: { backgroundColor: "#FFF7E6", borderRadius: 16, padding: 20, margin: 20 },
  header: { fontSize: 22, fontWeight: "bold", textAlign: "center", color: "#7A4D00", marginBottom: 20 },
  label: { fontWeight: "bold", color: "#7A4D00", marginTop: 12 },
  input: { borderWidth: 1, borderColor: "#7A4D00", backgroundColor: "#FFF", padding: 12, borderRadius: 10, marginTop: 5, fontSize: 16 },
  addBtn: { backgroundColor: "#219EBC", padding: 12, borderRadius: 10, marginTop: 20, alignItems: "center" },
  addBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  questionsList: { marginTop: 20, backgroundColor: "#FFE0B2", borderRadius: 10, padding: 10 },
  listTitle: { fontWeight: "bold", color: "#7A4D00", marginBottom: 8 },
  questionItem: { backgroundColor: "#FFF7E6", padding: 10, borderRadius: 8, marginVertical: 4 },
  qText: { color: "#7A4D00", fontSize: 15 },
  btn: { paddingVertical: 12, borderRadius: 10, alignItems: "center", marginTop: 18 },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
