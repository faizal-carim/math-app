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
  CircularProgress,
  Chip
} from '@mui/material';
import {
  MonetizationOn as CoinIcon,
  PlayArrow as PlayIcon,
  Store as StoreIcon,
  EmojiEvents as TrophyIcon,
  School as SchoolIcon,
  Timer as TimerIcon,
  Person as PersonIcon,
  SportsEsports as MuiHatIcon,
  Visibility as MuiGlassesIcon,
  Checkroom as MuiShirtIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
  CheckCircle as CorrectIcon,
  Speed as SpeedIcon,
  Percent as PercentIcon,
  QuestionAnswer as QuestionIcon,
  Face as FaceIcon,
  Circle as CircleIcon,
  RadioButtonUnchecked as HeadIcon,
  ChildCare as ChildIcon,
  SentimentSatisfied as SmileIcon,
  Face2 as Face2Icon,
  AutoAwesome as WizardHatIcon,
  Psychology as SmartGlassesIcon,
  CardTravel as CapeIcon,
  EmojiObjects as MagicHatIcon,
  Lightbulb as BrainGlassesIcon,
  Favorite as HeartCapeIcon
} from '@mui/icons-material';
import { HatIcon, GlassesIcon, ShirtIcon } from './Icons';
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

const CustomAvatar = ({ name, equipped, size = 120 }) => {
  const theme = useTheme();
  const avatarSize = size * 0.8;
  const itemSize = size * 0.4;
  const headSize = avatarSize * 0.4; // Reduced head size

  const getItemIcon = (category, isEquipped) => {
    if (!isEquipped) return null;
    
    switch(category) {
      case 'hat':
        return (
          <Box 
            component="span"
            sx={{ 
              position: 'relative',
              display: 'inline-block',
              '& svg': {
                width: headSize * 1.2, // Adjusted to head size
                height: headSize * 1.2,
                filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.2))'
              }
            }}
          >
            <HatIcon />
          </Box>
        );
      case 'glasses':
        return (
          <Box 
            component="span"
            sx={{ 
              position: 'relative',
              display: 'inline-block',
              '& svg': {
                width: headSize * 0.9, // Adjusted to head size
                height: headSize * 0.9,
                filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.2))'
              }
            }}
          >
            <GlassesIcon />
          </Box>
        );
      case 'shirt':
        return (
          <Box 
            component="span"
            sx={{ 
              position: 'relative',
              display: 'inline-block',
              '& svg': {
                width: avatarSize * 0.8, // Adjusted to body size
                height: avatarSize * 0.8,
                filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.2))'
              }
            }}
          >
            <ShirtIcon />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box 
      component="span"
      sx={{ 
        position: 'relative',
        width: size,
        height: size,
        display: 'inline-block',
        lineHeight: 0
      }}
    >
      {/* Avatar Container */}
      <Box 
        component="span"
        sx={{
          position: 'relative',
          width: avatarSize,
          height: avatarSize,
          display: 'inline-block',
          lineHeight: 0
        }}
      >
        {/* Head with Ears */}
        <Box 
          component="span"
          sx={{
            position: 'relative',
            width: headSize,
            height: headSize,
            zIndex: 2,
            left: '50%',
            transform: 'translateX(-50%)',
            top: avatarSize * 0.1
          }}
        >
          {/* Ears */}
          <Box 
            component="span"
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              zIndex: 1
            }}
          >
            {/* Left Ear */}
            <Box 
              component="span"
              sx={{
                position: 'absolute',
                left: -headSize * 0.2,
                top: headSize * 0.3,
                width: headSize * 0.3,
                height: headSize * 0.4,
                borderRadius: '50%',
                bgcolor: '#FFD3B6',
                border: '3px solid',
                borderColor: theme.palette.background.paper,
                boxShadow: 2,
                transform: 'rotate(-15deg)'
              }} 
            />
            {/* Right Ear */}
            <Box 
              component="span"
              sx={{
                position: 'absolute',
                right: -headSize * 0.2,
                top: headSize * 0.3,
                width: headSize * 0.3,
                height: headSize * 0.4,
                borderRadius: '50%',
                bgcolor: '#FFD3B6',
                border: '3px solid',
                borderColor: theme.palette.background.paper,
                boxShadow: 2,
                transform: 'rotate(15deg)'
              }} 
            />
          </Box>

          {/* Face */}
          <Box 
            component="span"
            sx={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              bgcolor: '#FFD3B6',
              display: 'inline-block',
              position: 'relative',
              border: '3px solid',
              borderColor: theme.palette.background.paper,
              boxShadow: 3,
              overflow: 'hidden',
              zIndex: 2
            }}
          >
            {/* Face Features */}
            <Box 
              component="span"
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'inline-block',
                pt: headSize * 0.05
              }}
            >
              {/* Eyes */}
              <Box 
                component="span"
                sx={{
                  position: 'absolute',
                  width: '100%',
                  top: headSize * 0.35,
                  display: 'inline-flex',
                  justifyContent: 'center',
                  gap: headSize * 0.15
                }}
              >
                {/* Left Eye */}
                <Box 
                  component="span"
                  sx={{
                    width: headSize * 0.08,
                    height: headSize * 0.08,
                    borderRadius: '50%',
                    bgcolor: theme.palette.primary.dark,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: '20%',
                      left: '20%',
                      width: '30%',
                      height: '30%',
                      borderRadius: '50%',
                      bgcolor: 'white'
                    }
                  }} 
                />
                {/* Right Eye */}
                <Box 
                  component="span"
                  sx={{
                    width: headSize * 0.08,
                    height: headSize * 0.08,
                    borderRadius: '50%',
                    bgcolor: theme.palette.primary.dark,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: '20%',
                      left: '20%',
                      width: '30%',
                      height: '30%',
                      borderRadius: '50%',
                      bgcolor: 'white'
                    }
                  }} 
                />
              </Box>
              {/* Smile */}
              <Box 
                component="span"
                sx={{
                  position: 'absolute',
                  width: headSize * 0.2,
                  height: headSize * 0.1,
                  borderBottom: '3px solid',
                  borderColor: theme.palette.primary.dark,
                  borderRadius: '0 0 50% 50%',
                  top: headSize * 0.55,
                  left: '50%',
                  transform: 'translateX(-50%)'
                }} 
              />
            </Box>
          </Box>
        </Box>

        {/* Neck */}
        <Box 
          component="span"
          sx={{
            position: 'absolute',
            width: headSize * 0.4,
            height: headSize * 0.3,
            bgcolor: '#FFD3B6',
            borderRadius: '0 0 10px 10px',
            top: headSize * 0.9,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1,
            border: '3px solid',
            borderColor: theme.palette.background.paper,
            borderTop: 'none',
            boxShadow: 2
          }} 
        />

        {/* Body */}
        <Box 
          component="span"
          sx={{
            position: 'absolute',
            width: avatarSize * 0.7,
            height: avatarSize * 0.6,
            bgcolor: theme.palette.primary.main,
            borderRadius: '30px 30px 0 0',
            top: headSize * 1.1,
            left: '50%',
            transform: 'translateX(-50%)',
            border: '3px solid',
            borderColor: theme.palette.background.paper,
            boxShadow: 3,
            zIndex: 1
          }} 
        />

        {/* Hat */}
        {equipped?.hat && (
          <Box 
            component="span"
            sx={{
              position: 'absolute',
              top: headSize * 0.1,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 3,
              color: theme.palette.primary.main
            }}
          >
            {getItemIcon('hat', true)}
          </Box>
        )}

        {/* Glasses */}
        {equipped?.glasses && (
          <Box 
            component="span"
            sx={{
              position: 'absolute',
              top: headSize * 0.35,
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 3,
              color: theme.palette.secondary.main
            }}
          >
            {getItemIcon('glasses', true)}
          </Box>
        )}

        {/* Shirt/Cape */}
        {equipped?.shirt && (
          <Box 
            component="span"
            sx={{
              position: 'absolute',
              top: headSize * 1.1,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 2,
              color: theme.palette.success.main
            }}
          >
            {getItemIcon('shirt', true)}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default function ProfileScreen({ user, onBack, onLogout, onNavigate }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [profile, setProfile] = useState(null);
  const [globalLeaderboard, setGlobalLeaderboard] = useState([]);
  const [schoolLeaderboard, setSchoolLeaderboard] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const handleEquip = async (itemId) => {
    try {
      await axios.post(
        `${API_URL}/api/store/equip`,
        { itemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessage("Item equipped successfully!");
      
      const profileRes = await axios.get(`${API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(profileRes.data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to equip item.");
    }
  };

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
      <Paper 
        sx={{ 
          p: 3, 
          textAlign: 'center', 
          borderRadius: 3,
          bgcolor: 'transparent',
          boxShadow: 'none'
        }}
      >
        <Box 
          component="span"
          sx={{ 
            display: 'inline-block',
            mb: 3,
            bgcolor: 'transparent'
          }}
        >
          <CustomAvatar 
            name={name} 
            equipped={avatar?.equipped}
            size={160}
          />
        </Box>
        <Typography variant="h6" gutterBottom>Your Avatar</Typography>
        
        {/* Currently Equipped Items */}
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Currently Equipped
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {avatar?.equipped?.hat && (
            <Grid item xs={4}>
              <Paper 
                sx={{ 
                  p: 1, 
                  textAlign: 'center',
                  bgcolor: 'background.paper'
                }}
              >
                <Box 
                  component="span"
                  sx={{ 
                    color: 'primary.main',
                    '& svg': {
                      width: 40,
                      height: 40
                    }
                  }}
                >
                  <HatIcon />
                </Box>
                <Typography variant="body2">
                  Wizard Hat
                </Typography>
              </Paper>
            </Grid>
          )}
          {avatar?.equipped?.glasses && (
            <Grid item xs={4}>
              <Paper 
                sx={{ 
                  p: 1, 
                  textAlign: 'center',
                  bgcolor: 'background.paper'
                }}
              >
                <Box 
                  component="span"
                  sx={{ 
                    color: 'secondary.main',
                    '& svg': {
                      width: 40,
                      height: 40
                    }
                  }}
                >
                  <GlassesIcon />
                </Box>
                <Typography variant="body2">
                  Cool Glasses
                </Typography>
              </Paper>
            </Grid>
          )}
          {avatar?.equipped?.shirt && (
            <Grid item xs={4}>
              <Paper 
                sx={{ 
                  p: 1, 
                  textAlign: 'center',
                  bgcolor: 'background.paper'
                }}
              >
                <Box 
                  component="span"
                  sx={{ 
                    color: 'success.main',
                    '& svg': {
                      width: 40,
                      height: 40
                    }
                  }}
                >
                  <ShirtIcon />
                </Box>
                <Typography variant="body2">
                  Cape
                </Typography>
              </Paper>
            </Grid>
          )}
          {!avatar?.equipped?.hat && !avatar?.equipped?.glasses && !avatar?.equipped?.shirt && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" align="center">
                No items equipped
              </Typography>
            </Grid>
          )}
        </Grid>

        {/* Owned Items */}
        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 3, mb: 1 }}>
          Your Collection
        </Typography>
        <Grid container spacing={2}>
          {avatar?.ownedItems?.length > 0 ? (
            avatar.ownedItems.map((item) => (
              <Grid item xs={4} key={item._id || item}>
                <Paper 
                  sx={{ 
                    p: 1, 
                    textAlign: 'center',
                    bgcolor: avatar?.equipped?.hat === item._id || 
                            avatar?.equipped?.glasses === item._id || 
                            avatar?.equipped?.shirt === item._id 
                      ? 'primary.light' 
                      : 'background.paper'
                  }}
                >
                  {item.category === 'hat' && (
                    <Box sx={{ 
                      color: 'primary.main',
                      '& svg': {
                        width: 40,
                        height: 40
                      }
                    }}>
                      <HatIcon />
                    </Box>
                  )}
                  {item.category === 'glasses' && (
                    <Box sx={{ 
                      color: 'secondary.main',
                      '& svg': {
                        width: 40,
                        height: 40
                      }
                    }}>
                      <GlassesIcon />
                    </Box>
                  )}
                  {item.category === 'shirt' && (
                    <Box sx={{ 
                      color: 'success.main',
                      '& svg': {
                        width: 40,
                        height: 40
                      }
                    }}>
                      <ShirtIcon />
                    </Box>
                  )}
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {item.name || (item.category === 'hat' ? 'Wizard Hat' : 
                                 item.category === 'glasses' ? 'Cool Glasses' : 'Cape')}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {avatar?.equipped?.hat === item._id || 
                     avatar?.equipped?.glasses === item._id || 
                     avatar?.equipped?.shirt === item._id ? (
                      <Chip
                        size="small"
                        label="Equipped"
                        color="primary"
                      />
                    ) : (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleEquip(item._id || item)}
                        sx={{ mt: 0.5 }}
                      >
                        Equip
                      </Button>
                    )}
                  </Box>
                </Paper>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" align="center">
                No items owned yet
              </Typography>
            </Grid>
          )}
        </Grid>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Paper 
              sx={{ 
                p: 2, 
                mt: 2,
                textAlign: 'center',
                bgcolor: 'success.light',
                color: 'success.contrastText'
              }}
            >
              <Typography>{message}</Typography>
            </Paper>
          </motion.div>
        )}

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
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3,
            flexWrap: 'nowrap',
            gap: 2
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 2,
              flex: 1,
              minWidth: 0 // Prevents flex item from overflowing
            }}>
              <Box sx={{ position: 'relative', flexShrink: 0 }}>
                <Avatar
                  sx={{
                    width: { xs: 48, sm: 56 },
                    height: { xs: 48, sm: 56 },
                    bgcolor: theme.palette.primary.main,
                    fontSize: { xs: '1.2rem', sm: '1.5rem' },
                    border: '3px solid',
                    borderColor: isFaizalUser ? 'primary.main' : 'transparent',
                    boxShadow: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: 6
                    }
                  }}
                >
                  {name.charAt(0).toUpperCase()}
                </Avatar>
                {isFaizalUser && (
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      bottom: -4,
                      right: -4,
                      bgcolor: 'primary.main',
                      borderRadius: '50%',
                      p: 0.5,
                      boxShadow: 2
                    }}
                  >
                    <AdminIcon 
                      sx={{ 
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        color: 'white'
                      }} 
                    />
                  </Box>
                )}
              </Box>
              <Box sx={{ 
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center', 
                gap: 2,
                flexWrap: 'wrap'
              }}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    px: 2, 
                    py: 0.5, 
                    borderRadius: 2,
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <SchoolIcon sx={{ fontSize: '1.2rem' }} />
                  <Typography variant="subtitle1">{grade}</Typography>
                </Paper>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  bgcolor: 'background.paper',
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  boxShadow: 1
                }}>
                  <CoinIcon color="primary" sx={{ fontSize: '1.5rem' }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontSize: '1.25rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {currency}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              alignItems: 'center',
              flexShrink: 0 // Prevents buttons from shrinking
            }}>
              {(user?.role === 'admin' || isFaizalUser) && (
                <IconButton
                  color="primary"
                  onClick={() => onNavigate('admin')}
                  sx={{ 
                    display: { xs: 'none', sm: 'flex' },
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    width: { xs: 40, sm: 48 },
                    height: { xs: 40, sm: 48 }
                  }}
                >
                  <AdminIcon />
                </IconButton>
              )}
              <IconButton
                color="primary"
                onClick={() => onNavigate('game')}
                sx={{ 
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 }
                }}
              >
                <PlayIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={onLogout}
                sx={{ 
                  bgcolor: 'error.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'error.dark',
                  },
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 }
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Add grade and currency info below for mobile view */}
          <Box sx={{ 
            display: { xs: 'flex', sm: 'none' },
            gap: 2,
            mb: 3,
            flexWrap: 'wrap'
          }}>
            <Paper 
              elevation={1} 
              sx={{ 
                px: 2, 
                py: 0.5, 
                borderRadius: 2,
                bgcolor: 'primary.main',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <SchoolIcon sx={{ fontSize: '1rem' }} />
              <Typography variant="subtitle1">{grade}</Typography>
            </Paper>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              bgcolor: 'background.paper',
              px: 2,
              py: 0.5,
              borderRadius: 2,
              boxShadow: 1
            }}>
              <CoinIcon color="primary" sx={{ fontSize: '1.2rem' }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                {currency}
              </Typography>
            </Box>
          </Box>

          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant={isMobile ? "fullWidth" : "standard"}
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
          >
            <Tab icon={<TrophyIcon />} label="Stats" />
            <Tab icon={<PersonIcon />} label="Avatar" />
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