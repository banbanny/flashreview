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
    await signUp(email.trim(), password, firstName.trim(), lastName.trim());
    // ✅ Instead of navigating immediately, show success alert
    Alert.alert("Success", "Account created! Please log in.", [
      {
        text: "OK",
        onPress: () => router.replace("/login"), // Navigate after user confirms
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
