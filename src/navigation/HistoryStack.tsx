import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HistoryScreen from '@/screens/History';
import WorkoutScreen from '@/screens/Workout';

export const HistoryStack = createNativeStackNavigator({
  initialRouteName: 'HistoryList',
  screenOptions: {
    headerShown: false,
  },
  screens: {
    HistoryList: {
      screen: HistoryScreen,
      linking: '',
    },
    Workout: {
      screen: WorkoutScreen,
      linking: 'workouts/:id',
    },
  },
});
