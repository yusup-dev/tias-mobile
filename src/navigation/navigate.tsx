import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTokenStore } from '../store/auth';
import Login from '../views/login';
import Register from '../views/register';
import ForgotPasswordScreen from '../views/ForgotPasswordScreen';
import FaceLoginVerificationScreen from '../views/FaceLoginVerificationScreen';
import BottomTabsComponent from './bottom-tabs';
import { startPush, stopPush } from '../services/push';

const navigationRef = createNavigationContainerRef<any>();

// notifikasi push diketuk -> buka layar yang sesuai
const bukaDariPush = (data: any) => {
  if (!navigationRef.isReady()) return;
  const type = data?.type;
  if (type === 'tagihan') navigationRef.navigate('Home', { screen: 'home.tagihan' });
  else if (type === 'jadwal_kuliah') navigationRef.navigate('Kuliah');
  else if (type === 'event_invite') navigationRef.navigate('Home', { screen: 'home.meeting' });
  else navigationRef.navigate('Home', { screen: 'home.notifikasi' });
};

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="login" component={Login} />
    <Stack.Screen name="register" component={Register} />
    <Stack.Screen name="forgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="faceLoginVerification" component={FaceLoginVerificationScreen} />
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

  // daftarkan / lepas token push mengikuti status login
  useEffect(() => {
    if (isLoggedIn) startPush(token, user?.role, bukaDariPush);
    else stopPush();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, token]);

  return (
    <NavigationContainer ref={navigationRef}>
      {isLoggedIn ? <BottomTabsComponent /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigation;
