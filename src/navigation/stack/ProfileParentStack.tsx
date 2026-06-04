import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ParentProfileScreen from '../../views/profile/parent';
import EditParentProfileScreen from '../../views/profile/edit-parent';
import BantuanScreen from '../../views/profile/bantuan';
import PengaturanAkunScreen from '../../views/profile/pengaturan-akun';
import KebijakanPrivasiScreen from '../../views/profile/kebijakan-privasi';
import BeriNilaiScreen from '../../views/profile/beri-nilai';

const Stack = createStackNavigator();

function ProfileParentStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="parentProfile.index"
        component={ParentProfileScreen}
        options={{
          title: 'Profil',
        }}
      />
      <Stack.Screen
        name="parentProfile.edit"
        component={EditParentProfileScreen}
        options={{
          title: 'Ubah Profil',
        }}
      />
      <Stack.Screen
        name="parentProfile.pengaturan-akun"
        component={PengaturanAkunScreen}
        options={{
          title: 'Pengaturan Akun',
        }}
      />
      <Stack.Screen
        name="parentProfile.bantuan"
        component={BantuanScreen}
        options={{
          title: 'Bantuan & Laporan',
        }}
      />
      <Stack.Screen
        name="parentProfile.kebijakan-privasi"
        component={KebijakanPrivasiScreen}
        options={{
          title: 'Kebijakan Privasi',
        }}
      />
      <Stack.Screen
        name="parentProfile.beri-nilai"
        component={BeriNilaiScreen}
        options={{
          title: 'Beri Kami Nilai',
        }}
      />
    </Stack.Navigator>
  );
}

export default ProfileParentStack;
