import {createStackNavigator} from '@react-navigation/stack';
import EvotingComp from '../../views/home/menu/evoting';
import {MenuComponent} from '../../views/home/index';
import DetailChallange from '../../views/home/menu/detailChallange';
import ChallengeList from '../../views/home/menu/ChallengeList';

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
        name="home.challenge-list"
        component={ChallengeList}
        options={{
          title: 'UCL Challenges',
        }}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
