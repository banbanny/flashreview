import { View } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import type { ComponentType } from "react";
import type { IconProps } from "@expo/vector-icons/build/createIconSet";

function getTabIcon(
  IconComponent: ComponentType<IconProps>,
  iconName: string,
  size: number,
  color: string,
  focused: boolean
) {
  return (
    <View
      style={{
        backgroundColor: focused ? "#3B82F6" : "transparent",
        borderRadius: 20,
        padding: focused ? 6 : 0,
      }}
    >
      <IconComponent name={iconName} color={focused ? "#fff" : color} size={size} />
    </View>
  );
}

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
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) =>
            getTabIcon(Ionicons, "home", size + 4, color, focused),
        }}
      />

      <Tabs.Screen
        name="reviewscreen"
        options={{
          title: "Reviewers",
          tabBarIcon: ({ color, size, focused }) =>
            getTabIcon(MaterialIcons, "menu-book", size + 2, color, focused),
        }}
      />

      <Tabs.Screen
        name="addscreen"
        options={{
          title: "Create",
          tabBarIcon: ({ color, size, focused }) =>
            getTabIcon(Ionicons, "add-circle-outline", size + 4, color, focused),
          tabBarBadge: "+",
        }}
      />

      <Tabs.Screen
        name="reviewsection"
        options={{
          title: "Review",
          tabBarIcon: ({ color, size, focused }) =>
            getTabIcon(FontAwesome5, "book-reader", size + 2, color, focused),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) =>
            getTabIcon(Ionicons, "person-circle-outline", size + 2, color, focused),
        }}
      />
    </Tabs>
  );
}
