// app/_layout.tsx
import { Slot } from 'expo-router';
import { AuthProvider } from '../lib/auth';

export default function Layout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
