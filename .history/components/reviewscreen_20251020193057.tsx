import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  TextInput, 
  Alert 
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
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
    if (index < questions.length - 1) setIndex(index + 1);
    else setIndex(0);
  };

  const startEdit = () => {
    setEditQ(questions[index].question);
    setEditA(questions[index].answer);
    setIsEditing(true);
  };

  const handleEdit = () => {
    const updated = [...questions];
    updated[index] = { question: editQ, answer: editA };
    setQuestions(updated);
    setIsEditing(false);
    Alert.alert('Updated', 'Flashcard has been updated successfully!');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Flashcard',
      'Are you sure you want to delete this flashcard?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updated = questions.filter((_, i) => i !== index);
            setQuestions(updated);
            setIndex((prev) => (prev > 0 ? prev - 1 : 0));
            setShowAnswer(false);
          },
        },
      ]
    );
  };

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      rotate.value = event.translationX / 20;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > 150) {
        runOnJS(handleNext)();
      }
      translateX.value = withSpring(0);
      rotate.value = withSpring(0);
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
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.card, cardStyle]}>
          {isEditing ? (
            <>
              <TextInput
                style={styles.input}
                value={editQ}
                onChangeText={setEditQ}
                placeholder="Edit question"
              />
              <TextInput
                style={[styles.input, { marginTop: 10 }]}
                value={editA}
                onChangeText={setEditA}
                placeholder="Edit answer"
              />
              <TouchableOpacity style={styles.saveBtn} onPress={handleEdit}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.question}>{current.question}</Text>
              {showAnswer && <Text style={styles.answer}>{current.answer}</Text>}
            </>
          )}
        </Animated.View>
      </GestureDetector>

      {!isEditing && (
        <>
          <TouchableOpacity style={styles.showBtn} onPress={() => setShowAnswer(!showAnswer)}>
            <Text style={styles.showBtnText}>
              {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </Text>
          </TouchableOpacity>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.editBtn} onPress={startEdit}>
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
              <Text style={styles.actionText}>Delete</Text>
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
  actions: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 15,
  },
  editBtn: {
    backgroundColor: '#FFD166',
    padding: 10,
    borderRadius: 10,
  },
  deleteBtn: {
    backgroundColor: '#EF476F',
    padding: 10,
    borderRadius: 10,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#FFF',
    width: '90%',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  saveBtn: {
    backgroundColor: '#06D6A0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 15,
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
  },
});
