import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import zoomVideo from '../videos/ZoomBackground.mp4';
import '../styles/landingPage.css';

export default function LandingPage() {
  const { user, logoutUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (to) => {
    setMenuOpen(false); // Close menu on click (for mobile)
    navigate(to);
  };

  return (
    <div className="landingPage">
      <nav className="navbar">
        <div className="logo">DearConnect</div>

        <div className={`navLinks ${menuOpen ? 'open' : ''}`}>
          {user && user.id ? (
            <>
              <button onClick={() => handleNavigate("/home")}>Dashboard</button>
              <button onClick={logoutUser}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => handleNavigate("/guest")}>Guest</button>
              <button onClick={() => handleNavigate("/auth?mode=register")}>Register</button>
              <button onClick={() => handleNavigate("/auth?mode=login")}>Login</button>
            </>
          )}
        </div>

        <button
          className="hamburger"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </nav>

      <div className="heroSection">
        <div className="heroText">
          <h1><span>Connect</span> with your loved ones</h1>
          <p>Cover a distance by <span>DearConnect</span></p>
          <Link className="getStartedBtn" to="/auth?mode=login">Get Started</Link>
        </div>

        <div className="heroVideo">
          <video
            src={zoomVideo}
            autoPlay
            muted
            loop
            playsInline
            poster="/fallback-poster.jpg"
          />
        </div>
      </div>
    </div>
  );
}
