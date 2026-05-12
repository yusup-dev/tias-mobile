import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CBTEntryScreen from '../features/cbt/CBTEntryScreen';
import CBTListScreen from '../features/cbt/CBTListScreen';
import CBTTokenScreen from '../features/cbt/CBTTokenScreen';
import CBTExamScreen from '../features/cbt/CBTExamScreen';
import CBTResultScreen from '../features/cbt/CBTResultScreen';
import CBTHistoryScreen from '../features/cbt/CBTHistoryScreen';

const Stack = createStackNavigator();

const CBTStack = () => (
  <Stack.Navigator
    initialRouteName="CBTEntry"
    screenOptions={{
      headerStyle: { backgroundColor: '#14532D' },
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
    <Stack.Screen name="CBTHistory" component={CBTHistoryScreen} options={{ title: 'Riwayat Ujian' }} />
  </Stack.Navigator>
);

export default CBTStack;
