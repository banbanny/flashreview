import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddQuestionScreen from '../components/addscreen';
import ReviewScreen from '../components/ReviewScreen';

export interface Question {
  id: string;
  question: string;
  answer: string;
}

export default function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [screen, setScreen] = useState<'add' | 'review'>('add');

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const raw = await AsyncStorage.getItem('@flashreview:questions');
      if (raw) setQuestions(JSON.parse(raw));
    } catch (e) {
      console.warn('Failed to load questions', e);
    }
  };

  const saveQuestion = async (q: Omit<Question, 'id'>) => {
    const newQ: Question = { ...q, id: `${Date.now()}` };
    const updated = [...questions, newQ];
    setQuestions(updated);
    try {
      await AsyncStorage.setItem('@flashreview:questions', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save question', e);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {screen === 'add' ? (
        <AddQuestionScreen onSave={saveQuestion} onSwitch={() => setScreen('review')} />
      ) : (
        <ReviewScreen questions={questions} onSwitch={() => setScreen('add')} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});
