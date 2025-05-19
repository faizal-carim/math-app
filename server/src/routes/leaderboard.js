const express = require("express");
const AnswerAttempt = require("../models/AnswerAttempt");
const User = require("../models/User");
const authenticate = require("../middleware/auth");

const router = express.Router();

// Helper to get leaderboard entries
async function getLeaderboard(schoolId = null, grade = null) {
  const matchQuery = { isCorrect: true };
  if (schoolId) matchQuery.schoolId = schoolId;
  if (grade) matchQuery.grade = grade;

  // Get users with their total correct answers and average time per question
  const leaderboard = await AnswerAttempt.aggregate([
    {
      $match: matchQuery
    },
    {
      $group: {
        _id: "$userId",
        correctAnswers: { $sum: 1 },
        avgTime: { $avg: "$timeTaken" }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: "$user"
    },
    {
      $project: {
        _id: 0,
        userId: "$user._id",
        name: "$user.name",
        grade: "$user.grade",
        schoolId: "$user.schoolId",
        correctAnswers: 1,
        avgTime: 1
      }
    },
    {
      $sort: {
        correctAnswers: -1,
        avgTime: 1
      }
    },
    { $limit: 20 } // top 20
  ]);

  return leaderboard;
}

// Global leaderboard
router.get("/global", authenticate, async (req, res) => {
  try {
    const leaderboard = await getLeaderboard();
    res.json(leaderboard);
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
    const leaderboard = await getLeaderboard(schoolId, grade);
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: "Error fetching school leaderboard", error: err.message });
  }
});

module.exports = router;
