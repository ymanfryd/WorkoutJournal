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
        ActiveWorkout: {
          screen: ActiveWorkoutScreen,
          linking: 'active-workout',
        },
        EditExercise: {
          screen: EditExerciseScreen,
          linking: 'edit-exercise/:id',
        },
      },
    },
    LoggedOut: {
      if: useIsSignedOut,
      screens: {
        SignIn: {
          screen: SignInScreen,
          linking: 'signin',
        },
      },
    },
  },
});

export default RootStack;
