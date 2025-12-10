import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function ReviewSection() {
  const [reviewer, setReviewer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadReviewer();
  }, []);

  const loadReviewer = async () => {
    try {
      setLoading(true);
      const reviewerId = await AsyncStorage.getItem("currentReviewerId");
      const key = await AsyncStorage.getItem("currentReviewerKey");

      if (!reviewerId || !key) {
        router.replace("/(tabs)/reviewscreen");
        return;
      }

      const stored = await AsyncStorage.getItem(key);
      const parsed = stored ? JSON.parse(stored) : [];
      const found = parsed.find((item: any) => item.id === reviewerId);

      if (!found || !found.questions || found.questions.length === 0) {
        Alert.alert("No Questions", "This reviewer has no questions.");
        router.replace("/(tabs)/reviewscreen");
        return;
      }

      const shuffled = [...found.questions].sort(() => Math.random() - 0.5);
      setReviewer(found);
      setQuestions(shuffled);
      setIndex(0);
      setUserAnswer("");
      setScore(0);
      setFeedback(null);
      setIsFinished(false);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load reviewer.");
      router.replace("/(tabs)/reviewscreen");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!userAnswer.trim() || !questions[index]) return;

    const correctAnswer = questions[index].answer.trim().toLowerCase();
    const givenAnswer = userAnswer.trim().toLowerCase();

    if (givenAnswer === correctAnswer) {
      setFeedback("✅ Correct!");
      setScore((prev) => prev + 1);
    } else {
      setFeedback(`❌ Wrong! Correct: ${questions[index].answer}`);
    }

    setTimeout(() => {
      setFeedback(null);
      setUserAnswer("");
      if (index < questions.length - 1) {
        setIndex((prev) => prev + 1);
      } else {
        setIsFinished(true);
      }
    }, 1500);
  };

  const handleDone = async () => {
    try {
      await AsyncStorage.removeItem("currentReviewerId");
      await AsyncStorage.removeItem("currentReviewerKey");
      router.replace("/(tabs)/reviewscreen");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong while finishing the review.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7A4D00" />
        <Text style={{ marginTop: 10, color: "#7A4D00" }}>Loading reviewer...</Text>
      </View>
    );
  }

  if (!reviewer) {
    return (
      <View style={styles.center}>
        <Text>No reviewer found.</Text>
      </View>
    );
  }

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <View style={styles.center}>
        <Text style={styles.doneText}>
          🎯 You scored {score}/{questions.length} ({percentage}%)
        </Text>
        <Text style={styles.resultText}>
          {passed ? "🎉 You passed!" : "😔 You did not pass. Try again!"}
        </Text>
        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneBtnText}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const current = questions[index];

  if (!current) {
    return (
      <View style={styles.center}>
        <Text>No question found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{reviewer.title || "Reviewer"}</Text>

      <View style={styles.card}>
        <Text style={styles.qNumber}>
          Question {index + 1} of {questions.length}
        </Text>
        <Text style={styles.question}>{current.question}</Text>

        <TextInput
          placeholder="Type your answer..."
          value={userAnswer}
          onChangeText={setUserAnswer}
          onSubmitEditing={handleSubmit}
          style={styles.input}
        />

        {feedback && <Text style={styles.feedback}>{feedback}</Text>}

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={!userAnswer.trim()}
        >
          <Text style={styles.btnText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF7E6", padding: 20 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#7A4D00",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFE0B2",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  qNumber: { color: "#7A4D00", fontWeight: "bold" },
  question: { fontSize: 18, color: "#333", marginVertical: 10 },
  input: {
    backgroundColor: "#FFF",
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  feedback: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  submitBtn: {
    backgroundColor: "#2E8B57",
    padding: 10,
    marginTop: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#FFF", fontWeight: "bold" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  doneText: { fontSize: 20, fontWeight: "bold", color: "#7A4D00", marginBottom: 10 },
  resultText: { fontSize: 18, color: "#A36A00", marginBottom: 20 },
  doneButton: {
    backgroundColor: "#2E8B57",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  doneBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
