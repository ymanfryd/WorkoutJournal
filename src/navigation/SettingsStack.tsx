import LanguagePicker from '@/screens/LanguagePicker';
import SettingsScreen from '@/screens/Settings';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

export const SettingsStack = createNativeStackNavigator({
  initialRouteName: 'Settings',
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Settings: {
      screen: SettingsScreen,
    },
    LanguagePicker: {
      screen: LanguagePicker,
    },
  },
});
