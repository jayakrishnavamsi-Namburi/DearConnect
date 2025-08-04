import React, { useState, useContext, useEffect } from 'react';
import {
  Avatar,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Snackbar,
  CssBaseline,
  Paper,
  Alert,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Authentication.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2D8CFF',
    },
  },
});

export default function Authentication() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [formState, setFormState] = useState(0); // 0 = login, 1 = register
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  const { handleRegister, handleLogin } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    if (mode === 'register') {
      setFormState(1);
    } else {
      setFormState(0);
    }
    setError('');
    setMessage('');
  }, [location.search]);

  const handleSubmit = async () => {
    if (
      (formState === 1 && (!name.trim() || !username.trim() || !password.trim())) ||
      (formState === 0 && (!username.trim() || !password.trim()))
    ) {
      setError('Please fill all required fields');
      return;
    }

    try {
      if (formState === 1) {
        const res = await handleRegister(name, username, password);
        setMessage(res || 'Registration successful!');
        setOpen(true);
        setName('');
        setUsername('');
        setPassword('');
        setFormState(0);
        navigate('/auth?mode=login');
      } else {
        const res = await handleLogin(username, password);
        setMessage(res || 'Login successful!');
        setOpen(true);
        navigate('/home');
      }
      setError('');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Something went wrong!';
      setError(msg);
    }
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" className="zoom-auth-root">
        <CssBaseline />
        <Grid item component={Paper} elevation={0} className="zoom-auth-form-side">
          <Box className="zoom-auth-box">
            <Avatar sx={{ m: 'auto', bgcolor: 'primary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" className="zoom-auth-title">
              {formState === 0 ? 'Sign In to VideoApp' : 'Create your VideoApp Account'}
            </Typography>

            {formState === 1 && (
              <TextField
                margin="normal"
                required
                fullWidth
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              {formState === 0 ? 'Sign In' : 'Sign Up'}
            </Button>

            <Grid container justifyContent="center">
              <Grid item>
                <Button
                  size="small"
                  onClick={() => {
                    const newFormState = formState === 0 ? 1 : 0;
                    setFormState(newFormState);
                    navigate(`/auth?mode=${newFormState === 1 ? 'register' : 'login'}`);
                    setError('');
                    setMessage('');
                  }}
                >
                  {formState === 0
                    ? "Don't have an account? Sign Up"
                    : 'Already have an account? Sign In'}
                </Button>
              </Grid>
            </Grid>

            <Button
              variant="text"
              sx={{ mt: 1 }}
              onClick={() => navigate('/guest')}
            >
              Join as Guest
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
