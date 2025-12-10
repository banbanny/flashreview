// app/index.tsx

import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../lib/firebase';
import type { Reviewer } from '../lib/types';

export default function IndexScreen() {
  const router = useRouter();
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const auth = getAuth();
  const user = auth.currentUser;

  // Load reviewers when screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadReviewers = async () => {
        if (!user) {
          router.replace('/login');
          return;
        }

        try {
          const ref = collection(db, 'users', user.uid, 'reviewers');
          const snapshot = await getDocs(ref);
          const list: Reviewer[] = snapshot.docs.map(doc => ({
                ...(doc.data() as any),
                firestoreId: doc.id, // ensure this comes last
              }));
          setReviewers(list);
        } catch (error) {
          console.error('❌ Error loading reviewers:', error);
        }
      };

      loadReviewers();
    }, [user])
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
      Alert.alert('Logged Out');
    } catch (error) {
      console.error('❌ Sign-out error:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  // 🔧 Fix: Separate confirm + delete logic
  const confirmDelete = (docId: string) => {
    console.log('confirmDelete called with docId:', docId);
    Alert.alert('Delete Reviewer', 'Are you sure you want to delete this reviewer?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => handleDelete(docId) },
    ]);
  };

  const handleDelete = async (docId: string) => {
    console.log('handleDelete called with docId:', docId);
    if (!user) {
      console.error('❌ No user logged in');
      Alert.alert('Error', 'No user logged in');
      return;
    }
    console.log('Deleting reviewer for user:', user.uid, 'docId:', docId);

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'reviewers', docId));
      console.log('✅ Successfully deleted from Firestore');
      setReviewers(prev => prev.filter(r => r.firestoreId !== docId));
      console.log('✅ Updated local state');
    } catch (error) {
      console.error('❌ Failed to delete reviewer:', error);
      Alert.alert('Error', 'Failed to delete reviewer');
    }
  };

  const editReviewer = (r: Reviewer) => {
    router.push({ pathname: '/addscreen', params: { editReviewer: JSON.stringify(r) } });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Reviewers</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={reviewers}
        keyExtractor={item => item.firestoreId!}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.reviewBtn}
                onPress={() =>
                  router.push({
                    pathname: '/reviewscreen',
                    params: { questions: JSON.stringify(item.questions) },
                  })
                }>
                <Text style={styles.btnText}>Review</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.editBtn} onPress={() => editReviewer(item)}>
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item.firestoreId!)}>
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/addscreen')}>
        <Text style={styles.btnText}>+ Create New Reviewer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFD6A5', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 40, fontWeight: 'bold', color: '#7A4D00', marginBottom: 10, marginTop: 40, textAlign: 'center' },
  card: { backgroundColor: '#FFF7E6', padding: 15, borderRadius: 15, marginBottom: 10 },
  cardTitle: { fontSize: 18, color: '#7A4D00', fontWeight: '600' },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  reviewBtn: { backgroundColor: '#FB8500', padding: 8, borderRadius: 8 },
  editBtn: { backgroundColor: '#FFB703', padding: 8, borderRadius: 8 },
  deleteBtn: { backgroundColor: '#D62828', padding: 8, borderRadius: 8 },
  addBtn: { backgroundColor: '#219EBC', padding: 20, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D62828', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});
