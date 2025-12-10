import React, { useEffect, useState } from 'react';
import { Slot, useRouter } from 'expo-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider } from '../lib/auth'; // ✅ import AuthProvider

export default function Layout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/');
      } else {
        router.replace('/login');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFD6A5',
        }}>
        <ActivityIndicator size="large" color="#FB8500" />
      </View>
    );
  }

  // ✅ Wrap Slot with AuthProvider
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
