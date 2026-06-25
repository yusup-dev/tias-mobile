import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Gamifikasi from '../../views/gamifikasi/index';
import MisiScreen from '../../views/gamifikasi/MisiScreen';
import LeaderboardScreen from '../../views/gamifikasi/LeaderboardScreen';
import PencapaianScreen from '../../views/gamifikasi/PencapaianScreen';

import AktivitasScreen from '../../views/gamifikasi/AktivitasScreen';
import StatistikScreen from '../../views/gamifikasi/StatistikScreen';

const Stack = createStackNavigator();

function GamifikasiStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="gamifikasi.index"
        component={Gamifikasi}
      />
      <Stack.Screen
        name="gamifikasi.misi"
        component={MisiScreen}
      />
      <Stack.Screen
        name="gamifikasi.leaderboard"
        component={LeaderboardScreen}
      />
      <Stack.Screen
        name="gamifikasi.pencapaian"
        component={PencapaianScreen}
      />
      <Stack.Screen
        name="gamifikasi.aktivitas"
        component={AktivitasScreen}
      />
      <Stack.Screen
        name="gamifikasi.statistik"
        component={StatistikScreen}
      />
    </Stack.Navigator>
  );
}

export default GamifikasiStack;
