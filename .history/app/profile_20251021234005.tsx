import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useAuth } from '../lib/auth';
import { useRouter } from 'expo-router';

export default function Profile() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {user ? (
        <View>
          <Text style={styles.info}>First Name: {user.displayName}</Text>
          <Text style={styles.info}>Email: {user.email}</Text>
        </View>
      ) : (
        <Text>You are not logged in.</Text>
      )}
      
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFD6A5', padding: 25, justifyContent: 'center' },
  title: { fontSize: 30, fontWeight: 'bold', color: '#7A4D00', marginBottom: 30 },
  info: { fontSize: 18, color: '#7A4D00', marginBottom: 10 },
  logoutBtn: { backgroundColor: '#D62828', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
