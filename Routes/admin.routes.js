import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { 
  getCurrentAdmin, 
  updateAdminProfile, 
  checkAuthStatus,
  logoutAdmin
} from "../controllers/admin.controller.js";

const router = express.Router();

// Get current admin profile (requires authentication)
router.get("/profile", verifyToken, getCurrentAdmin);

// Update admin profile (requires authentication)
router.put("/profile", verifyToken, updateAdminProfile);

// Check authentication status
router.get("/check-auth", verifyToken, checkAuthStatus);

// Logout admin
router.post("/logout", logoutAdmin);

export default router; 