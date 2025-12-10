// app/tabs/_layout.tsx
import React from "react";
import { View } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 8,
          borderRadius: 20,
          marginHorizontal: 12,
          marginBottom: 10,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 4 },
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: "600",
          letterSpacing: 0.5,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarIcon: ({ color, size, focused }) => (
          <View
            style={{
              backgroundColor: focused ? "#3B82F6" : "transparent",
              borderRadius: 20,
              padding: focused ? 6 : 0,
            }}
          >
            <MaterialIcons name="menu-book" color={focused ? "#fff" : color} size={size + 2} />
          </View>
        )
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <View
              style={{
                backgroundColor: "#3B82F6",
                borderRadius: 20,
                padding: 6,
              }}
            >
              <Ionicons name="home" color="#fff" size={size + 4} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="reviewscreen"
        options={{
          title: "Reviewers",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="menu-book" color={color} size={size + 2} />
          ),
        }}
      />

      <Tabs.Screen
        name="addscreen"
        options={{
          title: "Create",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" color={color} size={size + 4} />
          ),
          tabBarBadge: "+",
        }}
      />

      <Tabs.Screen
        name="reviewsection"
        options={{
          title: "Review",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="book-reader" color={color} size={size + 2} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" color={color} size={size + 2} />
          ),
        }}
      />
    </Tabs>
  );
}
