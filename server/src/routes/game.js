const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");

router.post("/submit", authenticate, async (req, res) => {
  try {
    const { question, userAnswer, timeTaken } = req.body;
    const user = req.user;

    if (!question || userAnswer === undefined || timeTaken === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Parse the question string like "19 × 39" or "6 x 7"
    // Normalize multiplication signs to '*', spaces trimmed
    const normalizedQuestion = question.replace(/×|x/g, '*').trim();

    // Evaluate the expression safely
    let correctAnswer;
    try {
      // Very simple eval replacement, safe because input is strictly math expressions from your server
      // You could enhance this if needed
      correctAnswer = Function(`return (${normalizedQuestion})`)();
    } catch (e) {
      return res.status(400).json({ message: "Invalid question format" });
    }

    const isCorrect = Number(userAnswer) === correctAnswer;

    // Update user stats
    user.gameStats.totalQuestions = (user.gameStats.totalQuestions || 0) + 1;

    if (isCorrect) {
      user.gameStats.totalCorrect = (user.gameStats.totalCorrect || 0) + 1;

      // Reward currency for every 30 correct answers
      if (user.gameStats.totalCorrect % 30 === 0) {
        user.currency = (user.currency || 0) + 1;
      }
    }

    // Update average time (rolling average)
    const q = user.gameStats.totalQuestions;
    user.gameStats.averageTime = ((user.gameStats.averageTime || 0) * (q - 1) + timeTaken) / q;

    await user.save();

    res.json({
      message: "Answer submitted",
      isCorrect,
      totalCorrect: user.gameStats.totalCorrect,
      totalQuestions: user.gameStats.totalQuestions,
      averageTime: user.gameStats.averageTime,
      currency: user.currency
    });
  } catch (error) {
    console.error(error);
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
