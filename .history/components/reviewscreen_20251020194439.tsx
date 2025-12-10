import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import type { Question } from '../app/types';

const { width } = Dimensions.get('window');

export default function ReviewScreen({ route }) {
  const { questions } = route.params;
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shuffled, setShuffled] = useState<Question[]>([]);

  useEffect(() => {
    setShuffled([...questions].sort(() => Math.random() - 0.5));
  }, [questions]);

  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);

  const handleNext = () => {
    setShowAnswer(false);
    if (index < shuffled.length - 1) setIndex(index + 1);
    else setIndex(0);
  };

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
      { scale: withSpring(1 - Math.abs(translateX.value) / 800) },
    ],
  }));

  if (shuffled.length === 0)
    return <View style={styles.container}><Text>No flashcards yet!</Text></View>;

  const current = shuffled[index];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, cardStyle]}>
        <Text style={styles.question}>{current.question}</Text>
        {showAnswer && <Text style={styles.answer}>{current.answer}</Text>}
      </Animated.View>

      <TouchableOpacity style={styles.showBtn} onPress={() => setShowAnswer(!showAnswer)}>
        <Text style={styles.showBtnText}>{showAnswer ? 'Hide Answer' : 'Show Answer'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
        <Text style={styles.showBtnText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFD6A5', alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { width: width * 0.8, minHeight: 250, backgroundColor: '#FFF7E6', borderRadius: 20, padding: 20, alignItems: 'center', justifyContent: 'center', elevation: 10 },
  question: { fontSize: 22, fontWeight: '600', color: '#7A4D00', textAlign: 'center' },
  answer: { fontSize: 20, color: '#BF360C', marginTop: 15, textAlign: 'center' },
  showBtn: { backgroundColor: '#FB8500', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 10, marginTop: 20 },
  showBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  nextBtn: { backgroundColor: '#FFB703', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 10, marginTop: 10 },
});
