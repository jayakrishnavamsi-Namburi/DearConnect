// import React, { useContext, useEffect, useState } from 'react';
// import { AuthContext } from '../contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import {
//   Card,
//   Box,
//   CardContent,
//   Typography,
//   IconButton,
//   CircularProgress,
// } from '@mui/material';
// import HomeIcon from '@mui/icons-material/Home';
// // console.log(userData);
// export default function History() {
//   const { getHistoryOfUser, userData } = useContext(AuthContext);
//   const [meetings, setMeetings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   console.log(userData);
//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const history = await getHistoryOfUser();
//         // console.log("Fetched history:", history);
//         setMeetings(Array.isArray(history) ? history : []);
//       } catch (error) {
//         console.error("Error fetching history:", error);
//         setMeetings([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHistory();
//   }, [getHistoryOfUser]);

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   return (
//     <Box sx={{ padding: "2rem" }}>
//       {/* Header: Welcome + Home Button */}
//       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
//         {userData && userData.username ? (
//   <Typography variant="h5" sx={{ fontWeight: "bold" }}>
//     Welcome, {userData.username}
//     console.log(userData);
//   </Typography>
// ) : (
//   <Typography variant="h6" color="text.secondary">
//     History
//   </Typography>
// )}


//         <IconButton onClick={() => navigate("/home")} color="primary">
//           <HomeIcon fontSize="large" />
//         </IconButton>
//       </Box>

//       {/* Meeting History */}
//       {loading ? (
//         <CircularProgress />
//       ) : meetings.length > 0 ? (
//         meetings.map((e, i) => (
//           <Card key={i} variant="outlined" sx={{ mb: 2, padding: "1rem" }}>
//             <CardContent>
//               <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
//                 Meeting Code: {e.meetingCode}
//               </Typography>
//               <Typography sx={{ color: "text.secondary", mt: 1 }}>
//                 Date: {formatDate(e.date)}
//               </Typography>
//             </CardContent>
//           </Card>
//         ))
//       ) : (
//         <Typography variant="body1" color="text.secondary">
//           No meeting history available.
//         </Typography>
//       )}
//     </Box>
//   );
// }





import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Box,
  CardContent,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

export default function History() {
  const { getHistoryOfUser, userData } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistoryOfUser();
        setMeetings(Array.isArray(history) ? history : []);
      } catch (error) {
        console.error("Error fetching history:", error);
        setMeetings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [getHistoryOfUser]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Box sx={{ padding: "2rem", minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {userData?.username ? `Welcome, ${userData.username}` : 'Meeting History'}
        </Typography>

        <IconButton onClick={() => navigate("/home")} color="primary">
          <HomeIcon fontSize="large" />
        </IconButton>
      </Box>

      {/* Meeting History */}
      {loading ? (
        <CircularProgress />
      ) : meetings.length > 0 ? (
        meetings.map((e, i) => (
          <Card key={i} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                Meeting Code: {e.meetingCode}
              </Typography>
              <Typography sx={{ color: "text.secondary", mt: 1 }}>
                Date: {formatDate(e.date)}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body1" color="text.secondary">
          No meeting history available.
        </Typography>
      )}
    </Box>
  );
}
