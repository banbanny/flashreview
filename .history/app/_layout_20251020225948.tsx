// app/_layout.tsx (or layout.tsx)
import React, { useEffect, useRef, useState } from 'react';
import { Slot, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { View, ActivityIndicator } from 'react-native';
import { auth } from '../lib/firebase';
import { AuthProvider } from '../lib/auth';

export default function Layout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const didRedirectRef = useRef(false); // <- guard

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Only redirect once until unmount or until you reset the flag
      if (!didRedirectRef.current) {
        didRedirectRef.current = true;
        if (user) {
          router.replace('/');
        } else {
          router.replace('/login');
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFD6A5' }}>
        <ActivityIndicator size="large" color="#FB8500" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
