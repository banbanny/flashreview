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

cconst styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE8C2', // warm light orange
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  button: {
    backgroundColor: '#FFB703',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

});
