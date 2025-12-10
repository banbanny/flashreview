// app/index.tsx
import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../lib/auth';

export default function Index() {
  const { user, loading } = useAuth();

  // While checking auth state, keep user on a neutral blank screen (or show a splash).
  // Once known, redirect appropriately.
  if (loading) {
    // return null while loading (you can replace with a splash UI)
    return null;
  }

  return <Redirect href={user ? '/(tabs)' : '/login'} />;
}
