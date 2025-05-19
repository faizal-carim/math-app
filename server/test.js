require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    process.exit();
  })
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit();
  });
