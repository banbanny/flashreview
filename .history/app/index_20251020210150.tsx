import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Reviewer } from '../app/types';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';
import { getAuth, signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

type HomeNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function IndexScreen({ navigation }: { navigation: HomeNavigationProp }) {
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

  // 🔹 Handle logout
  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      Alert.alert('Logged Out', 'You have been signed out.');
      navigation.navigate('Login'); // Redirect to Login screen
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to sign out.');
    }
  };

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
      {/* 🔹 Header with Logout */}
      <View style={styles.header}>
        <Text style={styles.title}>My Reviewers</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="bluetooth-outline" size={22} color="#fff" style={{ marginRight: 5 }} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={reviewers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.reviewBtn}
                onPress={() => navigation.navigate('ReviewScreen', { questions: item.questions })}
              >
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

      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddScreen')}>
        <Text style={styles.btnText}>+ Create New Reviewer</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFD6A5', padding: 20 },
  title: { fontSize: 40, fontWeight: 'bold', color: '#7A4D00', marginBottom: 10,marginTop:40,textAlign:"center" },
  card: { backgroundColor: '#FFF7E6', padding: 15, borderRadius: 15, marginBottom: 10 },
  cardTitle: { fontSize: 18, color: '#7A4D00', fontWeight: '600' },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  reviewBtn: { backgroundColor: '#FB8500', padding: 8, borderRadius: 8 },
  editBtn: { backgroundColor: '#FFB703', padding: 8, borderRadius: 8 },
  deleteBtn: { backgroundColor: '#D62828', padding: 8, borderRadius: 8 },
  addBtn: { backgroundColor: '#219EBC', padding: 20, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  btnText: { color: '#fff', fontWeight: 'bold',fontSize: 18 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D62828',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
})