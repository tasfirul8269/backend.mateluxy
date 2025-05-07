// backend/routes/auth.js
import express from 'express';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

router.get("/check-auth", verifyToken, (req, res) => {
  res.status(200).json({ success: true, message: "Authorized" });
});

// Add logout endpoint
router.post("/logout", (req, res) => {
  // Clear the authentication cookie
  res.clearCookie('access_token').status(200).json({ 
    success: true, 
    message: "Logged out successfully" 
  });
});

export default router;
