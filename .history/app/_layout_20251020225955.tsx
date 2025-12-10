import React, { useEffect, useState } from 'react';
import { Slot, useRouter } from 'expo-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider } from '../lib/auth'; // ✅ Auth Context

export default function Layout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // ✅ If logged in, go to home
        router.replace('/');
      } else {
        // ✅ If not logged in, go to login
        router.replace('/login');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // ✅ Show loading indicator while checking auth
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

  // ✅ Wrap app with AuthProvider for context access
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
