import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import type { Question } from '../app/types';

const { width } = Dimensions.get('window');

interface Props {
  questions: Question[];
  onSwitch: () => void;
}

export default function ReviewScreen({ questions, onSwitch }: Props) {
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);

  const handleNext = () => {
    setShowAnswer(false);
    if (index < questions.length - 1) setIndex(index + 1);
    else setIndex(0);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
      rotate.value = event.translationX / 20;
    },
    onEnd: (event) => {
      if (Math.abs(event.translationX) > 150) {
        runOnJS(handleNext)();
      }
      translateX.value = withSpring(0);
      rotate.value = withSpring(0);
    },
  });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
      { scale: withSpring(1 - Math.abs(translateX.value) / 800) },
    ],
  }));

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noCard}>No flashcards yet!</Text>
        <TouchableOpacity style={styles.button} onPress={onSwitch}>
          <Text style={styles.buttonText}>Go Add One</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const current = questions[index];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, cardStyle]}>
        <Text style={styles.question}>{current.question}</Text>
        {showAnswer && <Text style={styles.answer}>{current.answer}</Text>}
      </Animated.View>

      <TouchableOpacity style={styles.showBtn} onPress={() => setShowAnswer(!showAnswer)}>
        <Text style={styles.showBtnText}>{showAnswer ? 'Hide Answer' : 'Show Answer'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.switchBtn} onPress={onSwitch}>
        <Text style={styles.switchBtnText}>Add More</Text>
      </TouchableOpacity>

      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={StyleSheet.absoluteFillObject} />
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD6A5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: width * 0.8,
    minHeight: 250,
    backgroundColor: '#FFF7E6',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  question: {
    fontSize: 22,
    fontWeight: '600',
    color: '#7A4D00',
    textAlign: 'center',
  },
  answer: {
    fontSize: 20,
    color: '#BF360C',
    marginTop: 15,
    textAlign: 'center',
  },
  noCard: {
    fontSize: 20,
    color: '#7A4D00',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#FFB703',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  showBtn: {
    backgroundColor: '#FB8500',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 20,
  },
  showBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchBtn: {
    marginTop: 15,
  },
  switchBtnText: {
    color: '#7A4D00',
    fontSize: 16,
  },
});
