import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CBTEntryScreen from '../features/cbt/CBTEntryScreen';
import CBTListScreen from '../features/cbt/CBTListScreen';
import CBTTokenScreen from '../features/cbt/CBTTokenScreen';
import CBTExamScreen from '../features/cbt/CBTExamScreen';
import CBTResultScreen from '../features/cbt/CBTResultScreen';

const Stack = createStackNavigator();

const CBTStack = () => (
  <Stack.Navigator
    initialRouteName="CBTEntry"
    screenOptions={{
      headerStyle: { backgroundColor: '#2E75B6' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen name="CBTEntry" component={CBTEntryScreen} options={{ headerShown: false }} />
    <Stack.Screen name="CBTList" component={CBTListScreen} options={{ title: 'Daftar Ujian', headerLeft: () => null }} />
    <Stack.Screen name="CBTToken" component={CBTTokenScreen} options={{ title: 'Masuk Ujian' }} />
    <Stack.Screen
      name="CBTExam"
      component={CBTExamScreen}
      options={{
        headerShown: false,
        gestureEnabled: false,   // nonaktifkan swipe back iOS saat ujian
      }}
    />
    <Stack.Screen name="CBTResult" component={CBTResultScreen} options={{ title: 'Hasil Ujian', headerLeft: () => null }} />
  </Stack.Navigator>
);

export default CBTStack;
