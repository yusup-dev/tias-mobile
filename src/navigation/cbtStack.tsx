import {createStackNavigator} from '@react-navigation/stack';
import {
  CbtExamListScreen,
  CbtExamSessionScreen,
  CbtResultScreen,
  CbtHistoryScreen,
} from '../features/cbt';

const Stack = createStackNavigator();

function CbtStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="cbt.exam-list" component={CbtExamListScreen} />
      <Stack.Screen name="cbt.session" component={CbtExamSessionScreen} />
      <Stack.Screen name="cbt.result" component={CbtResultScreen} />
      <Stack.Screen name="cbt.history" component={CbtHistoryScreen} />
    </Stack.Navigator>
  );
}

export default CbtStack;

