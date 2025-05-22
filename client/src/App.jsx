import React, { useState, useEffect } from "react";
import AuthScreen from "./components/AuthScreen";
import GameScreen from "./components/GameScreen";
import ProfileScreen from "./components/ProfileScreen";
import StoreScreen from "./components/StoreScreen";
import AdminScreen from "./components/AdminScreen";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [currentScreen, setCurrentScreen] = useState("profile");
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");

  // Check if user is admin
  useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await fetch("/api/user/profile", {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          setUsername(data.username);
          
          // Case-insensitive comparison and debug logging
          const isFaizal = data.username && data.username.toLowerCase() === "faizal";
          console.log("Username:", data.username, "Is Admin:", isFaizal);
          setIsAdmin(isFaizal);
          
          // Force admin for testing if needed
          // setIsAdmin(true);
        } catch (err) {
          console.error("Error checking user status:", err);
        }
      }
    };
    
    if (isAuthenticated) {
      checkUserStatus();
    }
  }, [isAuthenticated]);

  // Handle successful authentication
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setCurrentScreen("profile");
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUsername("");
  };

  if (!isAuthenticated) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  console.log("Current state - isAdmin:", isAdmin, "username:", username);

  switch (currentScreen) {
    case "admin":
      return <AdminScreen onBack={() => setCurrentScreen("profile")} onLogout={handleLogout} />;
    case "profile":
      return <ProfileScreen 
        onBack={() => setCurrentScreen("game")} 
        onStoreClick={() => setCurrentScreen("store")}
        onAdminClick={() => setCurrentScreen("admin")}
        onLogout={handleLogout}
        isAdmin={isAdmin}
        username={username}
      />;
    case "store":
      return <StoreScreen 
        onBack={() => setCurrentScreen("profile")}
        onLogout={handleLogout}
      />;
    case "game":
      return <GameScreen 
        onStop={() => setCurrentScreen("profile")}
        onLogout={handleLogout}
      />;
    default:
      return <ProfileScreen 
        onBack={() => setCurrentScreen("game")} 
        onStoreClick={() => setCurrentScreen("store")}
        onAdminClick={() => setCurrentScreen("admin")}
        onLogout={handleLogout}
        isAdmin={isAdmin}
        username={username}
      />;
  }
}