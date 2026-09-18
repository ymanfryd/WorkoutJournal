import WorkoutScreen from '@/screens/Workout';
import ExercisesScreen from '@/screens/Exercises';
import StatsScreen from '@/screens/Stats';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, Text} from 'react-native';
import {colors} from '@/theme';
import {HistoryStack} from './HistoryStack';
import {SettingsStack} from './SettingsStack';
import {useTranslation} from 'react-i18next';

function TabLabel({textKey, color}: {textKey: string; color: string}) {
  const {t} = useTranslation();
  return <Text style={[styles.label, {color}]}>{t(textKey)}</Text>;
}

const styles = StyleSheet.create({
  label: {fontSize: 10},
});

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
        tabBarLabel: ({color}) => (
          <TabLabel textKey="tabs.workout" color={color} />
        ),
        tabBarIcon: () => <Text>🔥</Text>,
      },
    },
    Exercises: {
      screen: ExercisesScreen,
      linking: 'exercises',
      options: {
        tabBarLabel: ({color}) => (
          <TabLabel textKey="tabs.exercises" color={color} />
        ),
        tabBarIcon: () => <Text>🏋️</Text>,
      },
    },
    Stats: {
      screen: StatsScreen,
      linking: 'stats',
      options: {
        tabBarLabel: ({color}) => (
          <TabLabel textKey="tabs.stats" color={color} />
        ),
        tabBarIcon: () => <Text> 📊</Text>,
      },
    },
    History: {
      screen: HistoryStack,
      linking: 'history',
      options: {
        tabBarLabel: ({color}) => (
          <TabLabel textKey="tabs.history" color={color} />
        ),
        tabBarIcon: () => <Text>📅</Text>,
      },
    },
    Settings: {
      screen: SettingsStack,
      linking: 'settings',
      options: {
        tabBarLabel: ({color}) => (
          <TabLabel textKey="tabs.settings" color={color} />
        ),
        tabBarIcon: () => <Text>⚙️</Text>,
      },
    },
  },
});
