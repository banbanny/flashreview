import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

export default function Saved() {
  const router = useRouter();
  const [savedData, setSavedData] = useState([]); // Add logic to load saved data

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Questionnaires</Text>

      <FlatList
        data={savedData}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <TouchableOpacity style={styles.btn} onPress={() => router.push('/reviewscreen')}>
              <Text style={styles.btnText}>Review</Text>
            </TouchableOpacity>
          </View>
        )}
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
