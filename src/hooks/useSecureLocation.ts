import { useState, useCallback } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export type SecureLocation = {
  latitude: number;
  longitude: number;
  accuracy: number;
  source: 'gps' | 'network';
  timestamp: number;
};

export const useSecureLocation = () => {
  const [isLoading, setIsLoading] = useState(false);

  const requestPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
      const status = await Geolocation.requestAuthorization('whenInUse');
      return status === 'granted';
    }

    if (Platform.OS === 'android') {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return status === PermissionsAndroid.RESULTS.GRANTED;
    }

    return false;
  };

  const getPosition = useCallback(async (): Promise<SecureLocation> => {
    setIsLoading(true);

    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        throw new Error('Izin lokasi tidak diberikan. Harap berikan izin di pengaturan perangkat.');
      }

      // Try GPS High Accuracy first
      return await new Promise<SecureLocation>((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              source: 'gps',
              timestamp: position.timestamp,
            });
          },
          (error) => {
            // Fallback to Network based location
            Geolocation.getCurrentPosition(
              (pos) => {
                resolve({
                  latitude: pos.coords.latitude,
                  longitude: pos.coords.longitude,
                  accuracy: pos.coords.accuracy,
                  source: 'network',
                  timestamp: pos.timestamp,
                });
              },
              (err) => {
                reject(new Error('Gagal mendapatkan lokasi. Pastikan GPS Anda aktif dan Anda berada di area terbuka.'));
              },
              {
                enableHighAccuracy: false,
                timeout: 15000,
                maximumAge: 60000,
              }
            );
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 10000,
          }
        );
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { getPosition, isLoading };
};
