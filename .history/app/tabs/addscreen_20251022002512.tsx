// app/(tabs)/addscreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { db, auth } from '../../lib/firebase'; // ✅ updated path
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { useRouter } from 'expo-router';

export default function AddScreen() {
  const router = useRouter();
  const [reviewerName, setReviewerName] = useState('');
  const [reviewText, setReviewText] = useState('');

  const handleSave = async () => {
    if (!reviewerName || !reviewText) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'You must be logged in to add a review');
        return;
      }

      await addDoc(collection(db, 'reviews'), {
        reviewerName,
        reviewText,
        createdAt: Timestamp.now(),
        userId: user.uid,
      });

      Alert.alert('Success', 'Review added successfully!');
      router.push('/(tabs)/reviewsection'); // ✅ correct route
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Review</Text>
      <TextInput
        placeholder="Reviewer Name"
        value={reviewerName}
        onChangeText={setReviewerName}
        style={styles.input}
      />
      <TextInput
        placeholder="Review Text"
        value={reviewText}
        onChangeText={setReviewText}
        style={[styles.input, { height: 100 }]}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Review</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF7E6' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#FF9B42',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
