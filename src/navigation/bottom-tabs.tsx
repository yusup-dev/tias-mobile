import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MenuComponent } from '../views/home/index';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from 'react-native-vector-icons/FontAwesome5';

import Gamifikasi from '../views/gamifikasi/index';

import PerkuliahanStack from './perkiliahanStack';
import AbsensiStack from './absensiStack';
import HomeStack from './stack/HomeStack';
import ProfileStack from './stack/ProfileStack';
import ProfileParentStack from './stack/ProfileParentStack';
import { useTokenStore } from '../store/auth';
import DosenStack from './stack/DosenStack';
import CbtStack from './cbtStack';
const Tab = createBottomTabNavigator();
const MahasiswaComponent = () => (
  <>
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        unmountOnBlur: true,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: 'home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Icon size={size} name="home" />,
        }}
      />
      <Tab.Screen
        name="Gamifikasi"
        component={Gamifikasi}
        options={{
          title: 'gamifikasi',
          tabBarLabel: 'Gamifikasi',
          tabBarIcon: ({ color, size }) => <Icon size={size} name="medal" />,
        }}
      />
      <Tab.Screen
        name="barcode"
        component={AbsensiStack}
        options={{
          title: 'absensi',
          tabBarLabel: 'Absensi',
          tabBarIcon: ({ color, size }) => <Icon size={size} name="qrcode" />,
        }}
      />
      <Tab.Screen
        name="Kuliah"
        component={PerkuliahanStack}
        options={{
          title: 'kuliah',
          tabBarLabel: 'Kuliah',
          tabBarIcon: ({ color, size }) => <Icon size={size} name="school" />,
        }}
      />
      <Tab.Screen
        name="CBT"
        component={CbtStack}
        options={{
          title: 'cbt',
          tabBarLabel: 'CBT',
          tabBarIcon: ({ color, size }) => <Icon size={size} name="clipboard" />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          title: 'profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon size={size} name="account-circle" />
          ),
        }}
      />
    </Tab.Navigator>
  </>
);

const DosenComponent = () => (
  <>
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        unmountOnBlur: true,
      }}>
      <Tab.Screen
        name="Home"
        component={DosenStack}
        options={{
          title: 'home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Icon size={size} name="home" />,
        }}
      />
      <Tab.Screen
        name="Gamifikasi"
        component={Gamifikasi}
        options={{
          title: 'rekomendasi',
          tabBarLabel: 'Rekomendasi',
          tabBarIcon: ({ color, size }) => (
            <Icon size={size} name="shield-star" />
          ),
        }}
      />
      <Tab.Screen
        name="barcode"
        component={AbsensiStack}
        options={{
          title: 'absensi',
          tabBarLabel: 'Absensi',
          tabBarIcon: ({ color, size }) => <Icon size={size} name="qrcode" />,
        }}
      />
      <Tab.Screen
        name="Kuliah"
        component={PerkuliahanStack}
        options={{
          title: 'kuliah',
          tabBarLabel: 'Kuliah',
          tabBarIcon: ({ color, size }) => <Icon size={size} name="school" />,
        }}
      />
      <Tab.Screen
        name="CBT"
        component={CbtStack}
        options={{
          title: 'cbt',
          tabBarLabel: 'CBT',
          tabBarIcon: ({ color, size }) => <Icon size={size} name="clipboard" />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          title: 'profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon size={size} name="account-circle" />
          ),
        }}
      />
    </Tab.Navigator>
  </>
);
const OrangTuaComponent = () => (
  <>
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        unmountOnBlur: true,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: 'home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Icon size={size} name="home" />,
        }}
      />
      <Tab.Screen
        name="Gamifikasi"
        component={Gamifikasi}
        options={{
          title: 'gamifikasi',
          tabBarLabel: 'Gamifikasi',
          tabBarIcon: ({ color, size }) => <Icon size={size} name="medal" />,
        }}
      />
      <Tab.Screen
        name="Kuliah"
        component={PerkuliahanStack}
        options={{
          title: 'kuliah',
          tabBarLabel: 'Kuliah',
          tabBarIcon: ({ color, size }) => <Icon size={size} name="school" />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileParentStack}
        options={{
          title: 'profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon size={size} name="account-circle" />
          ),
        }}
      />
    </Tab.Navigator>
  </>
);

const BottomTabsComponent = () => {
  const { user } = useTokenStore();

  return (
    <>
      {user?.role === 'Parent' ? (
        <OrangTuaComponent />
      ) : user?.role === 'Mahasiswa' ? (
        <MahasiswaComponent />
      ) : (
        <DosenComponent />
      )}
    </>
  );
};
export default BottomTabsComponent;
