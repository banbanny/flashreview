// app/_layout.tsx
import React from 'react';
import { Tabs, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { AuthProvider } from '../lib/auth';

export default function Layout() {
  const colorScheme = useColorScheme();
  const tintColor = colorScheme === 'dark' ? '#FFD6A5' : '#7A4D00';

  return (
    <AuthProvider>
      {/* Stack wraps Tabs to allow non-tab screens like login, reviewscreen, etc. */}
      <Stack screenOptions={{ headerShown: false }}>
        {/* Tab Navigator as the main layout */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
