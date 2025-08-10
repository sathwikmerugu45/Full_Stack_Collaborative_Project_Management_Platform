import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { apolloClient } from './lib/apollo';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Header } from './components/Layout/Header';
import { Dashboard } from './components/Dashboard/Dashboard';

const AuthWrapper: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {showRegister ? (
            <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
          ) : (
            <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
          )}
        </div>
      </div>
    );
  }

  return (
    <SocketProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Dashboard />
        </main>
      </div>
    </SocketProvider>
  );
};

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <AuthWrapper />
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;