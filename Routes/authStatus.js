// backend/routes/auth.js
import express from 'express';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

router.get("/check-auth", verifyToken, (req, res) => {
  res.status(200).json({ success: true, message: "Authorized" });
});

export default router;
