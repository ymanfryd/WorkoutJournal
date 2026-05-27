import TodayScreen from '@/screens/Today';
import ExercisesScreen from '@/screens/Exercises';
import StatsScreen from '@/screens/Stats';
import SettingsScreen from '@/screens/Settings';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text} from 'react-native';
import {colors} from '@/theme';
import {HistoryStack} from './HistoryStack';

export const RootTabs = createBottomTabNavigator({
  initialRouteName: 'Today',
  screenOptions: {
    headerShown: false,
    tabBarActiveTintColor: colors.primary,
    tabBarStyle: {
      backgroundColor: colors.background,
    },
  },
  screens: {
    Today: {
      screen: TodayScreen,
      options: {
        tabBarIcon: () => {
          return <Text>🔥</Text>;
        },
      },
    },
    Exercises: {
      screen: ExercisesScreen,
      options: {
        tabBarIcon: () => {
          return <Text>🏋️</Text>;
        },
      },
    },
    Stats: {
      screen: StatsScreen,
      options: {
        tabBarIcon: () => {
          return <Text> 📊</Text>;
        },
      },
    },
    Settings: {
      screen: SettingsScreen,
      options: {
        tabBarIcon: () => {
          return <Text>⚙️</Text>;
        },
      },
    },
    History: {
      screen: HistoryStack,
      options: {
        tabBarIcon: () => <Text>📅</Text>,
      },
    },
  },
});
