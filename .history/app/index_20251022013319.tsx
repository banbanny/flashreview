import { Redirect } from 'expo-router';
import { useAuth } from '../lib/auth';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#219EBC" />
      </View>
    );
  }

  // If user logged in → go to tabs, else → login page
  return <Redirect href={user ? '/tabs' : '/login'} />;
}
