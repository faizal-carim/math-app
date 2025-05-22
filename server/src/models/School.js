const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  grades: [{ name: String }],
  licenseExpiry: { type: Date, required: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("School", schoolSchema);