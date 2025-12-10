// /app/signup.tsx or /screens/Signup.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/lib/auth";

export default function Signup() {
  const { signUp, loading } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignup = async () => {
  if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
    Alert.alert("Missing Fields", "Please fill in all fields.");
    return;
  }

  if (!email.includes("@")) {
    Alert.alert("Invalid Email", "Please enter a valid email address.");
    return;
  }

  if (password.length < 8) {
    Alert.alert("Weak Password", "Password must be at least 8 characters.");
    return;
  }

  if (password !== confirmPass) {
    Alert.alert("Password Mismatch", "Passwords do not match.");
    return;
  }

  try {
    // ⬇️ Calls signUp (which now updates displayName + saves Firestore + reloads user)
    await signUp(
      email.trim(),
      password,
      firstName.trim(),
      lastName.trim()
    );

    Alert.alert("Success", "Account created! Please log in.", [
      {
        text: "OK",
        onPress: () => router.replace("/login"),
      },
    ]);
  } catch (err: any) {
    console.log("Signup error:", err);

    if (err.code === "auth/email-already-in-use") {
      Alert.alert("Signup Error", "Email is already in use. Please login.");
    } else {
      Alert.alert("Signup Error", err.message || "Unable to sign up");
    }
  }
};
  if (loading)
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#219EBC" />
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Your Account</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#7A4D00" style={styles.icon} />
          <TextInput placeholder="First Name" value={firstName} onChangeText={setFirstName} style={styles.input} />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} 
                              color="#7A4D00" style={styles.icon} />
          <TextInput placeholder="Last Name" value={lastName} onChangeText={setLastName} style={styles.input} />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#7A4D00" style={styles.icon} />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.passwordContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#7A4D00" style={styles.icon} />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#7A4D00" />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#7A4D00" style={styles.icon} />
          <TextInput
            placeholder="Confirm Password"
            value={confirmPass}
            onChangeText={setConfirmPass}
            style={styles.passwordInput}
            secureTextEntry={!showConfirm}
          />
          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
            <Ionicons name={showConfirm ? "eye-off" : "eye"} size={22} color="#7A4D00" />
          </TouchableOpacity>
        </View>

        {/* CALL handleSignup HERE */}
        <TouchableOpacity style={styles.btn} onPress={handleSignup}>
          <Text style={styles.btnText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.link}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFD6A5", padding: 25 },
  card: { backgroundColor: "#FFF7E6", borderRadius: 15, padding: 25, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  title: { fontSize: 26, fontWeight: "bold", color: "#7A4D00", marginBottom: 25, textAlign: "center" },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", borderRadius: 10, paddingHorizontal: 10, marginBottom: 15 },
  icon: { marginRight: 8 },
  input: { flex: 1, paddingVertical: 12, fontSize: 17 },
  passwordContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", borderRadius: 10, paddingHorizontal: 10, marginBottom: 15 },
  passwordInput: { flex: 1, paddingVertical: 12, fontSize: 17 },
  btn: { backgroundColor: "#219EBC", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10 },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 17 },
  link: { color: "#7A4D00", marginTop: 18, textAlign: "center", fontWeight: "500" },
});
