import {createStackNavigator} from '@react-navigation/stack';
import HistoryPerkuliahanComponent from '../views/perkuliahan/history';
import PerkuliahanComponent from '../views/perkuliahan/index';

const Stack = createStackNavigator();

function PerkuliahanStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="perkuliahan.index" component={PerkuliahanComponent} />
      <Stack.Screen
        name="perkuliahan.history"
        component={HistoryPerkuliahanComponent}
      />
    </Stack.Navigator>
  );
}

export default PerkuliahanStack;
