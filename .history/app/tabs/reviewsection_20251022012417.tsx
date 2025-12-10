// app/(tabs)/reviewsection.tsx
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Question } from '../../lib/types';

export default function ReviewSection() {
  const params = useLocalSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (params?.questions) {
      try {
        const parsed = JSON.parse(params.questions as string) as Question[];
        setQuestions(parsed);
        setIndex(0);
      } catch (e) {
        Alert.alert('Error', 'Unable to parse questions.');
      }
    } else {
      // no incoming questions param — show placeholder / hint
      setQuestions([]);
    }
  }, [params]);

  const next = () => {
    setIndex((i) => Math.min(i + 1, questions.length - 1));
  };
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Review</Text>

      {questions.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No questions passed. Select a reviewer from Home or create one in Create tab.</Text>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.qLabel}>Question {index + 1} / {questions.length}</Text>
          <Text style={styles.question}>{questions[index].question}</Text>

          <View style={{ marginTop: 12 }}>
            <Text style={styles.answerLabel}>Answer</Text>
            <Text style={styles.answer}>{questions[index].answer}</Text>
          </View>

          <View style={styles.controls}>
            <Button title="Previous" onPress={prev} disabled={index === 0} />
            <Button title="Next" onPress={next} disabled={index === questions.length - 1} />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  emptyBox: { padding: 20, backgroundColor: '#fff5e6', borderRadius: 10 },
  emptyText: { textAlign: 'center', color: '#666' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 10 },
  qLabel: { fontWeight: '600', color: '#444' },
  question: { fontSize: 18, marginTop: 8 },
  answerLabel: { marginTop: 10, fontWeight: '600' },
  answer: { marginTop: 6, fontSize: 16, color: '#333' },
  controls: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
});
