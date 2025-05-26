import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Tab,
  Tabs,
  Card,
  CardContent,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  MonetizationOn as CoinIcon,
  PlayArrow as PlayIcon,
  Store as StoreIcon,
  EmojiEvents as TrophyIcon,
  School as SchoolIcon,
  Timer as TimerIcon,
  Person as AvatarIcon,
  SportsEsports as GameIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
  CheckCircle as CorrectIcon,
  Speed as SpeedIcon,
  Percent as PercentIcon,
  QuestionAnswer as QuestionIcon
} from '@mui/icons-material';
import API_URL from '../config';

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    {...other}
  >
    {value === index && (
      <Box sx={{ py: 3 }}>
        {children}
      </Box>
    )}
  </div>
);

export default function ProfileScreen({ user, onBack, onLogout, onNavigate }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [profile, setProfile] = useState(null);
  const [globalLeaderboard, setGlobalLeaderboard] = useState([]);
  const [schoolLeaderboard, setSchoolLeaderboard] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userProfile = res.data;
        setProfile(userProfile);

        const { grade, schoolId } = userProfile;

        const [globalRes, schoolRes] = await Promise.all([
          axios.get(`${API_URL}/api/leaderboard/global?grade=${grade}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/leaderboard/school?schoolId=${schoolId}&grade=${grade}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        setGlobalLeaderboard(globalRes.data);
        setSchoolLeaderboard(schoolRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile or leaderboard.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [token]);

  const isFaizalUser = profile?.name && profile.name.toLowerCase() === "faizal";

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center', color: 'error.main' }}>
          <Typography variant="h6">{error}</Typography>
        </Paper>
      </Container>
    );
  }

  if (!profile) return null;

  const { name, grade, currency, gameStats, avatar } = profile;

  const renderLeaderboard = (data, title) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {title === "Global Leaderboard" ? <TrophyIcon color="primary" /> : <SchoolIcon color="primary" />}
          {title}
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left' }}>#</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>User</th>
                <th style={{ padding: '12px', textAlign: 'center' }}><CorrectIcon /></th>
                <th style={{ padding: '12px', textAlign: 'center' }}>%</th>
                <th style={{ padding: '12px', textAlign: 'center' }}><TimerIcon /></th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry, index) => (
                <motion.tr
                  key={entry.username}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    backgroundColor: entry.username === name ? theme.palette.primary.light + '20' : 'transparent',
                    borderRadius: '4px'
                  }}
                >
                  <td style={{ padding: '12px' }}>{index + 1}</td>
                  <td style={{ padding: '12px' }}>{entry.username}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{entry.totalCorrect}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{entry.accuracy}%</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{entry.averageTime}s</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Paper>
    </motion.div>
  );

  const renderAvatarPreview = () => (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
        <Box sx={{ 
          width: 120, 
          height: 120, 
          mx: 'auto', 
          mb: 2,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: theme.palette.primary.main,
              fontSize: '2rem'
            }}
          >
            {name.charAt(0).toUpperCase()}
          </Avatar>
          {avatar?.equipped?.hat && (
            <Box sx={{ position: 'absolute', top: -20 }}>
              <GameIcon color="primary" sx={{ fontSize: 40 }} />
            </Box>
          )}
          {avatar?.equipped?.glasses && (
            <Box sx={{ position: 'absolute', top: 20 }}>
              <GameIcon color="secondary" sx={{ fontSize: 30 }} />
            </Box>
          )}
        </Box>
        <Typography variant="h6" gutterBottom>Your Avatar</Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={4}>
            <Paper sx={{ p: 1, textAlign: 'center' }}>
              <GameIcon color="primary" />
              <Typography variant="body2">{avatar?.equipped?.hat || "No Hat"}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ p: 1, textAlign: 'center' }}>
              <GameIcon color="secondary" />
              <Typography variant="body2">{avatar?.equipped?.glasses || "No Glasses"}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ p: 1, textAlign: 'center' }}>
              <GameIcon color="success" />
              <Typography variant="body2">{avatar?.equipped?.shirt || "No Shirt"}</Typography>
            </Paper>
          </Grid>
        </Grid>
        <Button
          variant="contained"
          startIcon={<StoreIcon />}
          onClick={() => onNavigate('store')}
          sx={{ mt: 3 }}
        >
          Visit Store
        </Button>
      </Paper>
    </motion.div>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            borderRadius: 4,
            background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                {name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    px: 2, 
                    py: 0.5, 
                    borderRadius: 2,
                    bgcolor: 'primary.main',
                    color: 'white'
                  }}
                >
                  <Typography variant="subtitle1">{grade}</Typography>
                </Paper>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CoinIcon color="primary" />
                  <Typography variant="h6">{currency}</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {(user?.role === 'admin' || isFaizalUser) && (
                <Button
                  variant="outlined"
                  startIcon={<AdminIcon />}
                  onClick={() => onNavigate('admin')}
                >
                  Admin
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlayIcon />}
                onClick={() => onNavigate('game')}
              >
                Play
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={onLogout}
              >
                Logout
              </Button>
            </Box>
          </Box>

          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant={isMobile ? "fullWidth" : "standard"}
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
          >
            <Tab icon={<TrophyIcon />} label="Stats" />
            <Tab icon={<AvatarIcon />} label="Avatar" />
            <Tab icon={<TrophyIcon />} label="Global" />
            <Tab icon={<SchoolIcon />} label="School" />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <QuestionIcon color="primary" sx={{ fontSize: 40 }} />
                    <Typography variant="h4" sx={{ my: 1 }}>{gameStats.totalQuestions}</Typography>
                    <Typography color="text.secondary">Questions</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <CorrectIcon color="success" sx={{ fontSize: 40 }} />
                    <Typography variant="h4" sx={{ my: 1 }}>{gameStats.totalCorrect}</Typography>
                    <Typography color="text.secondary">Correct</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <SpeedIcon color="info" sx={{ fontSize: 40 }} />
                    <Typography variant="h4" sx={{ my: 1 }}>{gameStats.averageTime.toFixed(1)}s</Typography>
                    <Typography color="text.secondary">Avg Time</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <PercentIcon color="secondary" sx={{ fontSize: 40 }} />
                    <Typography variant="h4" sx={{ my: 1 }}>
                      {gameStats.totalQuestions > 0 
                        ? Math.round((gameStats.totalCorrect / gameStats.totalQuestions) * 100) 
                        : 0}%
                    </Typography>
                    <Typography color="text.secondary">Accuracy</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            {renderAvatarPreview()}
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            {renderLeaderboard(globalLeaderboard, "Global Leaderboard")}
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            {renderLeaderboard(schoolLeaderboard, "School Leaderboard")}
          </TabPanel>
        </Paper>
      </motion.div>
    </Container>
  );
}