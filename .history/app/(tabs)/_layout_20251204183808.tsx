import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons, FontAwesome5 } from "react-icons/io5";
import ReviewScreen from "./reviewscreen";
import ReviewSection from "./reviewsection";
import ProfileScreen from "./profile";

const Tab = createBottomTabNavigator();

export default function TabsLayout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "ReviewScreen") {
            return <Ionicons name="book" size={size} color={color} />;
          } else if (route.name === "ReviewSection") {
            return <MaterialIcons name="question-answer" size={size} color={color} />;
          } else if (route.name === "Profile") {
            return <FontAwesome5 name="user-alt" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: "#2E8B57",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="ReviewScreen" component={ReviewScreen} />
      <Tab.Screen name="ReviewSection" component={ReviewSection} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}