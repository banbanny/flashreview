import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter, useSearchParams } from "expo-router";
import { loadReviewers } from "../../lib/reviewers";
import { getAuth } from "firebase/auth";

type Q = { id?: string; question: string; answer: string };

export default function ReviewSection() {
  const { id } = useSearchParams(); // expects ?id=firestoreId
  const [loading, setLoading] = useState(true);
  const [reviewerTitle, setReviewerTitle] = useState("");
  const [questions, setQuestions] = useState<Q[]>([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        if (!id) {
          Alert.alert("Error", "No reviewer selected.");
          router.push("/reviewscreen");
          return;
        }
        const all = await loadReviewers();
        const target = all.find((r) => r.firestoreId === String(id));
        const user = auth.currentUser;
        if (!target) {
          Alert.alert("Error", "Reviewer not found.");
          router.push("/reviewscreen");
          return;
        }
        if (user && target.userId !== user.uid) {
          Alert.alert("Error", "You don't have permission to open this reviewer.");
          router.push("/reviewscreen");
          return;
        }
        if (!mounted) return;
        setReviewerTitle(target.title);
        setQuestions(target.questions || []);
      } catch (err) {
        console.error("Error loading reviewer:", err);
        Alert.alert("Error", "Failed to load reviewer.");
        router.push("/reviewscreen");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  // derived values
  const total = questions.length;
  const current = questions[index];

  const handleShowAnswer = () => setShowAnswer((s) => !s);

  const handleMark = (isCorrect: boolean) => {
    if (isCorrect) setCorrectCount((c) => c + 1);
    if (index + 1 >= total) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setShowAnswer(false);
    }
  };

  const handleRestart = () => {
    setIndex(0);
    setCorrectCount(0);
    setShowAnswer(false);
    setFinished(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7A4D00" />
      </View>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>This reviewer has no questions.</Text>
        <TouchableOpacity style={[styles.btn, { backgroundColor: "#2E8B57", marginTop: 12 }]} onPress={() => router.push("/reviewscreen")}>
          <Text style={styles.btnText}>Back to Review Sets</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (finished) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>✅ Results</Text>
        <Text style={styles.resultText}>
          You answered {correctCount} out of {total} correctly.
        </Text>

        <TouchableOpacity style={[styles.btn, { backgroundColor: "#2E8B57" }]} onPress={handleRestart}>
          <Text style={styles.btnText}>Restart</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, { backgroundColor: "#FFA500", marginTop: 10 }]} onPress={() => router.push("/reviewscreen")}>
          <Text style={styles.btnText}>Back to Review Sets</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{reviewerTitle || "Review"}</Text>
      <Text style={styles.progress}>
        {index + 1} / {total}
      </Text>

      <View style={styles.card}>
        <Text style={styles.questionText}>{current?.question}</Text>

        {showAnswer && <Text style={styles.answerText}>Answer: {current?.answer}</Text>}

        <View style={styles.row}>
          <TouchableOpacity style={[styles.smallBtn, { backgroundColor: "#219EBC" }]} onPress={handleShowAnswer}>
            <Text style={styles.smallBtnText}>{showAnswer ? "Hide" : "Show Answer"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.smallBtn, { backgroundColor: "#2E8B57" }]} onPress={() => handleMark(true)}>
            <Text style={styles.smallBtnText}>I was correct</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.smallBtn, { backgroundColor: "#FF6347" }]} onPress={() => handleMark(false)}>
            <Text style={styles.smallBtnText}>I was wrong</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ marginTop: 12 }}>
        <TouchableOpacity style={[styles.btn, { backgroundColor: "#FFA500" }]} onPress={() => router.push("/reviewscreen")}>
          <Text style={styles.btnText}>Exit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF7E6", padding: 20, alignItems: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF7E6" },
  title: { fontSize: 22, fontWeight: "bold", color: "#7A4D00" },
  progress: { color: "#A36A00", marginTop: 6 },
  card: { width: "100%", backgroundColor: "#FFE0B2", padding: 18, borderRadius: 12, marginTop: 18 },
  questionText: { fontSize: 18, color: "#7A4D00", fontWeight: "600" },
  answerText: { marginTop: 12, fontSize: 16, color: "#333" },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 18 },
  smallBtn: { paddingVertical: 10, paddingHorizontal: 10, borderRadius: 8, minWidth: 100, alignItems: "center", marginHorizontal: 4 },
  smallBtnText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  btn: { paddingVertical: 12, borderRadius: 10, alignItems: "center", marginTop: 10, width: 220 },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  emptyText: { fontSize: 16, color: "#7A4D00" },
  resultText: { fontSize: 18, color: "#7A4D00", marginVertical: 12 },
});
