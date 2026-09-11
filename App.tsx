import React from 'react';
import {createStaticNavigation} from '@react-navigation/native';
import RootStack from '@/navigation/RootStack';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const Navigation = createStaticNavigation(RootStack);
const queryClient = new QueryClient({
  defaultOptions: {queries: {staleTime: 1000 * 60}},
});

function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.root}>
        <QueryClientProvider client={queryClient}>
          <Navigation
            linking={{
              prefixes: ['workoutjournal://'],
            }}
          />
        </QueryClientProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  root: {flex: 1},
});
