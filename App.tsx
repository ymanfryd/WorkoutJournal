import React from 'react';
import {createStaticNavigation} from '@react-navigation/native';
import RootStack from '@/navigation/RootStack';
import {AuthProvider} from '@/auth/AuthContext';

const Navigation = createStaticNavigation(RootStack);

function App() {
  return (
    <AuthProvider>
      <Navigation
        linking={{
          prefixes: ['workoutjournal://'],
        }}
      />
    </AuthProvider>
  );
}

export default App;
