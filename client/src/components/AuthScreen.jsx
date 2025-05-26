import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  School as SchoolIcon,
  Grade as GradeIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon
} from '@mui/icons-material';
import API_URL from '../config';
import './AuthScreen.css';

const AuthScreen = ({ onLogin }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

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
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 4,
            background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)'
          }}
        >
          <motion.div variants={itemVariants}>
            <Typography 
              variant="h4" 
              component="h1" 
              align="center" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 4
              }}
            >
              {isLogin ? 'Welcome Back!' : 'Join Math Game'}
            </Typography>
          </motion.div>

          <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
          >
            <motion.div variants={itemVariants}>
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
            </motion.div>

            {!isLogin && (
              <>
                <motion.div variants={itemVariants}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>School</InputLabel>
                    <Select
                      value={schoolId}
                      onChange={handleSchoolChange}
                      label="School"
                      startAdornment={<SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />}
                      disabled={loadingSchools}
                    >
                      {schools.map((school) => (
                        <MenuItem key={school._id} value={school._id}>
                          {school.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {loadingSchools && (
                      <CircularProgress size={20} sx={{ position: 'absolute', right: 12, top: 12 }} />
                    )}
                  </FormControl>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Grade</InputLabel>
                    <Select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      label="Grade"
                      startAdornment={<GradeIcon sx={{ mr: 1, color: 'primary.main' }} />}
                      disabled={loadingGrades || grades.length === 0}
                    >
                      {grades.map((gradeItem, index) => (
                        <MenuItem key={index} value={gradeItem.name}>
                          {gradeItem.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {loadingGrades && (
                      <CircularProgress size={20} sx={{ position: 'absolute', right: 12, top: 12 }} />
                    )}
                  </FormControl>
                </motion.div>
              </>
            )}

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading || (!isLogin && (loadingSchools || loadingGrades))}
                startIcon={isLogin ? <LoginIcon /> : <RegisterIcon />}
                sx={{ 
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem'
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : isLogin ? (
                  'Login'
                ) : (
                  'Create Account'
                )}
              </Button>
            </motion.div>

            {error && (
              <motion.div variants={itemVariants}>
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <Button
                variant="text"
                onClick={toggleAuthMode}
                fullWidth
                sx={{ 
                  mt: 2,
                  textTransform: 'none',
                  color: 'text.secondary'
                }}
              >
                {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
              </Button>
            </motion.div>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default AuthScreen;