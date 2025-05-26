const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const User = require("../models/User");

router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate([
      "avatar.equipped.hat",
      "avatar.equipped.glasses",
      "avatar.equipped.shirt",
      "avatar.ownedItems"
    ]);
    
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
