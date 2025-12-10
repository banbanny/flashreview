// app/reviewsection.tsx
import { useFocusEffect } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { db } from '../lib/firebase';
import { getAuth } from 'firebase/auth';
import type { Reviewer } from '../lib/types';

export default function ReviewSection() {
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const auth = getAuth();
  const user = auth.currentUser;

  useFocusEffect(
    useCallback(() => {
      const loadReviewers = async () => {
        if (!user) return;
        try {
          const ref = collection(db, 'users', user.uid, 'reviewers');
          const snapshot = await getDocs(ref);
          const list: Reviewer[] = snapshot.docs.map(doc => ({
            ...(doc.data() as any),
            firestoreId: doc.id,
          }));
          setReviewers(list);
        } catch (error) {
          console.error('Error loading reviewers:', error);
        }
      };
      loadReviewers();
    }, [user])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Reviewers</Text>
      <FlatList
        data={reviewers}
        keyExtractor={item => item.firestoreId!}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardCount}>{item.questions.length} questions</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFD6A5', padding: 20 },
  title: { fontSize: 30, fontWeight: 'bold', color: '#7A4D00', marginTop: 40, marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#FFF7E6', padding: 15, borderRadius: 12, marginBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#7A4D00' },
  cardCount: { fontSize: 14, color: '#555' },
});
