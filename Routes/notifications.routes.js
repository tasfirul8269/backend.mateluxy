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

// Mark a notification as read
router.put("/:id/read", verifyToken, markNotificationAsRead);

// Mark all notifications as read
router.put("/mark-all-read", verifyToken, markAllNotificationsAsRead);

// Delete a notification
router.delete("/:id", verifyToken, deleteNotification);

// Clear all notifications
router.delete("/clear-all", verifyToken, clearAllNotifications);

export default router; 