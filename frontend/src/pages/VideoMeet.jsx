import React, { useEffect, useRef, useState } from 'react';
import io from "socket.io-client";
import { Badge, IconButton, TextField, Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import styles from "../styles/videoComponent.module.css";  // Your CSS module
import server from '../environment.js';


const server_url = server;
var connections = {};

const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

export default function VideoMeetComponent() {
  const socketRef = useRef();
  const socketIdRef = useRef();
  const localVideoref = useRef();
  const videoRef = useRef([]);

  const [videoAvailable, setVideoAvailable] = useState(true);
  const [audioAvailable, setAudioAvailable] = useState(true);

  const [video, setVideo] = useState(true);  // whether video is enabled
  const [audio, setAudio] = useState(true);  // whether audio is enabled
  const [screen, setScreen] = useState(false); // screen sharing toggle
  const [showModal, setModal] = useState(false);
  const [screenAvailable, setScreenAvailable] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [newMessages, setNewMessages] = useState(0);
  const [askForUsername, setAskForUsername] = useState(true);
  const [username, setUsername] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [videos, setVideos] = useState([]); // remote video streams

  // Permissions check on mount
  useEffect(() => {
    getPermissions();
  }, []);

  // Get media permissions and local stream
  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoAvailable(!!videoPermission);

      const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioAvailable(!!audioPermission);

      setScreenAvailable(!!navigator.mediaDevices.getDisplayMedia);

      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
        if (userMediaStream && localVideoref.current) {
          window.localStream = userMediaStream;
          localVideoref.current.srcObject = userMediaStream;
        }
      }
    } catch (error) {
      console.log("Permission error:", error);
      setVideoAvailable(false);
      setAudioAvailable(false);
      setScreenAvailable(false);
    }
  };

  // Acquire user media whenever video/audio states change
  useEffect(() => {
    getUserMedia();
  }, [video, audio]);

  // Get user media with current states for video/audio
  const getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .catch(e => console.log(e));
    } else {
      try {
        let tracks = localVideoref.current?.srcObject?.getTracks();
        tracks?.forEach(track => track.stop());
      } catch (e) { }
    }
  };

  // Success handler for user media stream
  const getUserMediaSuccess = (stream) => {
    try {
      window.localStream?.getTracks().forEach(track => track.stop());
    } catch (e) { }

    window.localStream = stream;
    if (localVideoref.current) localVideoref.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;
      connections[id].addStream(window.localStream);
      connections[id].createOffer().then(description => {
        connections[id].setLocalDescription(description)
          .then(() => {
            socketRef.current.emit('signal', id, JSON.stringify({ sdp: connections[id].localDescription }));
          })
          .catch(e => console.log(e));
      });
    }

    stream.getTracks().forEach(track => {
      track.onended = () => {
        setVideo(false);
        setAudio(false);
        try {
          localVideoref.current?.srcObject?.getTracks().forEach(track => track.stop());
        } catch (e) { }
        // Create silent black stream to keep peer connections alive
        window.localStream = blackSilence();
        if (localVideoref.current) localVideoref.current.srcObject = window.localStream;

        for (let id in connections) {
          connections[id].addStream(window.localStream);
          connections[id].createOffer().then(description => {
            connections[id].setLocalDescription(description)
              .then(() => {
                socketRef.current.emit('signal', id, JSON.stringify({ sdp: connections[id].localDescription }));
              })
              .catch(e => console.log(e));
          });
        }
      };
    });
  };

  // Create silent and black video/audio tracks for dummy stream
  const silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  const black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), { width, height });
    canvas.getContext('2d').fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  const blackSilence = () => new MediaStream([black(), silence()]);

  // Display media handling for screen sharing
  useEffect(() => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
          .then(getDisplayMediaSuccess)
          .catch(e => console.log(e));
      }
    }
  }, [screen]);

  const getDisplayMediaSuccess = (stream) => {
    try {
      window.localStream?.getTracks().forEach(track => track.stop());
    } catch (e) {}

    window.localStream = stream;
    if (localVideoref.current) localVideoref.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;
      connections[id].addStream(window.localStream);
      connections[id].createOffer().then(description => {
        connections[id].setLocalDescription(description)
          .then(() => {
            socketRef.current.emit('signal', id, JSON.stringify({ sdp: connections[id].localDescription }));
          })
          .catch(e => console.log(e));
      });
    }

    stream.getTracks().forEach(track => {
      track.onended = () => {
        setScreen(false);
        try {
          localVideoref.current?.srcObject?.getTracks().forEach(track => track.stop());
        } catch (e) { }
        window.localStream = blackSilence();
        if (localVideoref.current) localVideoref.current.srcObject = window.localStream;
        getUserMedia();
      };
    });
  };

  // Receive signaling data
  const gotMessageFromServer = (fromId, message) => {
    const signal = JSON.parse(message);
    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
          if (signal.sdp.type === 'offer') {
            connections[fromId].createAnswer().then(description => {
              connections[fromId].setLocalDescription(description).then(() => {
                socketRef.current.emit('signal', fromId, JSON.stringify({ sdp: connections[fromId].localDescription }));
              }).catch(e => console.log(e));
            }).catch(e => console.log(e));
          }
        }).catch(e => console.log(e));
      }
      if (signal.ice) {
        connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e));
      }
    }
  };

  // Connect to signaling server and setup peer connections
  const connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });
    socketRef.current.on('signal', gotMessageFromServer);

    socketRef.current.on('connect', () => {
      socketRef.current.emit('join-call', window.location.href);
      socketIdRef.current = socketRef.current.id;

      socketRef.current.on('chat-message', addMessage);

      socketRef.current.on('user-left', (id) => {
        setVideos(videos => videos.filter(video => video.socketId !== id));
        delete connections[id];
      });

      socketRef.current.on('user-joined', (id, clients) => {
        clients.forEach((socketListId) => {
          if (!connections[socketListId]) {
            connections[socketListId] = new RTCPeerConnection(peerConfigConnections);
            connections[socketListId].onicecandidate = event => {
              if (event.candidate != null) {
                socketRef.current.emit('signal', socketListId, JSON.stringify({ ice: event.candidate }));
              }
            };

            connections[socketListId].onaddstream = event => {
              // Update or add remote stream
              const videoExists = videoRef.current.find(v => v.socketId === socketListId);
              if (videoExists) {
                setVideos(videos => {
                  const updatedVideos = videos.map(v => v.socketId === socketListId ? { ...v, stream: event.stream } : v);
                  videoRef.current = updatedVideos;
                  return updatedVideos;
                });
              } else {
                const newVideo = {
                  socketId: socketListId,
                  stream: event.stream,
                  autoplay: true,
                  playsinline: true
                };
                setVideos(videos => {
                  const updatedVideos = [...videos, newVideo];
                  videoRef.current = updatedVideos;
                  return updatedVideos;
                });
              }
            };

            if (window.localStream) {
              connections[socketListId].addStream(window.localStream);
            } else {
              window.localStream = blackSilence();
              connections[socketListId].addStream(window.localStream);
            }
          }
        });

        if (id === socketIdRef.current) {
          for (const id2 in connections) {
            if (id2 === socketIdRef.current) continue;

            try {
              connections[id2].addStream(window.localStream);
            } catch (e) { }

            connections[id2].createOffer().then(description => {
              connections[id2].setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit('signal', id2, JSON.stringify({ sdp: connections[id2].localDescription }));
                })
                .catch(e => console.log(e));
            });
          }
        }
      });
    });
  };

  // Message handling
  const addMessage = (data, sender, socketIdSender) => {
    setMessages(prev => [...prev, { sender, data }]);
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages(prev => prev + 1);
    }
  };

  const sendMessage = () => {
    socketRef.current.emit('chat-message', message, username);
    setMessage("");
  };

  // Button handlers for toggles
  const handleVideo = () => setVideo(v => !v);
  const handleAudio = () => setAudio(a => !a);
  const handleScreen = () => setScreen(s => !s);
  const handleEndCall = () => {
    try {
      localVideoref.current.srcObject?.getTracks().forEach(track => track.stop());
    } catch (e) {}
    window.location.href = "/home";
  };

  const connect = () => {
    setAskForUsername(false);
    getPermissions();
    getMedia();
  };

  const getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  return (
    <div>
      {askForUsername ? (
        <div className={styles.pageContainer}> 
        <h2 className={styles.mainhead}>Enter into Lobby</h2>
        <div className={styles.lobbyContainer}>
          
          <div className={styles.left}>
            <div>
              <div className={styles.videoStream} style={{ marginTop: 24}}>
                <video ref={localVideoref} autoPlay muted playsInline />
              </div>
            </div>
          </div>
           <div className={styles.right}>
            <TextField
                id="outlined-basic"
                label="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                variant="outlined"
                fullWidth
                style={{ marginBottom: 16 }}
              />
            <Button fullWidth variant="contained" onClick={connect}>Connect</Button>
          </div>
        </div>
        </div>
      ) : (
        <div className={`${styles.meetVideoContainer} ${showModal ? styles.chatOpen : ""}`}>
          {showModal && (
            <div className={styles.chatRoom}>
              <div className={styles.chatContainer}>
                <h1>Chat</h1>
                <div className={styles.chattingDisplay}>
                  {messages.length > 0 ? (
                    messages.map((item, idx) => (
                      <div
                        key={idx}
                        className={`${styles.messageItem} ${item.sender === username ? styles.outgoingMessage : styles.incomingMessage}`}
                      >
                        <span className={styles.messageSender}>{item.sender}</span>
                        <span>{item.data}</span>
                      </div>
                    ))
                  ) : (
                    <p>No Messages Yet</p>
                  )}
                </div>
                <div className={styles.chattingArea}>
                 <button 
                    className={styles.exitChatButton} 
                    onClick={() => setModal(false)} 
                    aria-label="Close chat"
                    title="Close chat"
                  >
                    &times;
                  </button>

                  <TextField
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    id="outlined-basic"
                    label="Enter Your chat"
                    variant="outlined"
                    fullWidth
                    onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
                  />
                  <Button variant="contained" onClick={sendMessage}>Send</Button>
                </div>
              </div>
            </div>
          )}

          <div className={styles.buttonContainers}>
            <IconButton onClick={handleVideo} style={{ color: "white" }} title={video ? "Turn off Video" : "Turn on Video"}>
              {video ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>
            <IconButton onClick={handleEndCall} style={{ color: "red" }} title="End Call">
              <CallEndIcon />
            </IconButton>
            <IconButton onClick={handleAudio} style={{ color: "white" }} title={audio ? "Mute Microphone" : "Unmute Microphone"}>
              {audio ? <MicIcon /> : <MicOffIcon />}
            </IconButton>

            {screenAvailable && (
              <IconButton onClick={handleScreen} style={{ color: "white" }} title={screen ? "Stop Screen Share" : "Share Screen"}>
                {screen ? <ScreenShareIcon /> : <StopScreenShareIcon />}
              </IconButton>
            )}

            <Badge badgeContent={newMessages} max={999} color="warning">
            <IconButton
              onClick={() => {
                setModal(prev => {
                  const open = !prev;
                  if (open) setNewMessages(0);
                  return open;
                });
              }}
              style={{ color: "white" }}
              title="Toggle Chat"
              aria-label="Toggle Chat"
            >
              <ChatIcon />
            </IconButton>
            </Badge>

          </div>

          {/* Local video preview (small) */}
          <video className={styles.meetUserVideo} ref={localVideoref} autoPlay muted playsInline style={{ border: "2px solid red" }}></video>
          {/* Remote users */}
          <div className={styles.conferenceView} data-count={videos.length}>
            
              {videos.map(({ socketId, stream }) => (
            <div className={styles.videoContainer} key={socketId}>
            <video
            data-socket={socketId}
            ref={ref => { if (ref) ref.srcObject = stream; }}
            autoPlay
            playsInline
            />
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}
