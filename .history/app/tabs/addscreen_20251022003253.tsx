// app/tabs/addscreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import type { Question } from '../../lib/types';

type AddScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddScreen'>;

export default function AddScreen() {
  const navigation = useNavigation<AddScreenNavigationProp>();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');

  const addQuestion = () => {
    if (currentQuestion.trim() && currentAnswer.trim()) {
      setQuestions(prev => [
        ...prev,
        { id: Date.now().toString(), question: currentQuestion, answer: currentAnswer },
      ]);
      setCurrentQuestion('');
      setCurrentAnswer('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Reviewer</Text>

      <TextInput
        style={styles.input}
        placeholder="Reviewer Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter a question"
        value={currentQuestion}
        onChangeText={setCurrentQuestion}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter the answer"
        value={currentAnswer}
        onChangeText={setCurrentAnswer}
      />

      <Button title="Add Question" onPress={addQuestion} />

      <Text style={styles.preview}>Questions Added: {questions.length}</Text>

      <Button
        title="Start Review"
        disabled={questions.length === 0}
        onPress={() => navigation.navigate('ReviewScreen', { questions })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF7E0' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#B57F00',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  preview: { marginVertical: 10, fontSize: 16, color: '#7A4D00' },
});
