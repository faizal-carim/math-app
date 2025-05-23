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
  const [schoolId, setSchoolId] = useState('');
  const [grade, setGrade] = useState('');
  const [schools, setSchools] = useState([]);
  const [grades, setGrades] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [loadingGrades, setLoadingGrades] = useState(false);

  // Fetch schools for registration
  useEffect(() => {
    if (!isLogin) {
      fetchSchools();
    }
  }, [isLogin]);

  // Fetch grades when school changes
  useEffect(() => {
    if (schoolId && !isLogin) {
      fetchGrades(schoolId);
    }
  }, [schoolId, isLogin]);

  const fetchSchools = async () => {
    try {
      setLoadingSchools(true);
      // Try with /api/school first
      try {
        const response = await axios.get(`${API_URL}/api/school`);
        if (response.data && Array.isArray(response.data)) {
          setSchools(response.data);
          if (response.data.length > 0) {
            setSchool(response.data[0].name);
            setSchoolId(response.data[0]._id);
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
            setSchool(response.data[0].name);
            setSchoolId(response.data[0]._id);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching schools:', err);
      // Use hardcoded schools as last resort
      const defaultSchools = [
        { _id: '1', name: 'School A', grades: [{ name: 'Grade 1' }, { name: 'Grade 2' }] },
        { _id: '2', name: 'School B', grades: [{ name: 'Grade 3' }, { name: 'Grade 4' }] },
        { _id: '3', name: 'School C', grades: [{ name: 'Grade 5' }, { name: 'Grade 6' }] }
      ];
      setSchools(defaultSchools);
      setSchool(defaultSchools[0].name);
      setSchoolId(defaultSchools[0]._id);
      setGrades(defaultSchools[0].grades);
      if (defaultSchools[0].grades.length > 0) {
        setGrade(defaultSchools[0].grades[0].name);
      }
    } finally {
      setLoadingSchools(false);
    }
  };

  const fetchGrades = async (id) => {
    try {
      setLoadingGrades(true);
      setGrade(''); // Reset grade when school changes
      
      // Try to get grades from the school object first
      const selectedSchool = schools.find(s => s._id === id);
      if (selectedSchool && selectedSchool.grades) {
        setGrades(selectedSchool.grades);
        if (selectedSchool.grades.length > 0) {
          setGrade(selectedSchool.grades[0].name);
        }
        setLoadingGrades(false);
        return;
      }
      
      // If grades not in school object, fetch from API
      try {
        const response = await axios.get(`${API_URL}/api/school/${id}/grades`);
        if (response.data && Array.isArray(response.data)) {
          setGrades(response.data);
          if (response.data.length > 0) {
            setGrade(response.data[0].name);
          }
        }
      } catch (err) {
        console.error('Error fetching grades:', err);
        // Use default grades as fallback
        const defaultGrades = [
          { name: 'Grade 1' },
          { name: 'Grade 2' },
          { name: 'Grade 3' }
        ];
        setGrades(defaultGrades);
        setGrade(defaultGrades[0].name);
      }
    } finally {
      setLoadingGrades(false);
    }
  };

  const handleSchoolChange = (e) => {
    const selectedSchoolId = e.target.value;
    const selectedSchool = schools.find(s => s._id === selectedSchoolId);
    setSchoolId(selectedSchoolId);
    setSchool(selectedSchool ? selectedSchool.name : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { username, password } 
        : { username, password, schoolId, grade };
      
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
          id: response.data.userId || Date.now().toString(),
          schoolId: schoolId,
          grade: grade
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
            <>
              <div className="form-group">
                <label htmlFor="school">School</label>
                {loadingSchools ? (
                  <div className="loading-schools">Loading schools...</div>
                ) : (
                  <select
                    id="school"
                    value={schoolId}
                    onChange={handleSchoolChange}
                    required
                  >
                    <option value="" disabled>Select your school</option>
                    {schools.map((schoolItem) => (
                      <option key={schoolItem._id} value={schoolItem._id}>
                        {schoolItem.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="grade">Grade</label>
                {loadingGrades ? (
                  <div className="loading-grades">Loading grades...</div>
                ) : (
                  <select
                    id="grade"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    required
                    disabled={grades.length === 0}
                  >
                    <option value="" disabled>Select your grade</option>
                    {grades.map((gradeItem, index) => (
                      <option key={index} value={gradeItem.name}>
                        {gradeItem.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </>
          )}
          
          <button type="submit" disabled={loading || (!isLogin && (loadingSchools || loadingGrades))}>
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