const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  grades: [
    {
      name: String,      // e.g. "Grade 4"
      year: Number       // optional, e.g. 2025
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("School", schoolSchema);
