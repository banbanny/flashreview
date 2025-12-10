import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

// ✅ Define the shape of a saved item
interface SavedItem {
  id: string;
  title: string;
  questions: { id: string; question: string; answer: string }[];
}

export default function Saved() {
  const router = useRouter();

  // ✅ Provide correct type to state
  const [savedData, setSavedData] = useState<SavedItem[]>([
    // Example dummy data to avoid empty list during development
    {
      id: '1',
      title: 'Sample Quiz',
      questions: [
        { id: 'q1', question: 'What is React?', answer: 'A JavaScript library for building UIs' },
        { id: 'q2', question: 'What is JSX?', answer: 'A syntax extension for JavaScript' },
      ],
    },
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Questionnaires</Text>

      <FlatList
        data={savedData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <TouchableOpacity
              style={styles.btn}
              onPress={() =>
                router.push({
                  pathname: '/reviewscreen',
                  params: { questions: JSON.stringify(item.questions) },
                })
              }>
              <Text style={styles.btnText}>Review</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center' }}>No saved questionnaires yet.</Text>}
      />

      <TouchableOpacity style={styles.btn} onPress={() => router.push('/addscreen')}>
        <Text style={styles.btnText}>Create New</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFD6A5', padding: 20 },
  title: { fontSize: 30, fontWeight: 'bold', color: '#7A4D00', marginBottom: 20 },
  card: { backgroundColor: '#FFF7E6', padding: 15, borderRadius: 10, marginBottom: 15 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#7A4D00' },
  btn: { backgroundColor: '#219EBC', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
