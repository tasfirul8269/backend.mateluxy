import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { 
  getNotifications, 
  createNotification, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification,
  clearAllNotifications 
} from "../controllers/notifications.controller.js";

const router = express.Router();

// Get all notifications
router.get("/", verifyToken, getNotifications);

// Create a new notification
router.post("/", verifyToken, createNotification);

// Mark all notifications as read
router.put("/mark-all-read", verifyToken, markAllNotificationsAsRead);

// Clear all notifications - IMPORTANT: This route must be defined BEFORE the /:id routes
router.delete("/clear-all", verifyToken, clearAllNotifications);

// Mark a notification as read
router.put("/:id/read", verifyToken, markNotificationAsRead);

// Delete a notification
router.delete("/:id", verifyToken, deleteNotification);

export default router; 