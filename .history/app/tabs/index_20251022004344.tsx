import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter, Href } from 'expo-router';

export default function IndexScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Reviewers</Text>
      <Button
        title="Create New Reviewer"
        onPress={() => router.push('/(tabs)/addscreen' as Href)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
});
