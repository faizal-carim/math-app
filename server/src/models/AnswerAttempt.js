const mongoose = require("mongoose");

const answerAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  question: { type: String, required: true },
  userAnswer: { type: String, required: true },
  correctAnswer: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  timeTaken: { type: Number, required: true }, // in seconds
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AnswerAttempt", answerAttemptSchema);
