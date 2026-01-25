import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useTokenStore} from '../store/auth';
import Login from '../views/login';
import BottomTabsComponent from './bottom-tabs';

const AppNavigation = () => {
  const {auth, user} = useTokenStore();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {auth ? <BottomTabsComponent /> : <Login />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
export default AppNavigation;
