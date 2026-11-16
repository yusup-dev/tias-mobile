import { PermissionsAndroid, Platform } from 'react-native';
import { registerDeviceToken, removeDeviceToken } from './akademik';

/**
 * Push notification (Firebase Cloud Messaging) untuk UCL Mobile: undangan rapat/event & tagihan.
 *
 * Paket native `@react-native-firebase/app` + `@react-native-firebase/messaging` dimuat dengan
 * `require` yang dijaga: bila paket / berkas konfigurasi Firebase (google-services.json,
 * GoogleService-Info.plist) belum terpasang, aplikasi tetap berjalan normal — hanya push yang tidak aktif
 * (notifikasi tetap tampil di dalam aplikasi lewat layar Notifikasi).
 */
let messaging: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  messaging = require('@react-native-firebase/messaging').default;
} catch (e) {
  messaging = null;
}

export const pushAvailable = () => !!messaging;

type Registered = { fcm: string; authToken: string; role?: string } | null;
let registered: Registered = null;
let unsubscribers: Array<() => void> = [];

async function mintaIzin(): Promise<boolean> {
  try {
    if (Platform.OS === 'android' && Number(Platform.Version) >= 33) {
      const r = await PermissionsAndroid.request('android.permission.POST_NOTIFICATIONS' as any);
      return r === PermissionsAndroid.RESULTS.GRANTED;
    }
    if (Platform.OS === 'ios') {
      const st = await messaging().requestPermission();
      return st === 1 || st === 2; // AUTHORIZED | PROVISIONAL
    }
    return true;
  } catch {
    return false;
  }
}

/** Daftarkan perangkat setelah login. `onOpen` dipanggil bila notifikasi diketuk. */
export async function startPush(authToken: string, role: string | undefined, onOpen: (data: any) => void) {
  if (!messaging || !authToken) return;
  stopListeners();
  try {
    if (!(await mintaIzin())) return;
    const fcm: string = await messaging().getToken();
    if (!fcm) return;
    const platform = Platform.OS === 'ios' ? 'ios' : 'android';
    await registerDeviceToken(fcm, platform);
    registered = { fcm, authToken, role };

    unsubscribers.push(
      messaging().onTokenRefresh(async (t: string) => {
        try {
          await registerDeviceToken(t, platform);
          registered = { fcm: t, authToken, role };
        } catch { /* dicoba lagi saat aplikasi dibuka berikutnya */ }
      }),
    );
    // aplikasi di latar belakang -> notifikasi diketuk
    unsubscribers.push(messaging().onNotificationOpenedApp((m: any) => onOpen(m?.data || {})));
    // aplikasi tertutup -> dibuka dari notifikasi
    const awal = await messaging().getInitialNotification();
    if (awal) onOpen(awal.data || {});
  } catch (e) {
    console.log('[push] gagal mengaktifkan push:', (e as any)?.message);
  }
}

function stopListeners() {
  unsubscribers.forEach(u => { try { u(); } catch { /* abaikan */ } });
  unsubscribers = [];
}

/** Panggil saat logout: lepas token perangkat dari akun agar push tidak masuk ke pengguna berikutnya. */
export async function stopPush() {
  stopListeners();
  const r = registered;
  registered = null;
  if (!r) return;
  try {
    await removeDeviceToken(r.fcm, r.authToken, r.role);
  } catch { /* token kedaluwarsa dibersihkan server saat FCM menolaknya */ }
}
