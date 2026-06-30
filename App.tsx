import React from 'react';
import {createStaticNavigation} from '@react-navigation/native';
import RootStack from '@/navigation/RootStack';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

const Navigation = createStaticNavigation(RootStack);
const queryClient = new QueryClient({
  defaultOptions: {queries: {staleTime: 1000 * 60}},
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Navigation
        linking={{
          prefixes: ['workoutjournal://'],
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
