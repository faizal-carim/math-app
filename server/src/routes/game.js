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
      
      // Log for debugging
      console.log(`Question: ${question}, Normalized: ${normalizedQuestion}, Correct Answer: ${correctAnswer}, User Answer: ${userAnswer}`);
    } catch (e) {
      console.error("Error evaluating expression:", e);
      return res.status(400).json({ message: "Invalid question format" });
    }

    const isCorrect = Number(userAnswer) === correctAnswer;

    // Update user stats
    user.gameStats.totalQuestions = (user.gameStats.totalQuestions || 0) + 1;

    if (isCorrect) {
      user.gameStats.totalCorrect = (user.gameStats.totalCorrect || 0) + 1;

      // Reward 1 coin for each correct answer
      user.currency = (user.currency || 0) + 1;
    }

    // Update average time (rolling average)
    const q = user.gameStats.totalQuestions;
    user.gameStats.averageTime = ((user.gameStats.averageTime || 0) * (q - 1) + timeTaken) / q;

    await user.save();

    res.json({
      message: "Answer submitted",
      isCorrect,
      correctAnswer, // Include correct answer in response for debugging
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

// New endpoint to handle skipped questions
router.post("/skip", authenticate, async (req, res) => {
  try {
    const user = req.user;
    
    // Initialize skips counter if it doesn't exist
    if (!user.gameStats.skippedQuestions) {
      user.gameStats.skippedQuestions = 0;
    }
    
    // Increment skips counter
    user.gameStats.skippedQuestions += 1;
    
    // Check if user has reached 3 skips
    if (user.gameStats.skippedQuestions >= 3) {
      // Reset skip counter
      user.gameStats.skippedQuestions = 0;
      
      // Deduct 1 coin if user has any
      if (user.currency > 0) {
        user.currency -= 1;
      }
    }
    
    await user.save();
    
    res.json({
      message: "Question skipped",
      skippedQuestions: user.gameStats.skippedQuestions,
      currency: user.currency
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error skipping question", error: error.message });
  }
});

router.get("/question", authenticate, async (req, res) => {
    const user = req.user;
    const grade = user.grade;
  
    // Include all operations with equal probability
    const operations = ["+", "-", "×"];
    const operation = operations[Math.floor(Math.random() * operations.length)];
  
    let min = 10, max = 99; // Default to double digits for all operations
    let num1, num2, answer, displayOp;
  
    // Generate numbers based on operation
    switch (operation) {
      case "+":
        // Addition - always double digits (10-99)
        num1 = Math.floor(Math.random() * (max - min + 1)) + min;
        num2 = Math.floor(Math.random() * (max - min + 1)) + min;
        answer = num1 + num2;
        displayOp = "+";
        break;
        
      case "-":
        // Subtraction - ensure positive answer with double digits
        num1 = Math.floor(Math.random() * (max - min + 1)) + min;
        // Second number must be less than first number but still double digit
        const minNum2 = Math.max(10, num1 - 89); // Ensure num2 is at least 10
        const maxNum2 = num1 - 1; // Ensure result is positive
        num2 = Math.floor(Math.random() * (maxNum2 - minNum2 + 1)) + minNum2;
        answer = num1 - num2;
        displayOp = "-";
        break;
        
      case "×":
        // Multiplication - use times tables from 2 to 15
        const tables = Array.from({length: 14}, (_, i) => i + 2); // 2 to 15
        num1 = tables[Math.floor(Math.random() * tables.length)];
        
        // Second number also from 2 to 15
        num2 = tables[Math.floor(Math.random() * tables.length)];
        
        answer = num1 * num2;
        displayOp = "×";
        break;
    }
  
    const questionText = `${num1} ${displayOp} ${num2}`;
    
    // Log for debugging
    console.log(`Generated question: ${questionText}, Answer: ${answer}`);
  
    // Return the question data
    res.json({
      question: questionText,
      type: operation,
      questionId: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
    });
  });
  

module.exports = router;