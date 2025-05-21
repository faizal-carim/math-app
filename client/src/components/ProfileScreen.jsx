import React, { useEffect, useState } from "react";
import axios from "axios";
import './ProfileScreen.css';

export default function ProfileScreen({ onBack }) {
  const [profile, setProfile] = useState(null);
  const [globalLeaderboard, setGlobalLeaderboard] = useState([]);
  const [schoolLeaderboard, setSchoolLeaderboard] = useState([]);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch profile first
        const res = await axios.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userProfile = res.data;
        setProfile(userProfile);
  
        const { grade, schoolId } = userProfile;
  
        // Fetch global leaderboard filtered by grade
        const globalRes = await axios.get(`/api/leaderboard/global?grade=${grade}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGlobalLeaderboard(globalRes.data);
  
        // Fetch school leaderboard filtered by school and grade
        const schoolRes = await axios.get(`/api/leaderboard/school?schoolId=${schoolId}&grade=${grade}`, {
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
  

  if (error) return <div>{error}</div>;
  if (!profile) return <div>Loading profile...</div>;

  const { _id: userId, name, grade, currency, gameStats, avatar } = profile;

  // Helper to render leaderboard table
  const renderLeaderboard = (data, title) => (
    <div className="leaderboard-section">
      <h3>{title}</h3>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Correct</th>
            <th>Accuracy</th>
            <th>Avg Time</th>
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
  );

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>{name}</h2>
        <button className="profile-button" onClick={onBack}>Play</button>
      </div>

      <div className="profile-details">
        <p><strong>Grade:</strong> {grade}</p>
        <p><strong>Currency:</strong> {currency}</p>
        <p>
          <strong>Game Stats:</strong><br />
          Total Questions: {gameStats.totalQuestions}<br />
          Total Correct: {gameStats.totalCorrect}<br />
          Average Time: {gameStats.averageTime.toFixed(2)}s
        </p>

        <div className="avatar-section">
          <h3>Avatar</h3>
          <p>Hat: {avatar?.equipped?.hat || "None"}</p>
          <p>Glasses: {avatar?.equipped?.glasses || "None"}</p>
          <p>Shirt: {avatar?.equipped?.shirt || "None"}</p>
        </div>
      </div>

      {renderLeaderboard(globalLeaderboard, "🌍 Global Leaderboard")}
      {renderLeaderboard(schoolLeaderboard, "🏫 School Leaderboard")}
    </div>
  );
}
