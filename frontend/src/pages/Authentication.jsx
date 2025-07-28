// Authentication.jsx
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
  }, [location.search]);

  const handleSubmit = async () => {
    try {
      if (formState === 1) {
        const res = await handleRegister(name, username, password);
        setMessage(res);
        setName('');
        setUsername('');
        setPassword('');
        setFormState(0);
        navigate('/auth?mode=login');
      } else {
        const res = await handleLogin(username, password);
        setMessage(res);
      }
      setError('');
      setOpen(true);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Something went wrong!';
      setError(msg);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" className="zoom-auth-root">
        <CssBaseline />

        {/* Left Auth Form */}
        <Grid item xs={12} sm={7} md={6} component={Paper} elevation={0} className="zoom-auth-form-side">
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
              <Typography color="error" variant="body2">
                {error}
              </Typography>
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
                    setFormState((prev) => (prev === 0 ? 1 : 0));
                    navigate(`/auth?mode=${formState === 0 ? 'register' : 'login'}`);
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

        {/* Right side can be styled or contain video/image if needed */}
      </Grid>
      <Snackbar open={open} autoHideDuration={4000} message={message} />
    </ThemeProvider>
  );
}