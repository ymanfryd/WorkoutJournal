import React from 'react';
import {createStaticNavigation} from '@react-navigation/native';
import {RootStack} from '@/navigation/RootStack';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const Navigation = createStaticNavigation(RootStack);

function App() {
  return (
    <SafeAreaProvider>
      <Navigation />
    </SafeAreaProvider>
  );
}

export default App;
