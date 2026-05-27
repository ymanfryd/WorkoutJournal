import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootTabs} from './RootTabs';
import ActiveWorkoutScreen from '@/screens/ActiveWorkout';
import EditExerciseScreen from '@/screens/EditExercise';
import SignInScreen from '@/screens/SignIn';
import {useIsSignedIn, useIsSignedOut} from '@/auth/AuthContext';

const RootStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  groups: {
    LoggedInMain: {
      if: useIsSignedIn,
      screens: {
        Tabs: RootTabs,
      },
    },
    LoggedInModal: {
      if: useIsSignedIn,
      screenOptions: {
        presentation: 'modal',
      },
      screens: {
        ActiveWorkout: ActiveWorkoutScreen,
        EditExercise: EditExerciseScreen,
      },
    },
    LoggedOut: {
      if: useIsSignedOut,
      screens: {
        SignIn: SignInScreen,
      },
    },
  },
});

export default RootStack;
