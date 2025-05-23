// src/components/GameScreen.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GameScreen.css';
import { CoinIcon, SkipIcon, CorrectIcon, IncorrectIcon, LogoutIcon } from './Icons';
import API_URL from '../config';

export default function GameScreen({ onStop, onLogout }) {
  const [questionData, setQuestionData] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [messageIcon, setMessageIcon] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [skipsRemaining, setSkipsRemaining] = useState(3);
  const [currency, setCurrency] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("Loading...");
  const [userName, setUserName] = useState("Math Game");

  const token = localStorage.getItem('token');

  // Fetch user profile to get initial currency and name
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const res = await axios.get(`${API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrency(res.data.currency || 0);
        if (res.data.name) {
          setUserName(res.data.name);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    }
    
    fetchUserProfile();
  }, [token]);

  const fetchQuestion = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/game/question`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Question data:", res.data);
      
      if (res.data && res.data.question) {
        setCurrentQuestion(res.data.question + " = ?");
        setQuestionData(res.data);
      } else {
        setCurrentQuestion("Error loading question");
      }
      
      setUserAnswer('');
      setMessage('');
      setMessageIcon(null);
      setStartTime(Date.now());
    } catch (err) {
      console.error('Error fetching question:', err);
      setMessage('Failed to load question.');
      setCurrentQuestion("Error loading question");
    }
  };

  const checkAnswer = async () => {
    if (!questionData || userAnswer === '') return;

    const timeTaken = (Date.now() - startTime) / 1000;

    try {
      const res = await axios.post(
        `${API_URL}/api/game/submit`,
        {
          question: questionData.question,
          userAnswer: Number(userAnswer),
          timeTaken
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setCurrency(res.data.currency);
      
      if (res.data.isCorrect) {
        setMessage('Correct!');
        setMessageIcon(<CorrectIcon />);
      } else {
        setMessage('Incorrect');
        setMessageIcon(<IncorrectIcon />);
      }
      
      setIsAnimating(true);
      
      // Always fetch a new question after a short delay, regardless of whether the answer was correct
      setTimeout(() => {
        setIsAnimating(false);
        fetchQuestion();
      }, 1500);
    } catch (err) {
      console.error('Error submitting answer:', err);
      setMessage('Failed to submit answer.');
    }
  };

  const skipQuestion = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/api/game/skip`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update skips remaining (3 - current skips)
      const skipsUsed = res.data.skippedQuestions;
      setSkipsRemaining(3 - skipsUsed);
      setCurrency(res.data.currency);
      
      // If skips reached 0, show message about coin deduction
      if (skipsUsed === 0 && skipsRemaining !== 3) {
        setMessage('Coin deducted!');
        setMessageIcon(<CoinIcon />);
        setTimeout(() => {
          setMessage('');
          setMessageIcon(null);
          fetchQuestion();
        }, 1500);
      } else {
        setMessage(`Skipped! (${3 - skipsUsed} left)`);
        setMessageIcon(<SkipIcon />);
        setTimeout(() => {
          setMessage('');
          setMessageIcon(null);
          fetchQuestion();
        }, 1000);
      }
    } catch (err) {
      console.error('Error skipping question:', err);
      setMessage('Failed to skip question.');
    }
  };

  const handleKeypadInput = (value) => {
    if (value === 'del') {
      setUserAnswer((prev) => prev.slice(0, -1));
    } else if (value === 'enter') {
      checkAnswer();
    } else {
      setUserAnswer((prev) => prev + value);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>{userName}</h2>
        <div className="game-stats">
          <div className="stat-item">
            <CoinIcon />
            <span>{currency} Coins</span>
          </div>
          <div className="stat-item">
            <SkipIcon />
            <span>{skipsRemaining} Skips</span>
          </div>
        </div>
      </div>

      <div className="game-content">
        <div className="question-section">
          <h3>What is the answer?</h3>
          <div className={`question-bubble ${isAnimating ? 'pop-animation' : ''}`}>
            <div className="question-text">{currentQuestion}</div>
          </div>
        </div>
        
        <div className="answer-section">
          <label htmlFor="answer">Your Answer:</label>
          <div className="answer-display">
            <div className="answer-box" id="answer">{userAnswer || '?'}</div>
          </div>
        </div>
        
        <div className="keypad">
          {['1','2','3','4','5','6','7','8','9','0','del','enter'].map((key) => (
            <button
              key={key}
              className={`keypad-button ${key === 'enter' ? 'enter' : ''} ${key === 'del' ? 'del' : ''}`}
              onClick={() => handleKeypadInput(key)}
            >
              {key === 'del' ? '⌫' : key === 'enter' ? 'Enter' : key}
            </button>
          ))}
        </div>
        
        <div className="game-actions">
          <button className="game-button skip-button" onClick={skipQuestion}>
            <SkipIcon />
            <span>Skip</span>
          </button>
          <button className="game-button stop-button" onClick={onStop}>
            <span>Profile</span>
          </button>
        </div>
        
        <div className="logout-container">
          <button className="logout-button" onClick={onLogout}>
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </div>
        
        {message && (
          <div className="message-container">
            {messageIcon}
            <p className="message-text">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}