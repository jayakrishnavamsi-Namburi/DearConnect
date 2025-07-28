// import React, { useContext } from 'react';
// import '../styles/Landing.css';
// import { useNavigate, Link } from 'react-router-dom';
// import zoomVideo from '../videos/ZoomBackground.mp4';
// import { AuthContext } from '../contexts/AuthContext';

// export default function Landing() {
//   const navigate = useNavigate();
//   const { user, logoutUser } = useContext(AuthContext);

//   return (
//     <div className='landingPageContainer'>
//       <nav>
//         <div className='navHeader'>
//           <h2>Video Call</h2>
//         </div>
//         <div className='navlist'>
//           {!user ? (
//             <>
//               <p role="button" onClick={() => navigate("/guest")}>Join as Guest</p>
//               <p role="button" onClick={() => navigate("/auth?mode=register")}>Register</p>
//               <p role="button" onClick={() => navigate("/auth?mode=login")}>Login</p>
//             </>
//           ) : (
//             <>
//               <p role="button" onClick={() => navigate("/home")}>Dashboard</p>
//               <p role="button" onClick={logoutUser}>Logout</p>
//             </>
//           )}
//         </div>
//       </nav>

//       <div className="landingMainContainer">
//         <div>
//           <h1><span style={{ color: "#ff9839" }}>Connect</span> with your loved ones</h1>
//           <p>Cover a distance with a video call</p>
//           <div role='button'>
//             <Link to="/auth?mode=login">Get Started</Link>
//           </div>
//         </div>
//         <div>
//           <video
//             src={zoomVideo}
//             autoPlay
//             muted
//             loop
//             playsInline
//             style={{
//               width: '100%',
//               height: 'auto',
//               objectFit: 'cover',
//               marginTop: '4.5rem',
//               borderRadius: "12px"
//             }}
//           ></video>
//         </div>
//       </div>
//     </div>
//   );
// }





import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import zoomVideo from '../videos/ZoomBackground.mp4';
import '../styles/Landing.css';

export default function Landing() {
  const { user, logoutUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (to) => {
    setMenuOpen(false); // Close menu on navigation
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
          <h1><span>Connect</span> with your Loved ones</h1>
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
            poster="/fallback-poster.jpg" // Optional poster image
          />
        </div>
      </div>
    </div>
  );
}

