// app/(tabs)/addscreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { router } from 'expo-router';

export default function AddScreen() {
  const [reviewer, setReviewer] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    if (!reviewer || !subject || !description) {
      Alert.alert('Please fill in all fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'reviewers'), {
        reviewer,
        subject,
        description,
        createdAt: new Date(),
      });

      Alert.alert('Reviewer added!');
      router.push('/(tabs)/reviewsection');
    } catch (err) {
      console.error(err);
      Alert.alert('Error saving data.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Reviewer</Text>
      <TextInput
        placeholder="Reviewer Name"
        style={styles.input}
        value={reviewer}
        onChangeText={setReviewer}
      />
      <TextInput
        placeholder="Subject"
        style={styles.input}
        value={subject}
        onChangeText={setSubject}
      />
      <TextInput
        placeholder="Description"
        style={[styles.input, { height: 80 }]}
        multiline
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Save Reviewer" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF7E6' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
});
