import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '@/screens/Home';

export const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screens: {
    Home: HomeScreen,
  },
});
