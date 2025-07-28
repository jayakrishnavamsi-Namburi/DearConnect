import { Router } from "express";
import {
  addToHistory,
  getUserHistory,
  login,
  register,
} from "../controllers/user.controller.js";

const router = Router();

// Route to handle user login
router.post("/login", login);

// Route to handle user registration
router.post("/register", register);

// Route to add a new activity to user's history
router.post("/add_to_activity", addToHistory);

// Route to get all user activity history
router.get("/get_all_activity", getUserHistory);

export default router;
