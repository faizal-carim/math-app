import React, { useEffect, useState } from "react";
import axios from "axios";
import "./GameScreen.css";


const GameScreen = () => {
  const [question, setQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const totalQuestions = 10; // you can customize this


    

  const fetchQuestion = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/game/question", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuestion(response.data);
      setUserAnswer("");
      setFeedback("");
    } catch (error) {
      console.error("Error fetching question:", error);
      setFeedback("Error fetching question.");
    }
  };

  const checkAnswer = async () => {
    if (!question) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/game/answer",
        {
          question: question.question,
          answer: Number(userAnswer),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.correct) {
        setFeedback("✅ Correct!");
      } else {
        setFeedback(`❌ Incorrect. Correct answer: ${response.data.correctAnswer}`);
      }

      setTimeout(() => {
        fetchQuestion();
      }, 1500);
    } catch (error) {
      console.error("Error submitting answer:", error);
      setFeedback("Error checking answer.");
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  return (
    <div className="game-screen">
      <h2>Math Challenge</h2>
      {question ? (
        <div>
          <p><strong>{question.question}</strong></p>
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Your answer"
          />
          <button onClick={checkAnswer} disabled={loading}>
            Submit Answer
          </button>
          <p>{feedback}</p>
        </div>
      ) : (
        <p>Loading question...</p>
      )}
    </div>
  );
};

export default GameScreen;
