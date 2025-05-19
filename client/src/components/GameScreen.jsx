// src/components/GameScreen.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GameScreen.css';


export default function GameScreen({ onStop }) {
  const [questionData, setQuestionData] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [startTime, setStartTime] = useState(null);

  const token = localStorage.getItem('token');

  const fetchQuestion = async () => {
    try {
      const res = await axios.get('/api/game/question', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setQuestionData(res.data);
      setUserAnswer('');
      setMessage('');
      setStartTime(Date.now());
    } catch (err) {
      console.error('Error fetching question:', err);
      setMessage('Failed to load question.');
    }
  };

  const checkAnswer = async () => {
    if (!questionData || userAnswer === '') return;

    const timeTaken = (Date.now() - startTime) / 1000;

    try {
      const res = await axios.post(
        '/api/game/submit',
        {
          question: questionData.question,
          correctAnswer: eval(questionData.question.replace('×', '*')),
          userAnswer: Number(userAnswer),
          timeTaken
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(res.data.isCorrect ? '✅ Correct!' : '❌ Incorrect');
      setTimeout(fetchQuestion, 1500);
    } catch (err) {
      console.error('Error submitting answer:', err);
      setMessage('Failed to submit answer.');
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  return (
    <div className="game-container">
      <h2>Math Game</h2>
      {questionData ? (
        <div>
          <p className="question-text">What is {questionData.question}?</p>
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Your answer"
            className="answer-input"
          />
          <div className="button-group">
            <button className="game-button" onClick={checkAnswer}>Submit</button>
            <button className="game-button" onClick={onStop}>Stop</button>
          </div>
          {message && <p className="message-text">{message}</p>}
        </div>
      ) : (
        <p>Loading question...</p>
      )}
    </div>
  );
}
