// app/profile.tsx
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../lib/firebase';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserInfo(docSnap.data());
      }
    };
    loadProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Logged Out');
      router.replace('/login');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  if (!userInfo)
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>Name:</Text>
        <Text style={styles.infoValue}>{userInfo.name}</Text>

        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoValue}>{user.email}</Text>

        <Text style={styles.infoLabel}>Address:</Text>
        <Text style={styles.infoValue}>{userInfo.address}</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFD6A5', padding: 20, alignItems: 'center' },
  title: { fontSize: 40, fontWeight: 'bold', color: '#7A4D00', marginTop: 40, marginBottom: 20 },
  infoBox: { backgroundColor: '#FFF7E6', borderRadius: 12, padding: 20, width: '100%' },
  infoLabel: { fontSize: 18, fontWeight: 'bold', color: '#7A4D00', marginTop: 10 },
  infoValue: { fontSize: 16, color: '#333' },
  logoutBtn: { backgroundColor: '#D62828', padding: 15, borderRadius: 10, marginTop: 40, width: '80%', alignItems: 'center' },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
