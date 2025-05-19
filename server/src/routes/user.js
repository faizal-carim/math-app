const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");

router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      name: user.username,
      email: user.email,
      grade: user.grade,
      schoolId: user.schoolId,
      currency: user.currency,
      gameStats: user.gameStats,
      avatar: user.avatar || {},
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get user profile", error: error.message });
  }
});

module.exports = router;
