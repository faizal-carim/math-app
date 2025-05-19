const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");

router.post("/submit", authenticate, async (req, res) => {
  try {
    const { correct, timeTaken } = req.body;
    const user = req.user;

    // Update stats
    user.gameStats.totalQuestions += 1;
    if (correct) {
      user.gameStats.totalCorrect += 1;

      // Reward currency for every 30 correct answers
      if (user.gameStats.totalCorrect % 30 === 0) {
        user.currency += 1;
      }
    }

    // Update average time (basic rolling average)
    const q = user.gameStats.totalQuestions;
    user.gameStats.averageTime = ((user.gameStats.averageTime * (q - 1)) + timeTaken) / q;

    await user.save();

    res.json({
      message: "Answer submitted",
      correct: correct,
      totalCorrect: user.gameStats.totalCorrect,
      totalQuestions: user.gameStats.totalQuestions,
      averageTime: user.gameStats.averageTime,
      currency: user.currency
    });
  } catch (error) {
    res.status(500).json({ message: "Error submitting answer", error: error.message });
  }
});

router.get("/question", authenticate, async (req, res) => {
    const user = req.user;
    const grade = user.grade;
  
    const operations = ["+", "-", "×"];
    const operation = operations[Math.floor(Math.random() * operations.length)];
  
    let min = 1, max = 10;
  
    // Customize difficulty based on grade
    if (grade.includes("Grade 1")) {
      max = 10;
    } else if (grade.includes("Grade 2")) {
      max = 20;
    } else if (grade.includes("Grade 3")) {
      max = 50;
    } else {
      max = 100;
    }
  
    const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    const num2 = Math.floor(Math.random() * (max - min + 1)) + min;
  
    let answer;
    let displayOp;
  
    switch (operation) {
      case "+":
        answer = num1 + num2;
        displayOp = "+";
        break;
      case "-":
        answer = num1 - num2;
        displayOp = "-";
        break;
      case "×":
        answer = num1 * num2;
        displayOp = "×";
        break;
    }
  
    const questionText = `${num1} ${displayOp} ${num2}`;
  
    // Optionally: store in DB or session, but here we just return directly
    res.json({
      question: questionText,
      type: operation,
      questionId: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
    });
  });
  

module.exports = router;
