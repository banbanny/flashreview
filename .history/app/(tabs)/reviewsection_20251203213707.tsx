import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
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
      const reviewerId = await AsyncStorage.getItem("currentReviewerId");
      const key = await AsyncStorage.getItem("currentReviewerKey");
      if (!reviewerId || !key) {
        Alert.alert("Error", "Reviewer data missing.");
        router.replace("/(tabs)/reviewscreen");
        return;
      }

      const stored = await AsyncStorage.getItem(key);
      const parsed = stored ? JSON.parse(stored) : [];
      const found = parsed.find((item: any) => item.id === reviewerId);

      if (!found) {
        Alert.alert("Not Found", "Reviewer no longer exists.");
        router.replace("/(tabs)/reviewscreen");
        return;
      }

      const shuffled = found.questions.sort(() => Math.random() - 0.5);
      console.log("Loaded reviewers:", parsed);
console.log("Looking for reviewerId:", reviewerId, "found:", found);

      setReviewer(found);
      setQuestions(shuffled);
    } catch (err) {
      console.error("Load reviewer failed:", err);
      Alert.alert("Error", "Failed to load reviewer.");
      router.replace("/(tabs)/reviewscreen");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!userAnswer.trim()) return;

    const correctAnswer = questions[index].answer.trim().toLowerCase();
    const givenAnswer = userAnswer.trim().toLowerCase();

    if (givenAnswer === correctAnswer) {
      setFeedback("✅ Correct!");
      setScore((prev) => prev + 1);
    } else {
      setFeedback(`❌ Wrong! Correct: ${questions[index].answer}`);
    }

    // Move to next question after 1.5s
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
    // Only clear temporary session — keep all reviewers intact
    await AsyncStorage.removeItem("currentReviewerId");
    await AsyncStorage.removeItem("currentReviewerKey");

    Alert.alert("Review Complete", "You’ve finished reviewing this set!", [
      {
        text: "OK",
        onPress: () => router.replace("/(tabs)/reviewscreen"),
      },
    ]);
  } catch (err) {
    console.error(err);
    Alert.alert("Error", "Something went wrong while finishing the review.");
  }
};
  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7A4D00" />
      </View>
    );

  if (!reviewer)
    return (
      <View style={styles.center}>
        <Text>No reviewer found.</Text>
      </View>
    );

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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{reviewer.title}</Text>

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
