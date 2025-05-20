const express = require("express");
const User = require("../models/User");
const authenticate = require("../middleware/auth");

const router = express.Router();

// Utility to format leaderboard entries
function formatUserStats(user) {
  const { username, grade, schoolId, gameStats } = user;
  const { totalCorrect, totalQuestions, averageTime } = gameStats;

  const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

  return {
    username,
    grade,
    schoolId,
    totalCorrect,
    totalQuestions,
    averageTime: Number(averageTime.toFixed(2)),
    accuracy: Number(accuracy.toFixed(1))
  };
}

// Global leaderboard
router.get("/global", authenticate, async (req, res) => {
  try {
    const users = await User.find()
      .select("username grade schoolId gameStats")
      .sort({ "gameStats.totalCorrect": -1, "gameStats.averageTime": 1 })
      .limit(20);

    const formatted = users.map(formatUserStats);
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Error fetching global leaderboard", error: err.message });
  }
});

// School + grade leaderboard
router.get("/school", authenticate, async (req, res) => {
  const { schoolId, grade } = req.query;

  if (!schoolId || !grade) {
    return res.status(400).json({ message: "schoolId and grade are required" });
  }

  try {
    const users = await User.find({ schoolId, grade })
      .select("username grade schoolId gameStats")
      .sort({ "gameStats.totalCorrect": -1, "gameStats.averageTime": 1 })
      .limit(20);

    const formatted = users.map(formatUserStats);
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Error fetching school leaderboard", error: err.message });
  }
});

module.exports = router;
