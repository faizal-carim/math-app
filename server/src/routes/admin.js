const express = require("express");
const router = express.Router();
const School = require("../models/School");
const User = require("../models/User");
const authenticate = require("../middleware/auth");

// Admin middleware
const isAdmin = (req, res, next) => {
  if (req.user.username !== "faizal") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// Get all schools
router.get("/schools", authenticate, isAdmin, async (req, res) => {
  try {
    console.log("GET /api/admin/schools - Fetching schools");
    const schools = await School.find();
    console.log(`Found ${schools.length} schools`);
    res.json(schools);
  } catch (err) {
    console.error("Error fetching schools:", err);
    res.status(500).json({ message: "Error fetching schools", error: err.message });
  }
});

// Add a new school
router.post("/schools", authenticate, isAdmin, async (req, res) => {
  try {
    console.log("POST /api/admin/schools - Adding school:", req.body);
    const { name, licenseExpiry, grades } = req.body;
    
    if (!name || !licenseExpiry || !grades || !Array.isArray(grades)) {
      return res.status(400).json({ 
        message: "Invalid input. Required: name, licenseExpiry, and grades array" 
      });
    }
    
    const school = new School({
      name,
      licenseExpiry: new Date(licenseExpiry),
      grades
    });
    
    await school.save();
    console.log("School added successfully:", school);
    res.status(201).json(school);
  } catch (err) {
    console.error("Error creating school:", err);
    res.status(500).json({ message: "Error creating school", error: err.message });
  }
});

// Renew school license
router.put("/schools/:id/renew", authenticate, isAdmin, async (req, res) => {
  try {
    console.log(`PUT /api/admin/schools/${req.params.id}/renew - Renewing license`);
    const { licenseExpiry } = req.body;
    
    if (!licenseExpiry) {
      return res.status(400).json({ message: "License expiry date is required" });
    }
    
    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }
    
    school.licenseExpiry = new Date(licenseExpiry);
    await school.save();
    
    console.log("License renewed successfully:", school);
    res.json(school);
  } catch (err) {
    console.error("Error renewing license:", err);
    res.status(500).json({ message: "Error renewing license", error: err.message });
  }
});

module.exports = router;