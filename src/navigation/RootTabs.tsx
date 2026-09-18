import WorkoutScreen from '@/screens/Workout';
import ExercisesScreen from '@/screens/Exercises';
import StatsScreen from '@/screens/Stats';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text} from 'react-native';
import {colors} from '@/theme';
import {HistoryStack} from './HistoryStack';
import {SettingsStack} from './SettingsStack';

export const RootTabs = createBottomTabNavigator({
  initialRouteName: 'Workout',
  screenOptions: {
    headerShown: false,
    tabBarActiveTintColor: colors.primary,
    tabBarStyle: {
      backgroundColor: colors.background,
    },
  },
  screens: {
    Workout: {
      screen: WorkoutScreen,
      linking: 'workout',
      options: {
        tabBarIcon: () => {
          return <Text>🔥</Text>;
        },
      },
    },
    Exercises: {
      screen: ExercisesScreen,
      linking: 'exercises',
      options: {
        tabBarIcon: () => {
          return <Text>🏋️</Text>;
        },
      },
    },
    Stats: {
      screen: StatsScreen,
      linking: 'stats',
      options: {
        tabBarIcon: () => {
          return <Text> 📊</Text>;
        },
      },
    },
    History: {
      screen: HistoryStack,
      linking: 'history',
      options: {
        tabBarIcon: () => <Text>📅</Text>,
      },
    },
    Settings: {
      screen: SettingsStack,
      linking: 'settings',
      options: {
        tabBarIcon: () => {
          return <Text>⚙️</Text>;
        },
      },
    },
  },
});
