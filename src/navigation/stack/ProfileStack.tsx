import {createStackNavigator} from '@react-navigation/stack';
import ProfileScreen from '../../views/profile/index';
import SignaturePage from '../../views/profile/signature';
import KependudukanScreen from '../../views/profile/kependudukan';
import AlamatScreen from '../../views/profile/alamat';
import TiasClubScreen from '../../views/profile/tias-club';
import BantuanScreen from '../../views/profile/bantuan';
import NotifikasiScreen from '../../views/profile/notifikasi';
import PengaturanAkunScreen from '../../views/profile/pengaturan-akun';
import KebijakanPrivasiScreen from '../../views/profile/kebijakan-privasi';
import BeriNilaiScreen from '../../views/profile/beri-nilai';

const Stack = createStackNavigator();
function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="profile.index"
        component={ProfileScreen}
        options={{
          title: 'Profil',
        }}
      />
      <Stack.Screen
        name="profile.signature"
        component={SignaturePage}
        options={{
          title: 'Tanda Tangan',
        }}
      />
      <Stack.Screen
        name="profile.kependudukan"
        component={KependudukanScreen}
        options={{
          title: 'Kependudukan',
        }}
      />
      <Stack.Screen
        name="profile.alamat"
        component={AlamatScreen}
        options={{
          title: 'Alamat',
        }}
      />
      <Stack.Screen
        name="profile.tias-club"
        component={TiasClubScreen}
        options={{
          title: 'TIAS Club',
        }}
      />
      <Stack.Screen
        name="profile.bantuan"
        component={BantuanScreen}
        options={{
          title: 'Bantuan & Laporan',
        }}
      />
      <Stack.Screen
        name="profile.notifikasi"
        component={NotifikasiScreen}
        options={{
          title: 'Notifikasi',
        }}
      />
      <Stack.Screen
        name="profile.pengaturan-akun"
        component={PengaturanAkunScreen}
        options={{
          title: 'Pengaturan Akun',
        }}
      />
      <Stack.Screen
        name="profile.kebijakan-privasi"
        component={KebijakanPrivasiScreen}
        options={{
          title: 'Kebijakan Privasi',
        }}
      />
      <Stack.Screen
        name="profile.beri-nilai"
        component={BeriNilaiScreen}
        options={{
          title: 'Beri Kami Nilai',
        }}
      />
    </Stack.Navigator>
  );
}

export default ProfileStack;
