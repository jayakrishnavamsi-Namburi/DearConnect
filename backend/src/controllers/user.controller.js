// // controllers/user.controller.js
// import jwt from "jsonwebtoken";
// import httpStatus from "http-status";
// import { User } from "../models/user.model.js";
// import { Meeting } from "../models/meeting.model.js";

// // Secret key for JWT
// const SECRET = "MY_SECRET"; // replace with process.env.JWT_SECRET in production

// export const register = async (req, res) => {
//   try {
//     const { name, username, password } = req.body;

//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.status(httpStatus.CONFLICT).json({ message: "User already exists" });
//     }

//     const newUser = await User.create({ name, username, password });
//     res.status(httpStatus.CREATED).json({ message: "Registered successfully" });
//   } catch (err) {
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
//   }
// };

// export const login = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const user = await User.findOne({ username });
//     if (!user || user.password !== password) {
//       return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "7d" });
//     res.status(httpStatus.OK).json({ token });
//   } catch (err) {
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
//   }
// };

// export const addToHistory = async (req, res) => {
//   try {
//     const authHeader = req.headers.authorization;
//     const token = authHeader?.split(" ")[1];

//     if (!token) {
//       return res.status(httpStatus.UNAUTHORIZED).json({ message: "No token provided" });
//     }

//     const decoded = jwt.verify(token, SECRET);
//     const { meeting_code } = req.body;

//     await Meeting.create({
//       user_id: decoded.id,
//       meetingCode: meeting_code,
//     });

//     res.status(httpStatus.CREATED).json({ message: "Meeting history added" });
//   } catch (err) {
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
//   }
// };

// export const getUserHistory = async (req, res) => {
//   try {
//     const authHeader = req.headers.authorization;
//     const token = authHeader?.split(" ")[1];

//     if (!token) {
//       return res.status(httpStatus.UNAUTHORIZED).json({ message: "No token provided" });
//     }

//     const decoded = jwt.verify(token, SECRET);

//     const meetings = await Meeting.find({ user_id: decoded.id });

//     res.status(httpStatus.OK).json(meetings);
//   } catch (err) {
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
//   }
// };


import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import { Meeting } from "../models/meeting.model.js";

// Secret key for JWT
const SECRET = "MY_SECRET"; // Replace with process.env.JWT_SECRET in production

const IS_PROD = process.env.NODE_ENV === "production";

// --------------------------- REGISTER ---------------------------
export const register = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(httpStatus.CONFLICT).json({ message: "User already exists" });
    }

    const newUser = await User.create({ name, username, password });
    res.status(httpStatus.CREATED).json({ message: "Registered successfully" });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

// --------------------------- LOGIN ---------------------------
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "7d" });

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: IS_PROD ? "none" : "lax",
    });

    res.status(httpStatus.OK).json({ message: "Login successful" });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

// --------------------------- ADD TO HISTORY ---------------------------
export const addToHistory = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, SECRET);
    const { meeting_code } = req.body;

    await Meeting.create({
      user_id: decoded.id,
      meetingCode: meeting_code,
    });

    res.status(httpStatus.CREATED).json({ message: "Meeting history added" });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

// --------------------------- GET USER HISTORY ---------------------------
export const getUserHistory = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, SECRET);
    const meetings = await Meeting.find({ user_id: decoded.id });

    res.status(httpStatus.OK).json(meetings);
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};
