import { createStackNavigator } from '@react-navigation/stack';
import EvotingComp from '../../views/home/menu/evoting';
import { MenuComponent } from '../../views/home/index';
import DetailChallange from '../../views/home/menu/detailChallange';
import DetailPengumuman from '../../views/home/menu/detailPengumuman';
import NilaiScreen from '../../views/pendidikan/nilai/index';
import SkripsiScreen from '../../views/penelitian/skripsi/index';
import KknScreen from '../../views/pengabdian/kkn/index';
import KompetensiScreen from '../../views/kompetensi/index';
import PenunjangScreen from '../../views/penunjang/index';

const Stack = createStackNavigator();
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="home.index"
        component={MenuComponent}
        options={{
          title: 'test',
        }}
      />
      <Stack.Screen
        name="home.evoting"
        component={EvotingComp}
        options={{
          title: 'test2',
        }}
      />
      <Stack.Screen
        name="home.detail-challenge"
        component={DetailChallange}
        options={{
          title: 'test2',
        }}
      />
      <Stack.Screen
        name="home.detail-pengumuman"
        component={DetailPengumuman}
        options={{
          title: 'Detail Pengumuman',
        }}
      />
      <Stack.Screen
        name="home.pendidikan"
        component={NilaiScreen}
        options={{
          title: 'Nilai Akademik',
        }}
      />
      <Stack.Screen
        name="home.penelitian"
        component={SkripsiScreen}
        options={{
          title: 'Data Skripsi',
        }}
      />
      <Stack.Screen
        name="home.pengabdian"
        component={KknScreen}
        options={{
          title: 'Data KKN',
        }}
      />
      <Stack.Screen
        name="home.kompetensi"
        component={KompetensiScreen}
        options={{
          title: 'Data Kompetensi',
        }}
      />
      <Stack.Screen
        name="home.penunjang"
        component={PenunjangScreen}
        options={{
          title: 'Data Penunjang',
        }}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
