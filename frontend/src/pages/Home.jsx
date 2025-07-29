import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "../styles/home.css";
import { Button, IconButton, TextField } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {


    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");


    const {addToUserHistory} = useContext(AuthContext);
    let handleJoinVideoCall = async () => {
        await addToUserHistory(meetingCode)
        navigate(`/${meetingCode}`)
    }

    return (
        <>

            <div className="navBar">

                <div style={{ display: "flex", alignItems: "center" }}>

                    <h2>Apna Video Call</h2>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <IconButton onClick={
                        () => {
                            navigate("/history")
                        }
                    }>
                        <RestoreIcon />
                    </IconButton>
                    <p>History</p>

                    <Button onClick={() => {
                        localStorage.removeItem("token")
                        navigate("/")
                    }}>
                        Logout
                    </Button>
                </div>


            </div>


            <div className="meetContainer">
                <div className="leftPanel">
                    <div>
                        <h2>Providing Quality Video Call Just Like Quality Education</h2>

                        <div style={{ display: 'flex', gap: "10px" }}>

                            <TextField onChange={e => setMeetingCode(e.target.value)} id="outlined-basic" label="Meeting Code" variant="outlined" />
                            <Button onClick={handleJoinVideoCall} variant='contained'>Join</Button>

                        </div>
                    </div>
                </div>
                <div className='rightPanel'>
                    <img srcSet='/undraw_calling_ieh0.png' alt="" />
                </div>
            </div>
        </>
    )
}


export default withAuth(HomeComponent)



// import React, { useContext, useState } from 'react';
// import withAuth from '../utils/withAuth';
// import { useNavigate } from 'react-router-dom';
// import "../styles/home.css";
// import { Button, IconButton, TextField } from '@mui/material';
// import RestoreIcon from '@mui/icons-material/Restore';
// import MenuIcon from '@mui/icons-material/Menu';
// import { AuthContext } from '../contexts/AuthContext';

// function HomeComponent() {
//   const navigate = useNavigate();
//   const [meetingCode, setMeetingCode] = useState("");
//   const [toggleNav, setToggleNav] = useState(false);
//   const { addToUserHistory } = useContext(AuthContext);

//   const handleJoinVideoCall = async () => {
//     if (meetingCode.trim() === "") {
//       alert("Please enter a valid meeting code.");
//       return;
//     }
//     await addToUserHistory(meetingCode);
//     navigate(`/${meetingCode}`);
//   };

//   return (
//     <>
//       <header className="navBar">
//         <div className="navBar-left">
//           <h2>DearConnect</h2>
//         </div>

//         <div className={`navBar-right ${toggleNav ? "open" : ""}`}>
//           <IconButton aria-label="View history" onClick={() => navigate("/history")}>
//             <RestoreIcon />
//           </IconButton>
//           <p  id="history-label"   onClick={() => navigate("/history")} >History</p>
//           <Button
//             variant="outlined"
//             onClick={() => {
//               localStorage.removeItem("token");
//               navigate("/");
//             }}
//           >
//             Logout
//           </Button>
//         </div>

//         <div className="navToggle" onClick={() => setToggleNav(!toggleNav)}>
//           <MenuIcon />
//         </div>
//       </header>

//       <main className="meetContainer">
//         <section className="leftPanel">
//           <h2>Providing Quality Video Call Just Like Quality Education</h2>
//           <div className="joinControls">
//             <TextField
//               id="meeting-code"
//               label="Meeting Code"
//               variant="outlined"
//               value={meetingCode}
//               onChange={e => setMeetingCode(e.target.value)}
//               fullWidth={false}
//             />
//             <Button variant="contained" onClick={handleJoinVideoCall}>
//               Join
//             </Button>
//           </div>
//         </section>
//         <section className="rightPanel">
//           <img src="/undraw_calling_ieh0.png" alt="Video call illustration" />
//         </section>
//       </main>
//     </>
//   );
// }

// export default withAuth(HomeComponent);

