import { Redirect } from 'expo-router';
import { useAuth } from '../lib/auth';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) return null; // or a splash/loading screen

  return <Redirect href={user ? '/tabs' : '/login'} />;
}
