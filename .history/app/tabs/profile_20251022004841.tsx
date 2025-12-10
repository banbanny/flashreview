// app/(tabs)/profile.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../../lib/auth'; // ✅ use context instead of direct firebase import

export default function Profile() {
  const { user, signOut } = useAuth(); // ✅ access from AuthProvider

  const handleLogout = async () => {
    try {
      await signOut(); // this automatically routes to /login
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF7E6',
  },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#7A4D00' },
  info: { fontSize: 16, marginBottom: 10, color: '#333' },
});
