// app/index.tsx
import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Reviewer } from '../lib/types';
import uuid from 'react-native-uuid';

export default function HomeScreen() {
  const router = useRouter();
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const auth = getAuth();
  const user = auth.currentUser;

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        if (!user) {
          router.replace('/login');
          return;
        }
        try {
          const ref = collection(db, 'users', user.uid, 'reviewers');
          const snapshot = await getDocs(ref);
          const list: Reviewer[] = snapshot.docs.map(docSnap => ({
            firestoreId: docSnap.id,
            id: String(uuid.v4()),
            ...docSnap.data(),
          })) as Reviewer[];
          setReviewers(list);
        } catch (error) {
          console.error(error);
        }
      };
      load();
    }, [user])
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Logged out', 'You have been signed out.');
      router.replace('/login');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to log out');
    }
  };

  const deleteReviewer = async (r: Reviewer) => {
    if (!user || !r.firestoreId) return;
    Alert.alert('Confirm Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteDoc(doc(db, 'users', user.uid, 'reviewers', r.firestoreId));
          setReviewers(prev => prev.filter(rv => rv.firestoreId !== r.firestoreId));
        },
      },
    ]);
  };

  const editReviewer = (r: Reviewer) => {
    router.push({ pathname: '/addscreen', params: { editReviewer: JSON.stringify(r) } });
  };

  const reviewReviewer = (r: Reviewer) => {
    router.push({ pathname: '/reviewscreen', params: { questions: JSON.stringify(r.questions) } });
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
        keyExtractor={(item) => item.firestoreId!}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.reviewBtn} onPress={() => reviewReviewer(item)}>
                <Text style={styles.btnText}>Review</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editBtn} onPress={() => editReviewer(item)}>
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteReviewer(item)}>
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
  title: { fontSize: 40, fontWeight: 'bold', color: '#7A4D00', textAlign: 'center', marginTop: 40 },
  card: { backgroundColor: '#FFF7E6', padding: 15, borderRadius: 15, marginBottom: 10 },
  cardTitle: { fontSize: 18, color: '#7A4D00', fontWeight: '600' },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  reviewBtn: { backgroundColor: '#FB8500', padding: 8, borderRadius: 8 },
  editBtn: { backgroundColor: '#FFB703', padding: 8, borderRadius: 8 },
  deleteBtn: { backgroundColor: '#D62828', padding: 8, borderRadius: 8 },
  addBtn: { backgroundColor:
