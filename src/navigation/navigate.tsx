import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTokenStore } from '../store/auth';

const Stack = createStackNavigator();
import Login from '../views/login';
import Register from '../views/register';
import BottomTabsComponent from './bottom-tabs';

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Register" component={Register} />
  </Stack.Navigator>
);

const AppNavigation = () => {
  const { auth, token, user, rememberMe, setAuthentication } = useTokenStore();

  useEffect(() => {
    if (!auth && rememberMe && token && (user?.npm || user?.email)) {
      setAuthentication(true);
    }
  }, [auth, rememberMe, setAuthentication, token, user?.email, user?.npm]);

  const isLoggedIn = Boolean(auth && token && (user?.npm || user?.email));

  return (

    <NavigationContainer>
      {isLoggedIn ? <BottomTabsComponent /> : <AuthStack />}
    </NavigationContainer>

  );
};

export default AppNavigation;