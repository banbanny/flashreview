import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../lib/auth';
import { useRouter } from 'expo-router';

export default function Profile() {
  const { userData, signOutUser } = useAuth(); // ✅ updated
  const router = useRouter();

  const handleLogout = async () => {
    await signOutUser(); // ✅ updated
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Profile</Text>

        <Text style={styles.label}>First Name</Text>
        <TextInput style={styles.input} value={userData?.firstName || ''} editable={false} />

        <Text style={styles.label}>Last Name</Text>
        <TextInput style={styles.input} value={userData?.lastName || ''} editable={false} />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={userData?.email || ''} editable={false} />

        <TouchableOpacity style={styles.btn} onPress={handleLogout}>
          <Text style={styles.btnText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFD6A5', justifyContent: 'center', padding: 25 },
  card: {
    backgroundColor: '#FFF7E6',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#7A4D00', marginBottom: 20, textAlign: 'center' },
  label: { color: '#7A4D00', fontWeight: '600', marginTop: 10 },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 16,
    color: '#444',
    marginTop: 5,
  },
  btn: { backgroundColor: '#219EBC', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
