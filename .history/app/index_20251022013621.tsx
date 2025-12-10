import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "../lib/auth";

export default function Index() {
  const { user, loading } = useAuth();

  // ✅ Step 1: Show a loading screen until Firebase finishes checking
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7A4D00" />
      </View>
    );
  }

  // ✅ Step 2: Only redirect once loading is complete
  if (user) {
    return <Redirect href="/tabs" />; // 👈 not "/(tabs)"
  }

  return <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#FFD6A5",
    justifyContent: "center",
    alignItems: "center",
  },
});
