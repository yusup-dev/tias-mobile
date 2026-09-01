import { createStackNavigator } from '@react-navigation/stack';
import EvotingComp from '../../views/home/menu/evoting';
import { MenuComponent } from '../../views/home/index';
import DetailChallange from '../../views/home/menu/detailChallange';
import DetailPengumuman from '../../views/home/menu/detailPengumuman';
import NilaiScreen from '../../views/pendidikan/index';
import SkripsiScreen from '../../views/penelitian/index';
import KknScreen from '../../views/pengabdian/index';
import KompetensiScreen from '../../views/kompetensi/index';
import PenunjangScreen from '../../views/penunjang/index';

// Persuratan
import SuratScreen from '../../views/surat/index';
import DetailSuratScreen from '../../views/surat/DetailSuratScreen';
import DisposisiScreen from '../../views/surat/DisposisiScreen';

// Meeting & Rapat
import MeetingScreen from '../../views/meeting/index';
import DetailMeetingScreen from '../../views/meeting/DetailMeetingScreen';

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
          title: 'home',
        }}
      />
      <Stack.Screen
        name="home.evoting"
        component={EvotingComp}
        options={{
          title: 'test',
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

      {/* Persuratan & Disposisi */}
      <Stack.Screen
        name="home.surat"
        component={SuratScreen}
        options={{
          title: 'Persuratan',
        }}
      />
      <Stack.Screen
        name="home.surat-detail"
        component={DetailSuratScreen}
        options={{
          title: 'Detail Surat',
        }}
      />
      <Stack.Screen
        name="home.surat-disposisi"
        component={DisposisiScreen}
        options={{
          title: 'Form Disposisi',
        }}
      />

      {/* Meeting & Undangan Rapat */}
      <Stack.Screen
        name="home.meeting"
        component={MeetingScreen}
        options={{
          title: 'Undangan Rapat',
        }}
      />
      <Stack.Screen
        name="home.meeting-detail"
        component={DetailMeetingScreen}
        options={{
          title: 'Detail Rapat',
        }}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
