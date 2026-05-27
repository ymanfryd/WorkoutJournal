import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootTabs} from './RootTabs';
import ActiveWorkoutScreen from '@/screens/ActiveWorkout';
import EditExerciseScreen from '@/screens/EditExercise';

const RootStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Tabs: RootTabs,
  },
  groups: {
    Modal: {
      screenOptions: {
        presentation: 'modal',
      },
      screens: {
        ActiveWorkout: ActiveWorkoutScreen,
        EditExercise: EditExerciseScreen,
      },
    },
  },
});

export default RootStack;
