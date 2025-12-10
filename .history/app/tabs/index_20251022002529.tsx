// app/(tabs)/index.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to FlashReview!</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(tabs)/addscreen')}>
        <Text style={styles.buttonText}>Create a Review</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonOutline}
        onPress={() => router.push('/(tabs)/reviewsection')}>
        <Text style={styles.buttonOutlineText}>View All Reviews</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF7E6' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 40 },
  button: {
    backgroundColor: '#FF9B42',
    padding: 15,
    borderRadius: 10,
    width: 220,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  buttonOutline: {
    borderColor: '#FF9B42',
    borderWidth: 2,
    padding: 15,
    borderRadius: 10,
    width: 220,
    alignItems: 'center',
  },
  buttonOutlineText: { color: '#FF9B42', fontSize: 16, fontWeight: 'bold' },
});
