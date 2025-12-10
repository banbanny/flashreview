// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AddScreen from './app/addscreen';
import IndexScreen from './app/index';
import type { Question, Reviewer } from './app/types';
import ReviewScreen from './app/reviewscreen';

export type RootStackParamList = {
  Home: undefined;
  AddScreen: { editReviewer?: Reviewer } | undefined;
  ReviewScreen: { questions: Question[] };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#FFD6A5' },
          headerTintColor: '#7A4D00',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Home" component={IndexScreen} options={{ title: 'My Reviewers' }} />
        <Stack.Screen name="AddScreen" component={AddScreen} options={{ title: 'Create Reviewer' }} />
        <Stack.Screen name="ReviewScreen" component={ReviewScreen} options={{ title: 'Review' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
