// components/ReviewScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Question } from '../App';

interface Props {
  questions: Question[];
  onSwitch: () => void;
}

export default function ReviewScreen({ questions, onSwitch }: Props) {
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // shuffle once when `questions` changes
  const deck = useMemo(() => {
    const copy = [...questions];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    setIndex(0);
    setShowAnswer(false);
    return copy;
  }, [questions]);

  useEffect(() => {
    // reset when questions list changes
    setIndex(0);
    setShowAnswer(false);
  }, [deck.length]);

  if (deck.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No questions yet.</Text>
        <View style={{ height: 12 }} />
        <Button title="Add Questions" onPress={onSwitch} />
      </View>
    );
  }

  const current = deck[index];

  const next = () => {
    setShowAnswer(false);
    setIndex((i) => (i + 1) % deck.length);
  };

  const prev = () => {
    setShowAnswer(false);
    setIndex((i) => (i - 1 + deck.length) % deck.length);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.counter}>{index + 1} / {deck.length}</Text>

      <View style={styles.card}>
        <Text style={styles.questionText}>{current.question}</Text>

        {showAnswer ? (
          <Text style={styles.answerText}>{current.answer}</Text>
        ) : null}
      </View>

      <View style={styles.row}>
        <Button title="Prev" onPress={prev} />
        <View style={{ width: 10 }} />
        <TouchableOpacity style={styles.revealBtn} onPress={() => setShowAnswer((s) => !s)}>
          <Text style={styles.revealText}>{showAnswer ? 'Hide Answer' : 'Show Answer'}</Text>
        </TouchableOpacity>
        <View style={{ width: 10 }} />
        <Button title="Next" onPress={next} />
      </View>

      <View style={{ height: 12 }} />
      <Button title="Add More" onPress={onSwitch} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, padding: 20, alignItems: 'center' },
  counter: { alignSelf: 'flex-start', color: '#666' },
  card: {
    width: '100%',
    minHeight: 180,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    marginTop: 12,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  questionText: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
  answerText: { marginTop: 14, fontSize: 18, color: 'green', textAlign: 'center' },
  row: { flexDirection: 'row', marginTop: 20, alignItems: 'center' },
  revealBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007aff',
  },
  revealText: { color: '#007aff', fontWeight: '600' },
});
