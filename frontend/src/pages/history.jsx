import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import '../styles/history.css'; // Assuming you have a CSS file for styling

export default function History() {
  const { getHistoryOfUser } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
  const routeTo = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistoryOfUser();
        setMeetings(history);
      } catch (err) {
        console.error("Error fetching meeting history", err);
      }
    };
    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="history-container">
      <div className="history-header">
        <IconButton
          className="home-icon-button"
          onClick={() => routeTo("/home")}
        >
          <HomeIcon className="home-icon" />
        </IconButton>
        <h2 className="history-title">Meeting History</h2>
      </div>

      {meetings.length > 0 ? (
        meetings.map((e, i) => (
          <Card key={i} className="meeting-card">
            <CardContent>
              <Typography className="meeting-code">
                Meeting Code: {e.meetingCode}
              </Typography>
              <Typography className="meeting-date">
                Date: {formatDate(e.date)}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="empty-message">No meeting history available.</div>
      )}
    </div>
  );
}
