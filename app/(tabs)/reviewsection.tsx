import { useLocalSearchParams, useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { loadReviewers } from "../../lib/reviewers";

type Q = { id?: string; question: string; answer: string };

export default function ReviewSection() {
  const { id } = useLocalSearchParams(); // expects ?id=firestoreId
  const [loading, setLoading] = useState(true);
  const [reviewerTitle, setReviewerTitle] = useState("");
  const [questions, setQuestions] = useState<Q[]>([]);
  const [index, setIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [finished, setFinished] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const auth = getAuth();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Error", "You must be logged in.");
        router.push("/login");
        return;
      }

      if (!id) {
        Alert.alert("Error", "No reviewer selected.");
        router.push("/reviewscreen");
        return;
      }

      const all = await loadReviewers(user.uid);
      const target = all.find((r) => r.firestoreId === String(id));

      if (!target) {
        Alert.alert("Error", "Reviewer not found.");
        router.push("/reviewscreen");
        return;
      }

      setReviewerTitle(target.title);
      setQuestions(target.questions || []);
    } catch (err) {
      console.error("Error loading reviewer:", err);
      Alert.alert("Error", "Failed to load reviewer.");
      router.push("/reviewscreen");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [id, loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const current = questions[index];
  const total = questions.length;

  const handleSubmit = () => {
    if (!current) return;
    const isCorrect =
      userInput.trim().toLowerCase() === current.answer.trim().toLowerCase();
    setFeedback(isCorrect ? "Correct!" : `Wrong! Correct answer: ${current.answer}`);
    setUserInput("");

    setTimeout(() => {
      if (index + 1 >= total) {
        setFinished(true);
        setShowControls(true);
      } else {
        setIndex((i) => i + 1);
        setFeedback("");
      }
    }, 2000);
  };

  const handleRestart = () => {
    setIndex(0);
    setFeedback("");
    setUserInput("");
    setFinished(false);
    setShowControls(false);
  };

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.center}>
          <ActivityIndicator size="large" color="#7A4D00" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.center}>
          <Text style={styles.emptyText}>This reviewer has no questions.</Text>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: "#2E8B57", marginTop: 12 }]}
            onPress={() => router.push("/reviewscreen")}
          >
            <Text style={styles.btnText}>Back to Review Sets</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={{ alignItems: "center" }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={styles.title}>{reviewerTitle || "Review"}</Text>
          {!finished && <Text style={styles.progress}>{index + 1} / {total}</Text>}

          {!finished && current && (
            <View style={styles.card}>
              <Text style={styles.questionText}>{current.question}</Text>

              <TextInput
                style={styles.input}
                placeholder="Type your answer..."
                value={userInput}
                onChangeText={setUserInput}
                editable={!feedback}
              />

              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: "#2E8B57" }]}
                onPress={handleSubmit}
                disabled={!userInput || !!feedback}
              >
                <Text style={styles.submitBtnText}>Submit</Text>
              </TouchableOpacity>

              {feedback ? (
                <Text
                  style={[
                    styles.feedback,
                    { color: feedback.startsWith("Correct") ? "green" : "red" },
                  ]}
                >
                  {feedback}
                </Text>
              ) : null}
            </View>
          )}

          {finished && showControls && (
            <View style={{ marginTop: 20, alignItems: "center" }}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#FFA500" }]}
                onPress={handleRestart}
              >
                <Text style={styles.btnText}>Restart</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#FF6347", marginTop: 12 }]}
                onPress={() => router.push("/reviewscreen")}
              >
                <Text style={styles.btnText}>Exit</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF7E6", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF7E6" },
  title: { fontSize: 22, fontWeight: "bold", color: "#7A4D00" },
  progress: { color: "#A36A00", marginTop: 6 },
  card: { width: "100%", backgroundColor: "#FFE0B2", padding: 18, borderRadius: 12, marginTop: 18 },
  questionText: { fontSize: 18, color: "#7A4D00", fontWeight: "600", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#7A4D00", borderRadius: 8, padding: 10, fontSize: 16, marginBottom: 12, width: "100%" },
  submitBtn: { paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  submitBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  feedback: { marginTop: 12, fontSize: 16, fontWeight: "bold" },
  btn: { paddingVertical: 12, borderRadius: 10, alignItems: "center", marginTop: 10, width: 220 },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  emptyText: { fontSize: 16, color: "#7A4D00" },
});
