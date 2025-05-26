import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import AuthScreen from './components/AuthScreen';
import GameScreen from './components/GameScreen';
import AdminScreen from './components/AdminScreen';
import ProfileScreen from './components/ProfileScreen';
import StoreScreen from './components/StoreScreen';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

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

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    if (!user) {
      return <AuthScreen onLogin={handleLogin} />;
    }

    switch (currentScreen) {
      case 'admin':
        // Allow access if user is admin OR username is faizal (case insensitive)
        return (user.role === 'admin' || user.username?.toLowerCase() === 'faizal') ? (
          <AdminScreen onBack={() => setCurrentScreen('profile')} onLogout={handleLogout} />
        ) : (
          <GameScreen 
            user={user} 
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        );
      case 'profile':
        return (
          <ProfileScreen 
            user={user} 
            onBack={() => setCurrentScreen('game')}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        );
      case 'store':
        return (
          <StoreScreen 
            user={user} 
            onBack={() => setCurrentScreen('profile')}
          />
        );
      case 'game':
      default:
        return (
          <GameScreen 
            user={user} 
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="app-container">
          {renderScreen()}
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;