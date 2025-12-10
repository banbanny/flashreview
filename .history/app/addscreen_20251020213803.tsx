import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import uuid from 'react-native-uuid';
import type { Question, Reviewer } from './types';
import { db } from '../lib/firebase';
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../lib/auth';

export default function AddScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const editReviewer = params.editReviewer ? JSON.parse(params.editReviewer as string) : null;
  const { user } = useAuth();

  const [title, setTitle] = useState(editReviewer ? editReviewer.title : '');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [questions, setQuestions] = useState<Question[]>(editReviewer ? editReviewer.questions : []);

  const addQuestion = () => {
    if (!question || !answer) return Alert.alert('Please fill in both fields');
    setQuestions(prev => [...prev, { id: String(uuid.v4()), question, answer }]);
    setQuestion('');
    setAnswer('');
  };

  const saveReviewer = async () => {
    if (!user) return Alert.alert('You must be logged in to save a reviewer.');
    if (!title || questions.length === 0) return Alert.alert('Add a title and questions first');

    try {
      const newReviewer: Reviewer = {
        id: editReviewer ? editReviewer.id : String(uuid.v4()),
        title,
        questions,
      };

      if (editReviewer && editReviewer.firestoreId) {
        // 🟢 Update existing reviewer in Firestore
        const docRef = doc(db, 'reviewers', editReviewer.firestoreId);
        await updateDoc(docRef, {
          title: newReviewer.title,
          questions: newReviewer.questions,
        });
      } else {
        // 🟢 Add new reviewer with current user's UID
        await addDoc(collection(db, 'reviewers'), {
          title,
          questions,
          userId: user.uid,
          createdAt: new Date(),
        });
      }

      Alert.alert('Saved!', 'Reviewer has been saved.');
      router.replace('/'); // Go back to home
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save reviewer.');
    }
  };

  const deleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{editReviewer ? 'Edit Reviewer' : 'Create Reviewer'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Reviewer Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Question"
        value={question}
        onChangeText={setQuestion}
      />
      <TextInput
        style={styles.input}
        placeholder="Answer"
        value={answer}
        onChangeText={setAnswer}
      />
      <TouchableOpacity style={styles.addBtn} onPress={addQuestion}>
        <Text style={styles.btnText}>Add Question</Text>
      </TouchableOpacity>

      {questions.map((q, idx) => (
        <View key={q.id} style={styles.card}>
          <Text>{idx + 1}. {q.question}</Text>
          <Text style={{ color: 'gray' }}>{q.answer}</Text>
          <TouchableOpacity onPress={() => deleteQuestion(q.id)} style={styles.delBtn}>
            <Text style={styles.delBtnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.saveBtn} onPress={saveReviewer}>
        <Text style={styles.btnText}>Save Reviewer</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.btnText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#FFD6A5' },
  title: { fontSize: 40, fontWeight: 'bold', marginBottom: 10, color: '#7A4D00', marginTop: 40, textAlign: 'center' },
  input: { backgroundColor: '#FFF7E6', padding: 18, borderRadius: 10, marginVertical: 6 },
  addBtn: { backgroundColor: '#FB8500', padding: 12, borderRadius: 10, marginTop: 10, alignItems: 'center' },
  saveBtn: { backgroundColor: '#FFB703', padding: 12, borderRadius: 10, marginTop: 20, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 10, borderRadius: 10, marginTop: 10 },
  delBtn: { marginTop: 5, backgroundColor: '#D62828', padding: 5, borderRadius: 5, alignSelf: 'flex-end' },
  delBtnText: { color: '#fff', fontWeight: 'bold' },
  backBtn: { backgroundColor: '#219EBC', padding: 12, borderRadius: 10, marginTop: 20, alignItems: 'center' },
});
