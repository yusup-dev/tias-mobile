import {createStackNavigator} from '@react-navigation/stack';
// import SignatureScreen from '../../views/profile/signature';
import ProfileScreen from '../../views/profile/index';
import SignaturePage from '../../views/profile/signature';

const Stack = createStackNavigator();
function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="profile.index"
        component={ProfileScreen}
        options={{
          title: 'test',
        }}
      />
      <Stack.Screen
        name="profile.signature"
        component={SignaturePage}
        options={{
          title: 'test2',
        }}
      />
    </Stack.Navigator>
  );
}

export default ProfileStack;
