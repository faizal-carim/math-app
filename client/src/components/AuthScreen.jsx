import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AuthScreen.css';
import API_URL from '../config';

export default function AuthScreen({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    grade: '',
    schoolId: ''
  });
  const [error, setError] = useState('');
  const [schools, setSchools] = useState([]);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    // Fetch schools on component mount
    async function fetchSchools() {
      try {
        const res = await axios.get(`${API_URL}/api/schools`);
        setSchools(res.data);
      } catch (err) {
        console.error('Error fetching schools', err);
      }
    }
    fetchSchools();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSchoolChange = (e) => {
    const selectedSchoolId = e.target.value;
    const selectedSchool = schools.find(s => s._id === selectedSchoolId);
    setFormData({ ...formData, schoolId: selectedSchoolId, grade: '' });
    setGrades(selectedSchool ? selectedSchool.grades : []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin ? `${API_URL}/api/auth/login` : `${API_URL}/api/auth/register`;
      const payload = isLogin
        ? { username: formData.username, password: formData.password }
        : formData;

      const res = await axios.post(url, payload);
      const { token, userId } = res.data; 
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      
      // Call onAuthSuccess to navigate to profile page
      onAuthSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input name="username" placeholder="Username" onChange={handleChange} required />
        {!isLogin && (
          <input name="email" placeholder="Email" type="email" onChange={handleChange} required />
        )}
        <input name="password" placeholder="Password" type="password" onChange={handleChange} required />
  
        {!isLogin && (
          <>
            <select name="schoolId" onChange={handleSchoolChange} required value={formData.schoolId}>
              <option value="">Select School</option>
              {schools.map(school => (
                <option key={school._id} value={school._id}>{school.name}</option>
              ))}
            </select>
  
            <select name="grade" onChange={handleChange} required value={formData.grade} disabled={!grades.length}>
              <option value="">Select Grade</option>
              {grades.map(g => (
                <option key={g._id} value={g.name}>{g.name}</option>
              ))}
            </select>
          </>
        )}
  
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
  
      {error && <p className="auth-error">{error}</p>}
  
      <button onClick={() => setIsLogin(!isLogin)} className="toggle-auth-button">
        {isLogin ? 'Need to register?' : 'Already have an account?'}
      </button>
    </div>
  );
}