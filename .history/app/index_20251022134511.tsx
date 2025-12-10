// app/index/tsx

import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "../lib/auth";

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7A4D00" />
      </View>
    );
  }

  // Once loading completes, only redirect once
  return user ? <Redirect href="/tabs" /> : <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#FFD6A5",
    justifyContent: "center",
    alignItems: "center",
  },
});
