// app/tabs/reviewsection.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import type { Question } from '../../lib/types';

type ReviewScreenRouteProp = RouteProp<RootStackParamList, 'ReviewScreen'>;
type ReviewScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ReviewScreen'>;

export default function ReviewSection() {
  const route = useRoute<ReviewScreenRouteProp>();
  const navigation = useNavigation<ReviewScreenNavigationProp>();
  const { questions } = route.params;

  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const current = questions[index];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Review</Text>

      <Text style={styles.counter}>
        Question {index + 1} of {questions.length}
      </Text>

      <Text style={styles.question}>{current.question}</Text>

      {showAnswer && <Text style={styles.answer}>Answer: {current.answer}</Text>}

      <Button
        title={showAnswer ? 'Hide Answer' : 'Show Answer'}
        onPress={() => setShowAnswer(!showAnswer)}
      />

      <View style={styles.navButtons}>
        {index > 0 && (
          <Button title="Previous" onPress={() => setIndex(index - 1)} />
        )}
        {index < questions.length - 1 && (
          <Button title="Next" onPress={() => {
            setIndex(index + 1);
            setShowAnswer(false);
          }} />
        )}
      </View>

      <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#FFF7E0' },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  counter: { fontSize: 16, textAlign: 'center', color: '#7A4D00' },
  question: { fontSize: 18, textAlign: 'center', marginVertical: 20 },
  answer: { fontSize: 18, textAlign: 'center', color: 'green', marginVertical: 10 },
  navButtons: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
});
