// src/components/GameScreen.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button, 
  IconButton,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  MonetizationOn as CoinIcon,
  SkipNext as SkipIcon,
  CheckCircle as CorrectIcon,
  Cancel as IncorrectIcon,
  Logout as LogoutIcon,
  AccountCircle as ProfileIcon
} from '@mui/icons-material';
import Confetti from 'react-confetti';
import API_URL from '../config';

export default function GameScreen({ user, onLogout, onNavigate }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
  const [showConfetti, setShowConfetti] = useState(false);

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

  const renderKeypadButton = (key) => {
    const isSpecial = key === 'enter' || key === 'del';
    return (
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{ width: '100%' }}
      >
        <Button
          variant={isSpecial ? "contained" : "outlined"}
          color={key === 'enter' ? "primary" : key === 'del' ? "error" : "inherit"}
          fullWidth
          size="large"
          onClick={() => handleKeypadInput(key)}
          sx={{
            height: '60px',
            fontSize: key === 'del' ? '1.5rem' : '1.2rem',
            borderRadius: '12px',
            textTransform: 'none'
          }}
        >
          {key === 'del' ? '⌫' : key === 'enter' ? 'Enter' : key}
        </Button>
      </motion.div>
    );
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 4,
          background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            {userName}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 1.5, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                borderRadius: 2
              }}
            >
              <CoinIcon color="primary" />
              <Typography variant="h6">{currency}</Typography>
            </Paper>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 1.5, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                borderRadius: 2
              }}
            >
              <SkipIcon color="secondary" />
              <Typography variant="h6">{skipsRemaining}</Typography>
            </Paper>
          </Box>
        </Box>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Paper 
            elevation={4} 
            sx={{ 
              p: 4, 
              mb: 4, 
              textAlign: 'center',
              borderRadius: 3,
              background: 'linear-gradient(145deg, #e6f3ff 0%, #ffffff 100%)'
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              What is the answer?
            </Typography>
            <Typography 
              variant="h3" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.main',
                my: 2,
                transform: isAnimating ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.3s ease'
              }}
            >
              {currentQuestion}
            </Typography>
          </Paper>
        </motion.div>

        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            mb: 4, 
            textAlign: 'center',
            borderRadius: 3
          }}
        >
          <Typography variant="h6" gutterBottom>Your Answer</Typography>
          <Typography 
            variant="h4" 
            sx={{ 
              fontFamily: 'monospace',
              letterSpacing: 2,
              color: 'text.primary'
            }}
          >
            {userAnswer || '?'}
          </Typography>
        </Paper>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          {['1','2','3','4','5','6','7','8','9','0','del','enter'].map((key) => (
            <Grid item xs={3} key={key}>
              {renderKeypadButton(key)}
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<SkipIcon />}
            onClick={skipQuestion}
            disabled={skipsRemaining === 0}
            sx={{ borderRadius: 2 }}
          >
            Skip ({skipsRemaining} left)
          </Button>
          <Button
            variant="outlined"
            startIcon={<ProfileIcon />}
            onClick={() => onNavigate('profile')}
            sx={{ borderRadius: 2 }}
          >
            Profile
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={onLogout}
            sx={{ borderRadius: 2 }}
          >
            Logout
          </Button>
        </Box>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                position: 'fixed',
                bottom: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000
              }}
            >
              <Paper 
                elevation={6} 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  borderRadius: 2,
                  background: message.includes('Correct') ? '#e8f5e9' : '#ffebee'
                }}
              >
                {messageIcon}
                <Typography variant="h6">
                  {message}
                </Typography>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Paper>
    </Container>
  );
}