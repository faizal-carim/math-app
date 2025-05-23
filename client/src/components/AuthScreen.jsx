import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Configure axios defaults
axios.defaults.withCredentials = false; // Ensure no credentials are sent
import API_URL from '../config';
import './AuthScreen.css';

const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [school, setSchool] = useState('');
  const [schools, setSchools] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSchools, setLoadingSchools] = useState(false);

  // Fetch schools for registration
  useEffect(() => {
    if (!isLogin) {
      fetchSchools();
    }
  }, [isLogin]);

  const fetchSchools = async () => {
    try {
      setLoadingSchools(true);
      // Try with /api/school first
      try {
        const response = await axios.get(`${API_URL}/api/school`);
        if (response.data && Array.isArray(response.data)) {
          setSchools(response.data);
          if (response.data.length > 0) {
            setSchool(response.data[0].name); // Set default selection
          }
          return;
        }
      } catch (firstErr) {
        console.log('Trying alternative endpoint...');
        // Try with /api/schools as fallback
        const response = await axios.get(`${API_URL}/api/schools`);
        if (response.data && Array.isArray(response.data)) {
          setSchools(response.data);
          if (response.data.length > 0) {
            setSchool(response.data[0].name); // Set default selection
          }
        }
      }
    } catch (err) {
      console.error('Error fetching schools:', err);
      // Use hardcoded schools as last resort
      const defaultSchools = [
        { _id: '1', name: 'School A' },
        { _id: '2', name: 'School B' },
        { _id: '3', name: 'School C' }
      ];
      setSchools(defaultSchools);
      setSchool(defaultSchools[0].name);
    } finally {
      setLoadingSchools(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { username, password } 
        : { username, password, school };
      
      // Add headers to fix CORS issues
      const response = await axios.post(`${API_URL}${endpoint}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('API Response:', response);
      
      if (response.data && response.data.token) {
        console.log('Token found, logging in user');
        localStorage.setItem('token', response.data.token);
        
        // Create a default user object if user data is missing
        const userData = response.data.user || {
          username: username,
          role: 'student',
          id: Date.now().toString() // Temporary ID
        };
        
        console.log('Using user data:', userData);
        localStorage.setItem('user', JSON.stringify(userData));
        onLogin(userData);
      } else {
        console.log('No token in response:', response.data);
        setError('Authentication failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2>{isLogin ? 'Login to Math Game' : 'Create an Account'}</h2>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="school">School</label>
              {loadingSchools ? (
                <div className="loading-schools">Loading schools...</div>
              ) : (
                <select
                  id="school"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  required
                >
                  <option value="" disabled>Select your school</option>
                  {schools.map((schoolItem) => (
                    <option key={schoolItem._id} value={schoolItem.name}>
                      {schoolItem.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
          
          <button type="submit" disabled={loading || (!isLogin && loadingSchools)}>
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        
        {error && <div className="auth-error">{error}</div>}
        
        <button className="toggle-auth-button" onClick={toggleAuthMode}>
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};

export default AuthScreen;