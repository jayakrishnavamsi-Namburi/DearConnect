// // Load environment variables
// import dotenv from 'dotenv';
// dotenv.config();

// // Import dependencies
// import express from 'express';
// import { createServer } from 'node:http';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';

// // Import socket setup
// import { connectTOSocket } from './controllers/socketManager.js';

// // Import user routes
// import userRoutes from "./routes/users.routes.js";

// // App and server initialization
// const app = express();
// const server = createServer(app);

// // Connect sockets to the server
// const io = connectTOSocket(server);

// // Constants
// const PORT = process.env.PORT || 10000; // ✅ Render uses PORT from environment
// const allowedOrigins = [
//   "https://dearconnect.onrender.com",  
//   "http://localhost:3000"              
// ];

// // Middleware
// app.use(cors({
//   origin: allowedOrigins,
//   credentials: true,
// }));
// app.use(cookieParser());
// app.use(express.json({ limit: "40kb" }));
// app.use(express.urlencoded({ limit: "40kb", extended: true }));

// // Routes
// app.use("/api/v1/users", userRoutes);

// // Test routes
// app.get("/home", (req, res) => {
//   res.send("Welcome to DearConnect!");
// });

// app.get("/", (req, res) => {
//   res.send("API is live.");
// });

// // MongoDB Connection
// const connectMongoDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("✅ Connected to MongoDB");
//   } catch (error) {
//     console.error("❌ MongoDB connection error:", error.message);
//     process.exit(1);
//   }
// };

// // Start the server after DB connection
// const startServer = async () => {
//   await connectMongoDB();

//   server.listen(PORT, () => {
//     console.log(`🚀 Server is running on port ${PORT}`);
//   });
// };

// startServer();


// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Import dependencies
import express from 'express';
import { createServer } from 'node:http';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Import socket setup
import { connectTOSocket } from './controllers/socketManager.js';

// Import user routes
import userRoutes from './routes/users.routes.js';

// App and server initialization
const app = express();
const server = createServer(app);

// Connect sockets to the server
const io = connectTOSocket(server);

// Constants
const PORT = process.env.PORT || 10000; // Use environment port or default to 10000

const allowedOrigins = [
  'https://dearconnect.onrender.com',
  'http://localhost:3000',
];

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: '40kb' }));
app.use(express.urlencoded({ limit: '40kb', extended: true }));

// Routes
app.use('/api/v1/users', userRoutes);

// Simple Test Routes
app.get('/home', (req, res) => {
  res.send('Welcome to DearConnect!');
});

app.get('/', (req, res) => {
  res.send('API is live.');
});

// MongoDB Connection
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error(' MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Optional: Global error handler middleware (for better error handling)
app.use((err, req, res, next) => {
  console.error(' Global error handler:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Graceful shutdown function (optional but recommended)
const gracefulShutdown = () => {
  console.log('\nShutting down gracefully...');
  mongoose.connection.close(false, () => {
    console.log('MongoDB connection closed.');
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Start the server after DB connection established
const startServer = async () => {
  await connectMongoDB();

  server.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
  });
};

startServer();
