const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Register
router.post("/register", async (req, res) => {
  const { username, password, grade, schoolId } = req.body;

  if (!username || !password || !grade || !schoolId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(409).json({ message: "User already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ username, passwordHash, grade, schoolId });
  await user.save();

  res.status(201).json({ message: "User created" });
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, userId: user._id });
});

module.exports = router;
