import React from 'react';
import {createStaticNavigation} from '@react-navigation/native';
import {RootTabs} from '@/navigation/RootTabs';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const Navigation = createStaticNavigation(RootTabs);

function App() {
  return (
    <SafeAreaProvider>
      <Navigation />
    </SafeAreaProvider>
  );
}

export default App;
