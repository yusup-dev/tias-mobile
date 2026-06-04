import {createStackNavigator} from '@react-navigation/stack';
import AbsensiComponent from '../views/absensi/index';
import FormCodeComponent from '../views/absensi/formCode';
import AttendanceFaceScreen from '../views/absensi/AttendanceFaceScreen';
import AttendanceFaceDevScreen from '../features/attendance-face/screens/AttendanceFaceScreen';

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
      {/* DEV ONLY: Face screen lengkap dengan enroll & face detector */}
      <Stack.Screen name="absensi.face.dev" component={AttendanceFaceDevScreen} />
    </Stack.Navigator>
  );
}

export default AbsensiStack;
