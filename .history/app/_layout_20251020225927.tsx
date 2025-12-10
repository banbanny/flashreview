import React from 'react';
import { Slot } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from '../lib/auth';

function AuthGate() {
  const { user, initializing } = useAuth();
  const router = useRouter();
  const didRedirect = React.useRef(false);

  React.useEffect(() => {
    if (initializing) return;
    if (!didRedirect.current) {
      didRedirect.current = true;
      if (user) router.replace('/');
      else router.replace('/login');
    }
  }, [initializing, user, router]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFD6A5' }}>
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
