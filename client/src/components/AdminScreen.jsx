import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Chip,
  Alert,
  Stack
} from '@mui/material';
import {
  School as SchoolIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  ArrowBack as BackIcon,
  Logout as LogoutIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import API_URL from '../config';

export default function AdminScreen({ onBack, onLogout }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [schools, setSchools] = useState([]);
  const [newSchool, setNewSchool] = useState({ name: '', licenseExpiry: new Date() });
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [message, setMessage] = useState('');
  const [grades, setGrades] = useState([{ name: 'Grade 1' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/admin/schools`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setSchools(res.data);
    } catch (err) {
      console.error('Error fetching schools:', err.response || err);
      setError(err.response?.data?.message || 'Failed to load schools');
      setMessage('Failed to load schools');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSchool = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/api/admin/schools`, 
        { ...newSchool, grades },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      setNewSchool({ name: '', licenseExpiry: new Date() });
      setGrades([{ name: 'Grade 1' }]);
      setMessage('School added successfully');
      fetchSchools();
    } catch (err) {
      console.error('Error adding school:', err.response || err);
      setError(err.response?.data?.message || 'Failed to add school');
      setMessage('Failed to add school');
    } finally {
      setLoading(false);
    }
  };

  const handleRenewLicense = async (e) => {
    e.preventDefault();
    if (!selectedSchool) return;
    
    setLoading(true);
    setError(null);
    try {
      await axios.put(`${API_URL}/api/admin/schools/${selectedSchool._id}/renew`, 
        { licenseExpiry: selectedSchool.licenseExpiry },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      setMessage('License renewed successfully');
      setSelectedSchool(null);
      setOpenDialog(false);
      fetchSchools();
    } catch (err) {
      console.error('Error renewing license:', err.response || err);
      setError(err.response?.data?.message || 'Failed to renew license');
      setMessage('Failed to renew license');
    } finally {
      setLoading(false);
    }
  };

  const addGradeField = () => {
    setGrades([...grades, { name: 'Grade 1' }]);
  };

  const updateGrade = (index, value) => {
    const updatedGrades = [...grades];
    updatedGrades[index].name = value;
    setGrades(updatedGrades);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isExpired = (dateString) => {
    return new Date(dateString) < new Date();
  };

  if (loading && !schools.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
                Back to Profile
              </Button>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                Admin Console
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={onLogout}
            >
              Logout
            </Button>
          </Box>

          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Alert 
                  severity="success" 
                  sx={{ mb: 3 }}
                  onClose={() => setMessage('')}
                >
                  {message}
                </Alert>
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Alert 
                  severity="error" 
                  sx={{ mb: 3 }}
                  onClose={() => setError(null)}
                >
                  {error}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SchoolIcon color="primary" />
                  Add New School
                </Typography>
                <Box component="form" onSubmit={handleAddSchool} sx={{ mt: 2 }}>
                  <Stack spacing={3}>
                    <TextField
                      label="School Name"
                      value={newSchool.name}
                      onChange={(e) => setNewSchool({...newSchool, name: e.target.value})}
                      required
                      fullWidth
                    />
                    
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="License Expiry Date"
                        value={newSchool.licenseExpiry}
                        onChange={(newValue) => setNewSchool({...newSchool, licenseExpiry: newValue})}
                        renderInput={(params) => <TextField {...params} required fullWidth />}
                      />
                    </LocalizationProvider>

                    <Box>
                      <Typography variant="subtitle1" gutterBottom>Grades</Typography>
                      <Stack spacing={2}>
                        {grades.map((grade, index) => (
                          <FormControl key={index} fullWidth>
                            <InputLabel>Grade {index + 1}</InputLabel>
                            <Select
                              value={grade.name}
                              onChange={(e) => updateGrade(index, e.target.value)}
                              label={`Grade ${index + 1}`}
                              required
                            >
                              {Array.from({ length: 10 }, (_, i) => (
                                <MenuItem key={i} value={`Grade ${i + 1}`}>
                                  Grade {i + 1}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        ))}
                      </Stack>
                      <Button
                        startIcon={<AddIcon />}
                        onClick={addGradeField}
                        sx={{ mt: 2 }}
                      >
                        Add Grade
                      </Button>
                    </Box>

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <SchoolIcon />}
                    >
                      {loading ? 'Adding...' : 'Add School'}
                    </Button>
                  </Stack>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SchoolIcon color="primary" />
                  Manage Schools
                </Typography>
                
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : schools.length > 0 ? (
                  <TableContainer sx={{ mt: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>School Name</TableCell>
                          <TableCell>License Expiry</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="right">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {schools.map(school => (
                          <TableRow 
                            key={school._id}
                            sx={{ 
                              bgcolor: isExpired(school.licenseExpiry) ? 'error.light' : 'inherit',
                              '&:hover': { bgcolor: 'action.hover' }
                            }}
                          >
                            <TableCell>{school.name}</TableCell>
                            <TableCell>{formatDate(school.licenseExpiry)}</TableCell>
                            <TableCell>
                              <Chip
                                icon={isExpired(school.licenseExpiry) ? <WarningIcon /> : <CheckIcon />}
                                label={isExpired(school.licenseExpiry) ? 'Expired' : 'Active'}
                                color={isExpired(school.licenseExpiry) ? 'error' : 'success'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<RefreshIcon />}
                                onClick={() => {
                                  setSelectedSchool({
                                    ...school,
                                    licenseExpiry: new Date(school.licenseExpiry)
                                  });
                                  setOpenDialog(true);
                                }}
                              >
                                Renew
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                      No schools found. Add a school to get started.
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Renew License for {selectedSchool?.name}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleRenewLicense} sx={{ mt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="New Expiry Date"
                value={selectedSchool?.licenseExpiry}
                onChange={(newValue) => setSelectedSchool({...selectedSchool, licenseExpiry: newValue})}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleRenewLicense}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
          >
            {loading ? 'Renewing...' : 'Renew License'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}