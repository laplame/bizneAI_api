import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  Snackbar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import axios from 'axios';

const ConfigurationScreen = () => {
  const [config, setConfig] = useState({
    googleDrive: {
      clientId: '',
      clientSecret: '',
      refreshToken: '',
      folderId: ''
    },
    email: {
      service: 'gmail',
      host: '',
      port: '',
      secure: true,
      auth: {
        user: '',
        pass: ''
      },
      from: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await axios.get('/api/config');
      if (response.data.success) {
        setConfig(response.data.data);
      }
    } catch (error) {
      showAlert('error', 'Error fetching configuration');
    }
  };

  const showAlert = (type, text) => {
    setMessage({ type, text });
    setShowMessage(true);
  };

  const handleGoogleDriveChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      googleDrive: {
        ...prev.googleDrive,
        [name]: value
      }
    }));
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setConfig(prev => ({
        ...prev,
        email: {
          ...prev.email,
          [parent]: {
            ...prev.email[parent],
            [child]: value
          }
        }
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        email: {
          ...prev.email,
          [name]: value
        }
      }));
    }
  };

  const handleSecureChange = (e) => {
    setConfig(prev => ({
      ...prev,
      email: {
        ...prev.email,
        secure: e.target.checked
      }
    }));
  };

  const handleGoogleDriveSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/config/google-drive', config.googleDrive);
      if (response.data.success) {
        showAlert('success', 'Google Drive configuration updated successfully');
      }
    } catch (error) {
      showAlert('error', 'Error updating Google Drive configuration');
    }
    setLoading(false);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/config/email', config.email);
      if (response.data.success) {
        showAlert('success', 'Email configuration updated successfully');
      }
    } catch (error) {
      showAlert('error', 'Error updating email configuration');
    }
    setLoading(false);
  };

  const testGoogleDrive = async () => {
    try {
      const response = await axios.post('/api/config/test/google-drive');
      if (response.data.success) {
        showAlert('success', 'Google Drive connection successful');
      }
    } catch (error) {
      showAlert('error', 'Error testing Google Drive connection');
    }
  };

  const testEmail = async () => {
    try {
      const response = await axios.post('/api/config/test/email');
      if (response.data.success) {
        showAlert('success', 'Test email sent successfully');
      }
    } catch (error) {
      showAlert('error', 'Error testing email configuration');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        System Configuration
      </Typography>

      <Grid container spacing={3}>
        {/* Google Drive Configuration */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Google Drive Configuration
            </Typography>
            <form onSubmit={handleGoogleDriveSubmit}>
              <TextField
                fullWidth
                label="Client ID"
                name="clientId"
                value={config.googleDrive.clientId}
                onChange={handleGoogleDriveChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Client Secret"
                name="clientSecret"
                value={config.googleDrive.clientSecret}
                onChange={handleGoogleDriveChange}
                margin="normal"
                required
                type="password"
              />
              <TextField
                fullWidth
                label="Refresh Token"
                name="refreshToken"
                value={config.googleDrive.refreshToken}
                onChange={handleGoogleDriveChange}
                margin="normal"
                required
                type="password"
              />
              <TextField
                fullWidth
                label="Folder ID"
                name="folderId"
                value={config.googleDrive.folderId}
                onChange={handleGoogleDriveChange}
                margin="normal"
                required
              />
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  Save Google Drive Config
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={testGoogleDrive}
                  disabled={loading}
                >
                  Test Connection
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>

        {/* Email Configuration */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Email Configuration
            </Typography>
            <form onSubmit={handleEmailSubmit}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Email Service</InputLabel>
                <Select
                  name="service"
                  value={config.email.service}
                  onChange={handleEmailChange}
                  required
                >
                  <MenuItem value="gmail">Gmail</MenuItem>
                  <MenuItem value="outlook">Outlook</MenuItem>
                  <MenuItem value="smtp">SMTP</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="SMTP Host"
                name="host"
                value={config.email.host}
                onChange={handleEmailChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="SMTP Port"
                name="port"
                value={config.email.port}
                onChange={handleEmailChange}
                margin="normal"
                required
                type="number"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={config.email.secure}
                    onChange={handleSecureChange}
                    name="secure"
                  />
                }
                label="Use SSL/TLS"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email Address"
                name="auth.user"
                value={config.email.auth.user}
                onChange={handleEmailChange}
                margin="normal"
                required
                type="email"
              />
              <TextField
                fullWidth
                label="Password/App Password"
                name="auth.pass"
                value={config.email.auth.pass}
                onChange={handleEmailChange}
                margin="normal"
                required
                type="password"
              />
              <TextField
                fullWidth
                label="From Address"
                name="from"
                value={config.email.from}
                onChange={handleEmailChange}
                margin="normal"
                required
                placeholder="Your Store <your-email@example.com>"
              />
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  Save Email Config
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={testEmail}
                  disabled={loading}
                >
                  Send Test Email
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={showMessage}
        autoHideDuration={6000}
        onClose={() => setShowMessage(false)}
      >
        <Alert
          onClose={() => setShowMessage(false)}
          severity={message.type}
          sx={{ width: '100%' }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ConfigurationScreen; 