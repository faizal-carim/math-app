import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminScreen.css';

export default function AdminScreen({ onBack, onLogout }) {
  const [schools, setSchools] = useState([]);
  const [newSchool, setNewSchool] = useState({ name: '', licenseExpiry: '' });
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [message, setMessage] = useState('');
  const [grades, setGrades] = useState([{ name: 'Grade 1' }]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const res = await axios.get('/api/admin/schools', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSchools(res.data);
    } catch (err) {
      setMessage('Failed to load schools');
    }
  };

  const handleAddSchool = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/schools', 
        { ...newSchool, grades },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewSchool({ name: '', licenseExpiry: '' });
      setGrades([{ name: 'Grade 1' }]);
      setMessage('School added successfully');
      fetchSchools();
    } catch (err) {
      setMessage('Failed to add school');
    }
  };

  const handleRenewLicense = async (e) => {
    e.preventDefault();
    if (!selectedSchool) return;
    
    try {
      await axios.put(`/api/admin/schools/${selectedSchool._id}/renew`, 
        { licenseExpiry: selectedSchool.licenseExpiry },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('License renewed successfully');
      setSelectedSchool(null);
      fetchSchools();
    } catch (err) {
      setMessage('Failed to renew license');
    }
  };

  const addGradeField = () => {
    setGrades([...grades, { name: '' }]);
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
                <input
                  type="text"
                  value={grade.name}
                  onChange={(e) => updateGrade(index, e.target.value)}
                  placeholder="Grade name (e.g. Grade 1)"
                  required
                />
              </div>
            ))}
            <button type="button" className="add-grade-button" onClick={addGradeField}>Add Grade</button>
          </div>
          
          <button type="submit" className="submit-button">Add School</button>
        </form>
      </div>

      <div className="admin-section">
        <h3>Manage Schools</h3>
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
                <button type="submit" className="renew-button">Renew License</button>
                <button type="button" className="cancel-button" onClick={() => setSelectedSchool(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}