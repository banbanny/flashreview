import React, { useEffect, useState, useRef } from 'react';
import { Slot, useRouter } from 'expo-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from '../lib/auth';

function AuthGate() {
  const router = useRouter();
  const { user, initializing } = useAuth();
  const didRedirect = useRef(false);

  useEffect(() => {
    if (initializing) return;

    if (!didRedirect.current) {
      didRedirect.current = true;
      if (user) {
        router.replace('/');
      } else {
        router.replace('/login');
      }
    }
  }, [initializing, user, router]);

  if (initializing) {
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

  return <Slot />;
}

export default function Layout() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}
