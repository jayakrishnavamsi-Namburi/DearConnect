import React, { useContext, useState } from 'react';
import withAuth from '../utils/withAuth';
import { useNavigate } from 'react-router-dom';
import { Button, IconButton, TextField } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import '../styles/home.css';
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const { addToUserHistory } = useContext(AuthContext);

  const handleJoinVideoCall = async () => {
    await addToUserHistory(meetingCode);
    navigate(`/${meetingCode}`);
  };

  return (
    <>
      <div className="navBar">
        <h2 className="logo">DearConnect</h2>

        <div className="navToggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </div>

        <div className={`navLinks ${menuOpen ? 'open' : ''}`}>
          <div className="historyNav" onClick={() => navigate('/history')}>
            <IconButton>
              <RestoreIcon />
            </IconButton>
            <span>History</span>
          </div>
          <Button
            color="error"
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/');
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="meetContainer">
        <div className="leftPanel">
          <div>
            <h2>Providing Quality Video Call Just Like Quality Education</h2>
            <div className="joinControls">
              <TextField
                onChange={(e) => setMeetingCode(e.target.value)}
                id="outlined-basic"
                label="Meeting Code"
                variant="outlined"
              />
              <Button onClick={handleJoinVideoCall} variant="contained">
                Join
              </Button>
            </div>
          </div>
        </div>
        <div className="rightPanel">
          <img srcSet="/logo3.png" alt="meeting" />
        </div>
      </div>
    </>
  );
}

export default withAuth(HomeComponent);
