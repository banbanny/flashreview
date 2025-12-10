import React, { useState, useCallback } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Reviewer } from './types';

export default function IndexScreen() {
  const router = useRouter();
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const stored = await AsyncStorage.getItem('reviewers');
        setReviewers(stored ? JSON.parse(stored) : []);
      };
      load();
    }, [])
  );

  const deleteReviewer = async (id: string) => {
    Alert.alert('Confirm Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updated = reviewers.filter(r => r.id !== id);
          await AsyncStorage.setItem('reviewers', JSON.stringify(updated));
          setReviewers(updated);
        },
      },
    ]);
  };

  const editReviewer = (r: Reviewer) => {
    router.push({
      pathname: '/addscreen',
      params: { editReviewer: JSON.stringify(r) },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Reviewers</Text>

      <FlatList
        data={reviewers}
        keyExtractor={item => item.id}
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

              <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteReviewer(item.id)}>
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push('/addscreen')}>
        <Text style={styles.btnText}>+ Create New Reviewer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFD6A5', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#7A4D00', marginBottom: 10,marginTop:40,alignContent:"ce" },
  card: { backgroundColor: '#FFF7E6', padding: 15, borderRadius: 15, marginBottom: 10 },
  cardTitle: { fontSize: 18, color: '#7A4D00', fontWeight: '600' },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  reviewBtn: { backgroundColor: '#FB8500', padding: 8, borderRadius: 8 },
  editBtn: { backgroundColor: '#FFB703', padding: 8, borderRadius: 8 },
  deleteBtn: { backgroundColor: '#D62828', padding: 8, borderRadius: 8 },
  addBtn: { backgroundColor: '#219EBC', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  btnText: { color: '#fff', fontWeight: 'bold' },
});
