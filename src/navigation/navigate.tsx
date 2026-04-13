import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';

import {useTokenStore} from '../store/auth';
import Login from '../views/login';
import BottomTabsComponent from './bottom-tabs';

const AppNavigation = () => {
  const {auth, token, user, rememberMe, setAuthentication} = useTokenStore();

  useEffect(() => {
    if (!auth && rememberMe && token && (user?.npm || user?.email)) {
      setAuthentication(true);
    }
  }, [auth, rememberMe, setAuthentication, token, user?.email, user?.npm]);

  const isLoggedIn = Boolean(auth && token && (user?.npm || user?.email));

  return (
    
      <NavigationContainer>
        {isLoggedIn ? <BottomTabsComponent /> : <Login />}
      </NavigationContainer>
    
  );
};

export default AppNavigation;