import React from "react";
import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "../lib/auth";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";

function ProtectedRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If no user → go to login
  if (!user) {
    return <Redirect href="/login" />;
  }

  // If logged in → go to tabs
  return <Redirect href="/(tabs)" />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ href: null }} /> 
        {/* optional hidden root */}
      </Stack>
      <ProtectedRoutes />
    </AuthProvider>
  );
}
