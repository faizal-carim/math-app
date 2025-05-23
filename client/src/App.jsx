import React, { useState, useEffect } from 'react';
import AuthScreen from './components/AuthScreen';
import GameScreen from './components/GameScreen';
import AdminScreen from './components/AdminScreen';
import ProfileScreen from './components/ProfileScreen';
import StoreScreen from './components/StoreScreen';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('profile');

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } else {
      // Clear any partial data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    console.log('Login handler called with user data:', userData);
    setUser(userData);
    setCurrentScreen('profile'); // Navigate to profile page after login
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentScreen('game');
  };

  const renderScreen = () => {
    if (!user) {
      return <AuthScreen onLogin={handleLogin} />;
    }

    switch (currentScreen) {
      case 'admin':
        // Allow access if user is admin OR username is faizal (case insensitive)
        return (user.role === 'admin' || user.username?.toLowerCase() === 'faizal') ? (
          <AdminScreen onBack={() => setCurrentScreen('profile')} />
        ) : (
          <GameScreen 
            user={user} 
            onLogout={handleLogout}
            onNavigate={setCurrentScreen}
          />
        );
      case 'profile':
        return (
          <ProfileScreen 
            user={user} 
            onBack={() => setCurrentScreen('game')}
            onLogout={handleLogout}
            onNavigate={setCurrentScreen}
          />
        );
      case 'store':
        return (
          <StoreScreen 
            user={user} 
            onBack={() => setCurrentScreen('game')}
          />
        );
      case 'game':
      default:
        return (
          <GameScreen 
            user={user} 
            onLogout={handleLogout}
            onNavigate={setCurrentScreen}
          />
        );
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app-container">
      {renderScreen()}
    </div>
  );
};

export default App;