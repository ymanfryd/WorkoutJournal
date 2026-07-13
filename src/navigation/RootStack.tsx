import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootTabs} from './RootTabs';
import EditExerciseScreen from '@/screens/EditExercise';
import SignInScreen from '@/screens/SignIn';
import {useIsSignedIn, useIsSignedOut} from '@/stores/authStore';

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
