import { Redirect } from 'expo-router';
import { useAuth } from '../../lib/auth';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Flash Reviewer 📒</Text>
          <Text style={styles.subtitle}>Loading your workspace...</Text>
          <ActivityIndicator size="large" color="#219EBC" style={{ marginTop: 20 }} />
        </View>
      </View>
    );
  }

  // Redirect once we know user's status
  return <Redirect href={user ? '/tabs' : '/login'} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD6A5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  card: {
    backgroundColor: '#FFF7E6',
    borderRadius: 15,
    padding: 30,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#7A4D00',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7A4D00',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
});
