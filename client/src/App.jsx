import React, { useState } from "react";
import AuthScreen from "./components/AuthScreen";
import GameScreen from "./components/GameScreen";
import ProfileScreen from "./components/ProfileScreen";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [showProfile, setShowProfile] = useState(false);

  if (!isAuthenticated) {
    return <AuthScreen onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  if (showProfile) {
    return <ProfileScreen onBack={() => setShowProfile(false)} />;
  }

  return <GameScreen onStop={() => setShowProfile(true)} />;
}
