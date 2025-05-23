import React, { useEffect, useState } from "react";
import axios from "axios";
import './ProfileScreen.css';
import { 
  CoinIcon, 
  PlayIcon, 
  StoreIcon, 
  TrophyIcon, 
  SchoolIcon, 
  TimerIcon,
  AvatarIcon,
  HatIcon,
  GlassesIcon,
  ShirtIcon,
  LogoutIcon,
  AdminIcon
} from './Icons';
import API_URL from '../config';

export default function ProfileScreen({ user, onBack, onLogout, onNavigate }) {
  const [profile, setProfile] = useState(null);
  const [globalLeaderboard, setGlobalLeaderboard] = useState([]);
  const [schoolLeaderboard, setSchoolLeaderboard] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('stats');

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch profile first
        const res = await axios.get(`${API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userProfile = res.data;
        setProfile(userProfile);
  
        const { grade, schoolId } = userProfile;
  
        // Fetch global leaderboard filtered by grade
        const globalRes = await axios.get(`${API_URL}/api/leaderboard/global?grade=${grade}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGlobalLeaderboard(globalRes.data);
  
        // Fetch school leaderboard filtered by school and grade
        const schoolRes = await axios.get(`${API_URL}/api/leaderboard/school?schoolId=${schoolId}&grade=${grade}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSchoolLeaderboard(schoolRes.data);
  
      } catch (err) {
        console.error(err);
        setError("Failed to load profile or leaderboard.");
      }
    }
  
    fetchData();
  }, [token]);

  // Check if user is faizal (case insensitive)
  const isFaizalUser = profile?.name && profile.name.toLowerCase() === "faizal";

  if (error) return <div className="error-message">{error}</div>;
  if (!profile) return <div className="loading">Loading profile...</div>;

  const { name, grade, currency, gameStats, avatar } = profile;

  // Helper to render leaderboard table
  const renderLeaderboard = (data, title, icon) => (
    <div className="leaderboard-section card">
      <div className="leaderboard-header">
        {icon}
        <h3>{title}</h3>
      </div>
      <div className="leaderboard-table-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>
                <div className="icon-text">
                  <TrophyIcon />
                </div>
              </th>
              <th>%</th>
              <th>
                <div className="icon-text">
                  <TimerIcon />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={entry.username}
                className={entry.username === name ? "highlight-row" : ""}>
                <td>{index + 1}</td>
                <td>{entry.username}</td>
                <td>{entry.totalCorrect}</td>
                <td>{entry.accuracy}%</td>
                <td>{entry.averageTime}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Avatar preview
  const renderAvatarPreview = () => (
    <div className="avatar-preview">
      <div className="avatar-figure">
        {avatar?.equipped?.hat && (
          <div className="avatar-hat">
            <HatIcon />
          </div>
        )}
        <div className="avatar-head">😊</div>
        {avatar?.equipped?.glasses && (
          <div className="avatar-glasses">
            <GlassesIcon />
          </div>
        )}
        {avatar?.equipped?.shirt && (
          <div className="avatar-shirt">
            <ShirtIcon />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-title">
          <h2>{name}</h2>
          <div className="profile-subtitle">
            <span className="grade-badge">{grade}</span>
            <div className="currency-display">
              <CoinIcon />
              <span>{currency}</span>
            </div>
          </div>
        </div>
        <div className="profile-actions">
          {(user?.role === 'admin' || isFaizalUser) && (
            <button className="profile-button admin-button icon-button" onClick={() => onNavigate('admin')}>
              <AdminIcon />
              <span>Admin</span>
            </button>
          )}
          <button className="profile-button logout-button icon-button" onClick={onLogout}>
            <LogoutIcon />
            <span>Logout</span>
          </button>
          <button className="profile-button store-button icon-button" onClick={() => onNavigate('store')}>
            <StoreIcon />
            <span>Store</span>
          </button>
          <button className="profile-button play-button icon-button" onClick={() => onNavigate('game')}>
            <PlayIcon />
            <span>Play</span>
          </button>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <TrophyIcon />
          <span>Stats</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'avatar' ? 'active' : ''}`}
          onClick={() => setActiveTab('avatar')}
        >
          <AvatarIcon />
          <span>Avatar</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'global' ? 'active' : ''}`}
          onClick={() => setActiveTab('global')}
        >
          <TrophyIcon />
          <span>Global</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'school' ? 'active' : ''}`}
          onClick={() => setActiveTab('school')}
        >
          <SchoolIcon />
          <span>School</span>
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'stats' && (
          <div className="stats-section card">
            <h3>Game Stats</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-value">{gameStats.totalQuestions}</div>
                <div className="stat-label">Questions</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-value">{gameStats.totalCorrect}</div>
                <div className="stat-label">Correct</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏱️</div>
                <div className="stat-value">{gameStats.averageTime.toFixed(1)}s</div>
                <div className="stat-label">Avg Time</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">%</div>
                <div className="stat-value">
                  {gameStats.totalQuestions > 0 
                    ? Math.round((gameStats.totalCorrect / gameStats.totalQuestions) * 100) 
                    : 0}%
                </div>
                <div className="stat-label">Accuracy</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'avatar' && (
          <div className="avatar-section card">
            <h3>Your Avatar</h3>
            {renderAvatarPreview()}
            <div className="avatar-items">
              <div className="avatar-item">
                <HatIcon />
                <span>{avatar?.equipped?.hat || "None"}</span>
              </div>
              <div className="avatar-item">
                <GlassesIcon />
                <span>{avatar?.equipped?.glasses || "None"}</span>
              </div>
              <div className="avatar-item">
                <ShirtIcon />
                <span>{avatar?.equipped?.shirt || "None"}</span>
              </div>
            </div>
            <button className="store-button icon-button" onClick={() => onNavigate('store')}>
              <StoreIcon />
              <span>Go to Store</span>
            </button>
          </div>
        )}

        {activeTab === 'global' && renderLeaderboard(globalLeaderboard, "Global Leaderboard", <TrophyIcon />)}
        {activeTab === 'school' && renderLeaderboard(schoolLeaderboard, "School Leaderboard", <SchoolIcon />)}
      </div>
    </div>
  );
}