import { createStackNavigator } from '@react-navigation/stack';
import NilaiScreen from '../../views/pendidikan/nilai/index';

const Stack = createStackNavigator();

function PendidikanStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="pendidikan.nilai" component={NilaiScreen} />
    </Stack.Navigator>
  );
}

export default PendidikanStack;
