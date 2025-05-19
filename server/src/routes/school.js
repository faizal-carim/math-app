const express = require("express");
const School = require("../models/School");
const User = require("../models/User");
const authenticate = require("../middleware/auth");

const router = express.Router();

// Create a new school with grades
router.post("/", async (req, res) => {
  const { name, grades } = req.body;

  if (!name || !grades || !grades.length) {
    return res.status(400).json({ message: "School name and at least one grade required" });
  }

  try {
    const newSchool = new School({ name, grades });
    await newSchool.save();
    res.status(201).json(newSchool);
  } catch (err) {
    res.status(500).json({ message: "Error creating school", error: err.message });
  }
});

// Get list of all schools
router.get("/", async (req, res) => {
  const schools = await School.find();
  res.json(schools);
});

// Get all grades for a school
router.get("/:id/grades", async (req, res) => {
  const school = await School.findById(req.params.id);
  if (!school) return res.status(404).json({ message: "School not found" });
  res.json(school.grades);
});

// Assign student to school + grade
router.post("/assign-student", authenticate, async (req, res) => {
  const { schoolId, grade } = req.body;
  const userId = req.userId;

  try {
    const school = await School.findById(schoolId);
    if (!school) return res.status(404).json({ message: "School not found" });

    const gradeExists = school.grades.find(g => g.name === grade);
    if (!gradeExists) return res.status(400).json({ message: "Grade not found in this school" });

    const user = await User.findByIdAndUpdate(
      userId,
      { schoolId, grade },
      { new: true }
    );

    res.json({ message: "Student assigned", user });
  } catch (err) {
    res.status(500).json({ message: "Error assigning student", error: err.message });
  }
});

module.exports = router;
