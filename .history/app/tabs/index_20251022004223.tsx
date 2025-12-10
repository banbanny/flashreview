import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Welcome to FlashReview!</Text>
      <Button title="Add Reviewer" onPress={() => router.push('/(tabs)/addscreen')} />
    </View>
  );
}
