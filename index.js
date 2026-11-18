/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const messaging = require('@react-native-firebase/messaging').default;
  // Notifikasi (title/body) sudah otomatis ditampilkan OS dari payload FCM saat app
  // di background/tertutup -- handler ini cuma memastikan service Firebase-nya aktif
  // dengan benar (rekomendasi setup resmi React Native Firebase).
  messaging().setBackgroundMessageHandler(async () => {});
} catch (e) {
  // Firebase belum terpasang/terkonfigurasi -- aplikasi tetap jalan normal.
}

AppRegistry.registerComponent(appName, () => App);
