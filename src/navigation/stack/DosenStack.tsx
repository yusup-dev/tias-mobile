import { createStackNavigator } from '@react-navigation/stack';
import EvotingComp from '../../views/home/menu/evoting';

import DetailChallange from '../../views/home/menu/detailChallange';
import DetailPengumuman from '../../views/home/menu/detailPengumuman';
import DosenMenuComponent from '../../views/home/menu/dosen.index';

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
    </Stack.Navigator>
  );
}

export default DosenStack;
