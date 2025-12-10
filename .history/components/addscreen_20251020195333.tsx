import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import type { Question, Reviewer } from '../app/types';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../App';

type AddScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddScreen'>;
type AddScreenRouteProp = RouteProp<RootStackParamList, 'AddScreen'>;

interface Props {
  route: AddScreenRouteProp;
  navigation: AddScreenNavigationProp;
}

export default function AddScreen({ route, navigation }: Props) {
  const editReviewer = route.params?.editReviewer;

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
    if (!title || questions.length === 0) return Alert.alert('Add a title and questions first');

    const newReviewer: Reviewer = {
      id: editReviewer ? editReviewer.id : String(uuid.v4()),
      title,
      questions,
    };

    const stored = await AsyncStorage.getItem('reviewers');
    const list: Reviewer[] = stored ? JSON.parse(stored) : [];

    if (editReviewer) {
      const updated = list.map(r => (r.id === editReviewer.id ? newReviewer : r));
      await AsyncStorage.setItem('reviewers', JSON.stringify(updated));
    } else {
      list.push(newReviewer);
      await AsyncStorage.setItem('reviewers', JSON.stringify(list));
    }

    Alert.alert('Saved!', 'Reviewer has been saved.');
    navigation.navigate('Home');
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#FFD6A5' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#7A4D00' },
  input: { backgroundColor: '#FFF7E6', padding: 10, borderRadius: 10, marginVertical: 6 },
  addBtn: { backgroundColor: '#FB8500', padding: 12, borderRadius: 10, marginTop: 10, alignItems: 'center' },
  saveBtn: { backgroundColor: '#FFB703', padding: 12, borderRadius: 10, marginTop: 20, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  card: { backgroundColor: '#FFF', padding: 10, borderRadius: 10, marginTop: 10 },
  delBtn: { marginTop: 5, backgroundColor: '#D62828', padding: 5, borderRadius: 5, alignSelf: 'flex-end' },
  delBtnText: { color: '#fff', fontWeight: 'bold' },
});
