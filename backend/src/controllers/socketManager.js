import { Server } from "socket.io";

// ✅ Declare globals to fix runtime errors
const connections = {};
const timeOnline = {};
const message = {};

export const connectTOSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("Some thing connected");

        socket.on("join-call", (path) => {
            if (connections[path] === undefined) {
                connections[path] = [];
            }
            connections[path].push(socket.id);
            timeOnline[socket.id] = new Date();

            // Notify all users in room
            connections[path].forEach(id => {
                io.to(id).emit("user-joined", socket.id, connections[path]);
            });

            // Send old messages to newly joined user
            if (message[path] !== undefined) {
                message[path].forEach(msg => {
                    io.to(socket.id).emit("chat-message", msg.data, msg.sender, msg["socket-id-sender"]);
                });
            }
        });

        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        });

        socket.on("chat-message", (data, sender) => {
            const [matchingRoom, found] = Object.entries(connections).reduce(
                ([room, isFound], [roomKey, roomValue]) => {
                    if (!isFound && roomValue.includes(socket.id)) {
                        return [roomKey, true];
                    }
                    return [room, isFound];
                },
                ['', false]
            );

            if (found) {
                if (message[matchingRoom] === undefined) {
                    message[matchingRoom] = [];
                }

                message[matchingRoom].push({
                    sender,
                    data,
                    "socket-id-sender": socket.id
                });

                // Broadcast to all users
                connections[matchingRoom].forEach(id => {
                    io.to(id).emit("chat-message", data, sender, socket.id);
                });
            }
        });

        socket.on("disconnect", () => {
            let diffTime = Math.abs(new Date() - timeOnline[socket.id]);
            console.log(`Disconnected after ${diffTime}ms: ${socket.id}`);

            for (const [key, value] of Object.entries(connections)) {
                if (value.includes(socket.id)) {
                    // Notify others
                    value.forEach(id => {
                        io.to(id).emit("user-left", socket.id);
                    });

                    // Remove user
                    const index = value.indexOf(socket.id);
                    connections[key].splice(index, 1);

                    if (connections[key].length === 0) {
                        delete connections[key];
                    }
                    break;
                }
            }

            delete timeOnline[socket.id];
        });
    });
};
// import { Server } from "socket.io";

// // Global state
// const connections = {}; // { roomId: [socketId, ...] }
// const timeOnline = {};  // { socketId: joinTimestamp }
// const messages = {};    // { roomId: [{ sender, data, socketIdSender }, ...] }
// const fullUsernames = {}; // { socketId: username }

// const MAX_CHAT_HISTORY = 100; // cap chat history length per room

// export const connectTOSocket = (server) => {
//   const io = new Server(server, {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"],
//       allowedHeaders: ["*"],
//       credentials: true,
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("New user connected:", socket.id);

//     /** User joins a call/room **/
//     socket.on("join-call", ({ path, username }) => {
//       // Join the socket.io room
//       socket.join(path);

//       // Initialize room array if doesn't exist
//       if (!connections[path]) {
//         connections[path] = [];
//       }

//       // Save username
//       fullUsernames[socket.id] = username?.trim() || "Guest";

//       // Avoid duplicate entries
//       if (!connections[path].includes(socket.id)) {
//         connections[path].push(socket.id);
//       }

//       // Record join time
//       timeOnline[socket.id] = new Date();

//       // Prepare username list for the room
//       const existingUsernames = {};
//       connections[path].forEach((id) => {
//         if (fullUsernames[id]) {
//           existingUsernames[id] = fullUsernames[id];
//         }
//       });

//       // Notify the room: user joined + updated user list
//       io.to(path).emit("user-joined", socket.id, fullUsernames[socket.id]);
//       io.to(path).emit("user-list", existingUsernames);

//       // Send chat history (if any) to the joining socket only
//       if (messages[path]) {
//         messages[path].forEach((msg) => {
//           socket.emit("chat-message", msg.data, msg.sender, msg.socketIdSender);
//         });
//       }
//     });

//     /** Relay signaling data */
//     socket.on("signal", (toId, message) => {
//       io.to(toId).emit("signal", socket.id, message);
//     });

//     /** Handle chat messages */
//     socket.on("chat-message", (data, sender) => {
//       // Find which room this socket belongs to
//       const [matchingRoom, found] = Object.entries(connections).find(
//         ([, participants]) => participants.includes(socket.id)
//       ) || [null, false];

//       if (found && matchingRoom) {
//         if (!messages[matchingRoom]) {
//           messages[matchingRoom] = [];
//         }

//         // Store the message with sender info
//         messages[matchingRoom].push({
//           sender,
//           data,
//           socketIdSender: socket.id,
//         });

//         // Cap chat history length
//         if (messages[matchingRoom].length > MAX_CHAT_HISTORY) {
//           messages[matchingRoom].shift(); // remove oldest
//         }

//         // Broadcast message to all in room
//         io.to(matchingRoom).emit("chat-message", data, sender, socket.id);
//       }
//     });

//     /** Handle disconnect */
//     socket.on("disconnect", () => {
//       const durationMs = new Date() - timeOnline[socket.id];
//       console.log(`User disconnected after ${durationMs}ms: ${socket.id}`);

//       // Find room that contains this socket
//       for (const [room, participants] of Object.entries(connections)) {
//         if (participants.includes(socket.id)) {
//           // Remove user from participants
//           const index = participants.indexOf(socket.id);
//           if (index !== -1) participants.splice(index, 1);

//           // Notify remaining users that someone left
//           io.to(room).emit("user-left", socket.id);

//           // Update username list and broadcast it
//           const existingUsernames = {};
//           participants.forEach(id => {
//             if (fullUsernames[id]) {
//               existingUsernames[id] = fullUsernames[id];
//             }
//           });
//           io.to(room).emit("user-list", existingUsernames);

//           // If no users left in room, clean up room data
//           if (participants.length === 0) {
//             delete connections[room];
//             delete messages[room];
//           }
//           break; // socket can only be in one room, so exit loop
//         }
//       }

//       // Clean up user-specific data
//       delete fullUsernames[socket.id];
//       delete timeOnline[socket.id];
//     });
//   });

//   console.log("Socket.io server running...");
// };
