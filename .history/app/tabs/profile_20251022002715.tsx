// app/(tabs)/profile.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { router } from 'expo-router';

export default function Profile() {
  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  const user = auth.currentUser;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {user ? (
        <>
          <Text style={styles.info}>Email: {user.email}</Text>
          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <Text>No user logged in.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF7E6' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  info: { fontSize: 16, marginBottom: 10 },
});
