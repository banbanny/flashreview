// app/(tabs)/reviewsection.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db } from '../../lib/firebase'; // ✅ updated path
import { collection, getDocs } from 'firebase/firestore';

export default function ReviewSection() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const snapshot = await getDocs(collection(db, 'reviews'));
      setReviews(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchReviews();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Reviews</Text>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.reviewBox}>
            <Text style={styles.name}>{item.reviewerName}</Text>
            <Text>{item.reviewText}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7E6', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  reviewBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#FF9B42',
  },
  name: { fontWeight: 'bold', marginBottom: 5 },
});
