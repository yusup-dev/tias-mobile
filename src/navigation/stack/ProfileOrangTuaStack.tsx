import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import OrangTuaProfileScreen from '../../views/profile/orang-tua/index';
import EditOrangTuaProfileScreen from '../../views/profile/orang-tua/edit';
import BantuanScreen from '../../views/profile/bantuan';
import PengaturanAkunScreen from '../../views/profile/pengaturan-akun';
import KebijakanPrivasiScreen from '../../views/profile/kebijakan-privasi';
import BeriNilaiScreen from '../../views/profile/beri-nilai';
import SuratPengunduranDiriScreen from '../../views/profile/orang-tua/surat-pengunduran-diri';

const Stack = createStackNavigator();

function ProfileOrangTuaStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="orangTuaProfile.index"
        component={OrangTuaProfileScreen}
        options={{
          title: 'Profil',
        }}
      />
      <Stack.Screen
        name="orangTuaProfile.edit"
        component={EditOrangTuaProfileScreen}
        options={{
          title: 'Ubah Profil',
        }}
      />
      <Stack.Screen
        name="orangTuaProfile.pengaturan-akun"
        component={PengaturanAkunScreen}
        options={{
          title: 'Pengaturan Akun',
        }}
      />
      <Stack.Screen
        name="orangTuaProfile.bantuan"
        component={BantuanScreen}
        options={{
          title: 'Bantuan & Laporan',
        }}
      />
      <Stack.Screen
        name="orangTuaProfile.kebijakan-privasi"
        component={KebijakanPrivasiScreen}
        options={{
          title: 'Kebijakan Privasi',
        }}
      />
      <Stack.Screen
        name="orangTuaProfile.beri-nilai"
        component={BeriNilaiScreen}
        options={{
          title: 'Beri Kami Nilai',
        }}
      />
      <Stack.Screen
        name="orangTuaProfile.surat-pengunduran-diri"
        component={SuratPengunduranDiriScreen}
        options={{
          title: 'Surat Pengunduran Diri',
        }}
      />
    </Stack.Navigator>
  );
}

export default ProfileOrangTuaStack;
