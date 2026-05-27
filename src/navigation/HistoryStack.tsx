import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HistoryScreen from '@/screens/History';
import WorkoutScreen from '@/screens/Workout';

export const HistoryStack = createNativeStackNavigator({
  initialRouteName: 'History',
  screenOptions: {
    headerShown: false,
  },
  screens: {
    History: {
      screen: HistoryScreen,
      options: {
        title: 'History',
      },
    },
    Workout: {
      screen: WorkoutScreen,
      options: {
        title: 'Workout',
      },
    },
  },
});
