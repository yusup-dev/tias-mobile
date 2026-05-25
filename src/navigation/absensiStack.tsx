import { createStackNavigator } from '@react-navigation/stack';
import AbsensiComponent from '../views/absensi/index';
import FormCodeComponent from '../views/absensi/formCode';
import { AttendanceFaceScreen } from '../features/attendance-face';

const Stack = createStackNavigator();
function AbsensiStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="absensi.index"
        component={AbsensiComponent}
        options={{
          title: 'test',
        }}
      />
      <Stack.Screen
        name="absensi.formcode"
        component={FormCodeComponent}
        options={{
          title: 'test2',
        }}
      />
      <Stack.Screen name="absensi.face" component={AttendanceFaceScreen} />
    </Stack.Navigator>
  );
}

export default AbsensiStack;
