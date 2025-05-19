const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  question: { type: String, required: true },
  correctAnswer: { type: Number, required: true },
  userAnswer: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true },
  timeTaken: { type: Number, required: true }, // in seconds
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Score", scoreSchema);
