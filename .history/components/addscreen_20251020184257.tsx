// components/AddQuestionScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Question } from '../App';

interface Props {
  onSave: (q: Omit<Question, 'id'>) => void;
  onSwitch: () => void;
}

export default function AddQuestionScreen({ onSave, onSwitch }: Props) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSave = () => {
    if (!question.trim() || !answer.trim()) {
      Alert.alert('Please fill both fields');
      return;
    }
    onSave({ question: question.trim(), answer: answer.trim() });
    setQuestion('');
    setAnswer('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Add Question</Text>

        <TextInput
          style={styles.input}
          placeholder="Question"
          value={question}
          onChangeText={setQuestion}
          multiline
        />

        <TextInput
          style={[styles.input, { minHeight: 80 }]}
          placeholder="Answer"
          value={answer}
          onChangeText={setAnswer}
          multiline
        />

        <View style={styles.buttonRow}>
          <Button title="Save" onPress={handleSave} />
          <View style={{ width: 12 }} />
          <Button title="Go to Review" onPress={onSwitch} />
        </View>

        <View style={{ height: 40 }} />
        <Text style={styles.hint}>Saved questions will appear shuffled in Review.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'stretch' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  hint: { textAlign: 'center', color: '#666' },
});
