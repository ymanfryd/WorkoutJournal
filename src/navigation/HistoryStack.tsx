import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HistoryScreen from '@/screens/History';
import WorkoutDetailScreen from '@/screens/WorkoutDetail';

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
    WorkoutDetail: {
      screen: WorkoutDetailScreen,
      linking: 'workouts/:id',
    },
  },
});
