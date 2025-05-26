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
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
  CircularProgress,
  Chip,
  Badge,
  Avatar
} from '@mui/material';
import {
  MonetizationOn as CoinIcon,
  ArrowBack as BackIcon,
  SportsEsports as HatIcon,
  Visibility as GlassesIcon,
  Checkroom as ShirtIcon,
  Store as StoreIcon,
  CheckCircle as CheckIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon
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

export default function StoreScreen({ onBack }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [storeItems, setStoreItems] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [message, setMessage] = useState("");
  const [activeCategory, setActiveCategory] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState({
    hat: null,
    glasses: null,
    shirt: null
  });
  
  const token = localStorage.getItem("token");

  const categories = [
    { id: 'all', label: 'All', icon: <StoreIcon /> },
    { id: 'hat', label: 'Hats', icon: <HatIcon /> },
    { id: 'glasses', label: 'Glasses', icon: <GlassesIcon /> },
    { id: 'shirt', label: 'Shirts', icon: <ShirtIcon /> }
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [itemsRes, profileRes] = await Promise.all([
          axios.get(`${API_URL}/api/store/items`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);
        
        setStoreItems(itemsRes.data);
        setUserProfile(profileRes.data);
        
        if (profileRes.data.avatar?.equipped) {
          setPreviewAvatar(profileRes.data.avatar.equipped);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load store items or profile.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [token]);

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    if (item) {
      setPreviewAvatar(prev => ({
        ...prev,
        [item.category]: item._id
      }));
    }
  };

  const handlePurchase = async () => {
    if (!selectedItem) return;
    
    try {
      await axios.post(
        `${API_URL}/api/store/buy`,
        { itemId: selectedItem._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessage(`Purchased ${selectedItem.name}!`);
      
      const profileRes = await axios.get(`${API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserProfile(profileRes.data);
      setSelectedItem(null);
    } catch (err) {
      setMessage(err.response?.data?.message || "Purchase failed.");
    }
  };

  const handleEquip = async () => {
    if (!selectedItem) return;
    
    try {
      await axios.post(
        `${API_URL}/api/store/equip`,
        { itemId: selectedItem._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessage(`${selectedItem.name} equipped!`);
      
      const profileRes = await axios.get(`${API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserProfile(profileRes.data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to equip item.");
    }
  };

  const userOwnsItem = (itemId) => {
    return userProfile?.avatar?.ownedItems?.includes(itemId);
  };

  const filteredItems = categories[activeCategory].id === 'all' 
    ? storeItems 
    : storeItems.filter(item => item.category === categories[activeCategory].id);

  const renderAvatarPreview = () => (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>Preview</Typography>
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
            <PersonIcon sx={{ fontSize: 40 }} />
          </Avatar>
          {previewAvatar.hat && (
            <Box sx={{ position: 'absolute', top: -20 }}>
              <HatIcon color="primary" sx={{ fontSize: 40 }} />
            </Box>
          )}
          {previewAvatar.glasses && (
            <Box sx={{ position: 'absolute', top: 20 }}>
              <GlassesIcon color="secondary" sx={{ fontSize: 30 }} />
            </Box>
          )}
          {previewAvatar.shirt && (
            <Box sx={{ position: 'absolute', bottom: -20 }}>
              <ShirtIcon color="success" sx={{ fontSize: 40 }} />
            </Box>
          )}
        </Box>
      </Paper>
    </motion.div>
  );

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

  if (!userProfile) return null;

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
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<BackIcon />}
                onClick={onBack}
              >
                Back
              </Button>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                Avatar Store
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              bgcolor: 'primary.main',
              color: 'white',
              px: 2,
              py: 1,
              borderRadius: 2
            }}>
              <CoinIcon />
              <Typography variant="h6">{userProfile.currency || 0}</Typography>
            </Box>
          </Box>

          <Tabs
            value={activeCategory}
            onChange={(e, newValue) => setActiveCategory(newValue)}
            variant={isMobile ? "fullWidth" : "standard"}
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
          >
            {categories.map((category, index) => (
              <Tab 
                key={category.id}
                icon={category.icon}
                label={category.label}
                iconPosition="start"
              />
            ))}
          </Tabs>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                {filteredItems.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item._id}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        sx={{ 
                          cursor: 'pointer',
                          border: selectedItem?._id === item._id ? 2 : 0,
                          borderColor: 'primary.main',
                          position: 'relative',
                          height: '100%'
                        }}
                        onClick={() => handleItemSelect(item)}
                      >
                        <CardContent>
                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1
                          }}>
                            {item.category === 'hat' && <HatIcon sx={{ fontSize: 40 }} color="primary" />}
                            {item.category === 'glasses' && <GlassesIcon sx={{ fontSize: 40 }} color="secondary" />}
                            {item.category === 'shirt' && <ShirtIcon sx={{ fontSize: 40 }} color="success" />}
                            
                            <Typography variant="h6" align="center">
                              {item.name}
                            </Typography>
                            
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              gap: 0.5,
                              color: 'primary.main'
                            }}>
                              <CoinIcon />
                              <Typography variant="h6">
                                {item.price}
                              </Typography>
                            </Box>

                            {userOwnsItem(item._id) && (
                              <Chip
                                icon={<CheckIcon />}
                                label="Owned"
                                color="success"
                                size="small"
                                sx={{ position: 'absolute', top: 8, right: 8 }}
                              />
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {renderAvatarPreview()}

                {selectedItem && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        {selectedItem.name}
                      </Typography>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 1,
                        mb: 2
                      }}>
                        {selectedItem.category === 'hat' && <HatIcon color="primary" />}
                        {selectedItem.category === 'glasses' && <GlassesIcon color="secondary" />}
                        {selectedItem.category === 'shirt' && <ShirtIcon color="success" />}
                        <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                          {selectedItem.category}
                        </Typography>
                      </Box>

                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 1,
                        mb: 3
                      }}>
                        <CoinIcon color="primary" />
                        <Typography variant="h5">
                          {selectedItem.price}
                        </Typography>
                      </Box>

                      {!userOwnsItem(selectedItem._id) ? (
                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<CartIcon />}
                          onClick={handlePurchase}
                          disabled={userProfile.currency < selectedItem.price}
                        >
                          Purchase
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="success"
                          fullWidth
                          startIcon={<CheckIcon />}
                          onClick={handleEquip}
                        >
                          Equip
                        </Button>
                      )}
                    </Paper>
                  </motion.div>
                )}

                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Paper 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        bgcolor: 'success.light',
                        color: 'success.contrastText'
                      }}
                    >
                      <Typography>{message}</Typography>
                    </Paper>
                  </motion.div>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>
    </Container>
  );
}