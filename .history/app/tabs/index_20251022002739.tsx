// app/(tabs)/index.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to FlashReview!</Text>
      <Button title="Add Reviewer" onPress={() => router.push('/(tabs)/addscreen')} />
      <Button title="See Reviewers" onPress={() => router.push('/(tabs)/reviewsection')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF7E6' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 20 },
});
