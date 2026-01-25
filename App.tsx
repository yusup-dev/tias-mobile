/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {SafeAreaProvider} from 'react-native-safe-area-context';

import {PaperProvider} from 'react-native-paper';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
// import Login from './src/login/index';
// import {MenuComponent} from './src/views/home/index';
import {SafeAreaView} from 'react-native';
import Login from './src/views/login';
import AppNavigation from './src/navigation/navigate';
// import AppNavigation from './src/navigation/navigate';
// import Login from 'src/views/login';
const queryClient = new QueryClient();
function App(): JSX.Element {
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
        }}>
        <PaperProvider>
          <QueryClientProvider client={queryClient}>
            <AppNavigation />
          </QueryClientProvider>

          {/* <QueryClientProvider client={queryClient}>
            <Login /> */}
          {/* <MenuComponent /> */}
          {/* <AppNavigation />
          </QueryClientProvider> */}
        </PaperProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;
