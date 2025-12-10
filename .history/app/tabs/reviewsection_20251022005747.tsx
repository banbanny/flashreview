// app/tabs/reviewsection.tsx
import { Href, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { deleteReviewer, loadReviewers } from '../../lib/reviewers';
import { Reviewer } from '../../lib/types';

export default function ReviewSection() {
  const router = useRouter();
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);

  useEffect(() => {
    loadReviewersList();
  }, []);

  const loadReviewersList = async () => {
    try {
      const loaded = await loadReviewers();
      setReviewers(loaded);
    } catch (error) {
      Alert.alert('Error', 'Failed to load reviewers.');
    }
  };

  const handleReview = (reviewer: Reviewer) => {
    router.push({
      pathname: '/reviewscreen' as any,
      params: { questions: JSON.stringify(reviewer.questions) },
    });
  };

  const handleDelete = async (firestoreId: string) => {
    Alert.alert(
      'Delete Reviewer',
      'Are you sure you want to delete this reviewer?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReviewer(firestoreId);
              loadReviewersList();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete reviewer.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Reviewers</Text>
      <FlatList
        data={reviewers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.reviewerItem}>
            <TouchableOpacity onPress={() => handleReview(item)} style={styles.reviewerContent}>
              <Text style={styles.reviewerTitle}>{item.title}</Text>
              <Text style={styles.reviewerCount}>{item.questions.length} questions</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.firestoreId!)} style={styles.deleteBtn}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No reviewers yet. Create one!</Text>}
      />
      <Button
        title="Create New Reviewer"
        onPress={() => router.push('/(tabs)/addscreen' as Href)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  reviewerItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', padding: 15, marginBottom: 10, borderRadius: 10 },
  reviewerContent: { flex: 1 },
  reviewerTitle: { fontSize: 18, fontWeight: 'bold' },
  reviewerCount: { fontSize: 14, color: '#666' },
  deleteBtn: { backgroundColor: '#ff4444', padding: 10, borderRadius: 5 },
  deleteText: { color: '#fff', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', fontSize: 16, color: '#666', marginBottom: 20 },
});
