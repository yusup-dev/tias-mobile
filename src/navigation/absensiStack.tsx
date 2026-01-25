import {createStackNavigator} from '@react-navigation/stack';
import AbsensiComponent from '../views/absensi/index';
import FormCodeComponent from '../views/absensi/formCode';

const Stack = createStackNavigator();
console.log(Stack);
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
    </Stack.Navigator>
  );
}

export default AbsensiStack;
