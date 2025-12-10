// app/(tabs)/reviewsection.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { router } from 'expo-router';

interface Reviewer {
  id: string;
  reviewer: string;
  subject: string;
  description: string;
}

export default function ReviewSection() {
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);

  useEffect(() => {
    const fetchReviewers = async () => {
      const querySnapshot = await getDocs(collection(db, 'reviewers'));
      const list: Reviewer[] = [];
      querySnapshot.forEach((doc) =>
        list.push({ id: doc.id, ...doc.data() } as Reviewer)
      );
      setReviewers(list);
    };

    fetchReviewers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reviewers</Text>
      <FlatList
        data={reviewers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/reviewscreen?id=${item.id}`)}>
            <Text style={styles.name}>{item.reviewer}</Text>
            <Text style={styles.subject}>{item.subject}</Text>
            <Text style={styles.desc}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7E6', padding: 15 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 10 },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: { fontWeight: '700', fontSize: 16 },
  subject: { fontSize: 14, color: '#666' },
  desc: { fontSize: 12, color: '#888', marginTop: 5 },
});
