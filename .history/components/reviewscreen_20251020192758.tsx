import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput, Alert } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import type { Question } from '../app/types';

const { width } = Dimensions.get('window');

interface Props {
  questions: Question[];
  onSwitch: () => void;
}

export default function ReviewScreen({ questions: initialQuestions, onSwitch }: Props) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editQ, setEditQ] = useState('');
  const [editA, setEditA] = useState('');

  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);

  const handleNext = () => {
    setShowAnswer(false);
    setIsEditing(false);
    if (index < questions.length - 1) setIndex(index + 1);
    else setIndex(0);
  };

  const handleDelete = () => {
    Alert.alert('Delete', 'Are you sure you want to delete this card?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updated = questions.filter((_, i) => i !== index);
          setQuestions(updated);
          setIndex((prev) => (prev >= updated.length ? 0 : prev));
        },
      },
    ]);
  };

  const handleEdit = () => {
    const updated = [...questions];
    updated[index] = { question: editQ, answer: editA };
    setQuestions(updated);
    setIsEditing(false);
  };

  const startEdit = () => {
    setEditQ(questions[index].question);
    setEditA(questions[index].answer);
    setIsEditing(true);
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
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.card, cardStyle]}>
          {isEditing ? (
            <>
              <TextInput
                value={editQ}
                onChangeText={setEditQ}
                style={styles.input}
                placeholder="Edit question"
              />
              <TextInput
                value={editA}
                onChangeText={setEditA}
                style={styles.input}
                placeholder="Edit answer"
              />
              <TouchableOpacity style={styles.saveBtn} onPress={handleEdit}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.question}>{current.question}</Text>
              {showAnswer && <Text style={styles.answer}>{current.answer}</Text>}
            </>
          )}
        </Animated.View>
      </PanGestureHandler>

      {!isEditing && (
        <>
          <TouchableOpacity style={styles.showBtn} onPress={() => setShowAnswer(!showAnswer)}>
            <Text style={styles.showBtnText}>{showAnswer ? 'Hide Answer' : 'Show Answer'}</Text>
          </TouchableOpacity>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.editBtn} onPress={startEdit}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.switchBtn} onPress={onSwitch}>
            <Text style={styles.switchBtnText}>Add More</Text>
          </TouchableOpacity>
        </>
      )}
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
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#BF360C',
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#fff',
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
  actionRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 15,
  },
  editBtn: {
    backgroundColor: '#FFB703',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  editText: {
    color: '#fff',
    fontWeight: '600',
  },
  deleteBtn: {
    backgroundColor: '#E63946',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#06D6A0',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 10,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
