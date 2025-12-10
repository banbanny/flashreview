import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to Flash Reviewer!</Text>
      
      <TouchableOpacity style={styles.btn} onPress={() => router.push('/addscreen')}>
        <Text style={styles.btnText}>Create Questionnaire</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => router.push('/saved')}>
        <Text style={styles.btnText}>Saved Questionnaires</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFD6A5', justifyContent: 'center', alignItems: 'center' },
  welcomeText: { fontSize: 26, fontWeight: 'bold', color: '#7A4D00', marginBottom: 30 },
  btn: { backgroundColor: '#219EBC', padding: 15, borderRadius: 10, marginBottom: 10, width: '80%', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
