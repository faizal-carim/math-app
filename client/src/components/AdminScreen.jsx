import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminScreen.css';
import API_URL from '../config';

export default function AdminScreen({ onBack, onLogout }) {
  const [schools, setSchools] = useState([]);
  const [newSchool, setNewSchool] = useState({ name: '', licenseExpiry: '' });
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [message, setMessage] = useState('');
  const [grades, setGrades] = useState([{ name: 'Grade 1' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    setLoading(true);
    setError(null);
    try {
      // Log the request for debugging
      console.log('Fetching schools with token:', token);
      
      const res = await axios.get(`${API_URL}/api/admin/schools`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Schools response:', res.data);
      setSchools(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching schools:', err.response || err);
      setError(err.response?.data?.message || 'Failed to load schools');
      setMessage('Failed to load schools');
      setLoading(false);
    }
  };

  const handleAddSchool = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Log the request for debugging
      console.log('Adding school:', { ...newSchool, grades });
      
      const res = await axios.post(`${API_URL}/api/admin/schools`, 
        { ...newSchool, grades },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      console.log('Add school response:', res.data);
      setNewSchool({ name: '', licenseExpiry: '' });
      setGrades([{ name: 'Grade 1' }]);
      setMessage('School added successfully');
      setLoading(false);
      fetchSchools();
    } catch (err) {
      console.error('Error adding school:', err.response || err);
      setError(err.response?.data?.message || 'Failed to add school');
      setMessage('Failed to add school');
      setLoading(false);
    }
  };

  const handleRenewLicense = async (e) => {
    e.preventDefault();
    if (!selectedSchool) return;
    
    setLoading(true);
    setError(null);
    try {
      const res = await axios.put(`${API_URL}/api/admin/schools/${selectedSchool._id}/renew`, 
        { licenseExpiry: selectedSchool.licenseExpiry },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      console.log('Renew license response:', res.data);
      setMessage('License renewed successfully');
      setSelectedSchool(null);
      setLoading(false);
      fetchSchools();
    } catch (err) {
      console.error('Error renewing license:', err.response || err);
      setError(err.response?.data?.message || 'Failed to renew license');
      setMessage('Failed to renew license');
      setLoading(false);
    }
  };

  const addGradeField = () => {
    setGrades([...grades, { name: 'Grade 1' }]);
  };

  const updateGrade = (index, value) => {
    const updatedGrades = [...grades];
    updatedGrades[index].name = value;
    setGrades(updatedGrades);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const isExpired = (dateString) => {
    return new Date(dateString) < new Date();
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Admin Console</h2>
        <div className="admin-actions">
          <button className="admin-button back-button" onClick={onBack}>Back to Profile</button>
          <button className="admin-button logout-button" onClick={onLogout}>Logout</button>
        </div>
      </div>

      {message && <div className="admin-message">{message}</div>}
      {error && <div className="admin-error">{error}</div>}

      <div className="admin-section">
        <h3>Add New School</h3>
        <form onSubmit={handleAddSchool}>
          <div className="form-group">
            <label>School Name:</label>
            <input 
              type="text" 
              value={newSchool.name} 
              onChange={(e) => setNewSchool({...newSchool, name: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>License Expiry Date:</label>
            <input 
              type="date" 
              value={newSchool.licenseExpiry} 
              onChange={(e) => setNewSchool({...newSchool, licenseExpiry: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Grades:</label>
            {grades.map((grade, index) => (
              <div key={index} className="grade-input">
                <select
                  value={grade.name}
                  onChange={(e) => updateGrade(index, e.target.value)}
                  required
                >
                  <option value="" disabled>Select grade</option>
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i} value={`Grade ${i + 1}`}>
                      Grade {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <button type="button" className="add-grade-button" onClick={addGradeField}>Add Grade</button>
          </div>
          
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Adding...' : 'Add School'}
          </button>
        </form>
      </div>

      <div className="admin-section">
        <h3>Manage Schools</h3>
        {loading ? (
          <div className="loading">Loading schools...</div>
        ) : schools.length > 0 ? (
          <table className="schools-table">
            <thead>
              <tr>
                <th>School Name</th>
                <th>License Expiry</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {schools.map(school => (
                <tr key={school._id} className={isExpired(school.licenseExpiry) ? 'expired-row' : ''}>
                  <td>{school.name}</td>
                  <td>{formatDate(school.licenseExpiry)}</td>
                  <td>{isExpired(school.licenseExpiry) ? 'Expired' : 'Active'}</td>
                  <td>
                    <button 
                      className="renew-button"
                      onClick={() => setSelectedSchool({
                        ...school,
                        licenseExpiry: new Date(school.licenseExpiry).toISOString().split('T')[0]
                      })}
                    >
                      Renew
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-schools">No schools found. Add a school to get started.</div>
        )}
      </div>

      {selectedSchool && (
        <div className="modal">
          <div className="modal-content">
            <h3>Renew License for {selectedSchool.name}</h3>
            <form onSubmit={handleRenewLicense}>
              <div className="form-group">
                <label>New Expiry Date:</label>
                <input 
                  type="date" 
                  value={selectedSchool.licenseExpiry}
                  onChange={(e) => setSelectedSchool({...selectedSchool, licenseExpiry: e.target.value})}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="renew-button" disabled={loading}>
                  {loading ? 'Renewing...' : 'Renew License'}
                </button>
                <button type="button" className="cancel-button" onClick={() => setSelectedSchool(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}