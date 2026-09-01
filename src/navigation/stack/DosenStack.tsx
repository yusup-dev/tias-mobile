import { createStackNavigator } from '@react-navigation/stack';
import EvotingComp from '../../views/home/menu/evoting';
import DetailChallange from '../../views/home/menu/detailChallange';
import DetailPengumuman from '../../views/home/menu/detailPengumuman';
import DosenMenuComponent from '../../views/home/menu/dosen.index';

// Persuratan
import SuratScreen from '../../views/surat/index';
import DetailSuratScreen from '../../views/surat/DetailSuratScreen';
import DisposisiScreen from '../../views/surat/DisposisiScreen';

// Meeting & Rapat
import MeetingScreen from '../../views/meeting/index';
import DetailMeetingScreen from '../../views/meeting/DetailMeetingScreen';

// Tri Dharma
import NilaiScreen from '../../views/pendidikan/index';
import SkripsiScreen from '../../views/penelitian/index';
import KknScreen from '../../views/pengabdian/index';
import KompetensiScreen from '../../views/kompetensi/index';
import PenunjangScreen from '../../views/penunjang/index';

const Stack = createStackNavigator();
function DosenStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="home.index"
        component={DosenMenuComponent}
        options={{
          title: 'Home Dosen',
        }}
      />
      <Stack.Screen
        name="home.evoting"
        component={EvotingComp}
        options={{
          title: 'E-Voting',
        }}
      />
      <Stack.Screen
        name="home.detail-challenge"
        component={DetailChallange}
        options={{
          title: 'Detail Tantangan',
        }}
      />
      <Stack.Screen
        name="home.detail-pengumuman"
        component={DetailPengumuman}
        options={{
          title: 'Detail Pengumuman',
        }}
      />

      {/* Persuratan & Disposisi */}
      <Stack.Screen
        name="home.surat"
        component={SuratScreen}
        options={{
          title: 'Persuratan & Disposisi',
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

      {/* Tri Dharma & Akademik */}
      <Stack.Screen
        name="home.pendidikan"
        component={NilaiScreen}
        options={{
          title: 'Pendidikan & Nilai',
        }}
      />
      <Stack.Screen
        name="home.penelitian"
        component={SkripsiScreen}
        options={{
          title: 'Penelitian & Skripsi',
        }}
      />
      <Stack.Screen
        name="home.pengabdian"
        component={KknScreen}
        options={{
          title: 'Pengabdian & KKN',
        }}
      />
      <Stack.Screen
        name="home.kompetensi"
        component={KompetensiScreen}
        options={{
          title: 'Kompetensi',
        }}
      />
      <Stack.Screen
        name="home.penunjang"
        component={PenunjangScreen}
        options={{
          title: 'Penunjang',
        }}
      />
    </Stack.Navigator>
  );
}

export default DosenStack;
