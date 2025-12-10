import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { saveReviewer } from '../../lib/reviewers';
import { Question, Reviewer } from '../../lib/types';

export default function AddScreen() {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const router = useRouter();

  const addQuestion = () => {
    if (currentQuestion && currentAnswer) {
      setQuestions([
        ...questions,
        { id: Math.random().toString(), question: currentQuestion, answer: currentAnswer },
      ]);
      setCurrentQuestion('');
      setCurrentAnswer('');
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title.');
      return;
    }
    if (questions.length === 0) {
      Alert.alert('Error', 'Please add at least one question.');
      return;
    }
    try {
      const reviewer: Omit<Reviewer, 'firestoreId'> = {
        id: Math.random().toString(),
        title: title.trim(),
        questions,
      };
      await saveReviewer(reviewer);
      Alert.alert('Success', 'Reviewer saved!');
      setTitle('');
      setQuestions([]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save reviewer.');
    }
  };

  const handleReview = () => {
    if (questions.length > 0) {
      router.push({
        pathname: '/reviewscreen' as any,
        params: { questions: JSON.stringify(questions) },
      });
    } else {
      alert('Please add at least one question.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Reviewer Title:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter title"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Question:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter question"
        value={currentQuestion}
        onChangeText={setCurrentQuestion}
      />

      <Text style={styles.label}>Answer:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter answer"
        value={currentAnswer}
        onChangeText={setCurrentAnswer}
      />

      <Button title="Add Question" onPress={addQuestion} />

      {questions.length > 0 && (
        <View style={styles.questionsList}>
          <Text style={styles.listTitle}>Questions Added:</Text>
          {questions.map((q) => (
            <Text key={q.id} style={styles.questionItem}>{q.question}</Text>
          ))}
        </View>
      )}

      <Button title="Start Review" onPress={handleReview} color="#FF8C00" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontWeight: 'bold', marginTop: 10 },
  input: { borderWidth: 1, padding: 8, borderRadius: 5, marginBottom: 10 },
  questionsList: { marginTop: 20 },
  listTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  questionItem: { backgroundColor: '#f0f0f0', padding: 8, borderRadius: 5, marginBottom: 5 },
});
