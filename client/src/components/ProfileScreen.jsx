import React, { useEffect, useState } from "react";
import axios from "axios";
import './ProfileScreen.css';

export default function ProfileScreen({ onBack }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        setError("Failed to load profile");
      }
    }
    fetchProfile();
  }, [token]);

  if (error) return <div>{error}</div>;
  if (!profile) return <div>Loading profile...</div>;

  const { name, grade, currency, gameStats, avatar } = profile;

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
          <p>Hat: {avatar.equipped.hat || "None"}</p>
          <p>Glasses: {avatar.equipped.glasses || "None"}</p>
          <p>Shirt: {avatar.equipped.shirt || "None"}</p>
        </div>
      </div>
    </div>
  );
}
