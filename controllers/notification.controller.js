import mongoose from 'mongoose';
import Notification from '../models/notification.model.js';
import { errorHandler } from '../utils/erros.js';

// Get all notifications for the current admin
export const getNotifications = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    
    // Get notifications for this admin, sorted by newest first
    const notifications = await Notification.find({ adminId })
      .sort({ createdAt: -1 })
      .limit(50);  // Limit to the 50 most recent
    
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

// Create a new notification
export const createNotification = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    const { type, action, message } = req.body;
    
    // Validate required fields
    if (!type || !action || !message) {
      return next(errorHandler(400, 'Type, action, and message are required fields'));
    }
    
    // Create the notification
    const newNotification = new Notification({
      adminId,
      type,
      action,
      message,
      read: false,
    });
    
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    next(error);
  }
};

// Mark a notification as read
export const markAsRead = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    const notificationId = req.params.id;
    
    // Make sure notification exists and belongs to this admin
    const notification = await Notification.findOne({ 
      _id: notificationId,
      adminId 
    });
    
    if (!notification) {
      return next(errorHandler(404, 'Notification not found'));
    }
    
    // Update to mark as read
    notification.read = true;
    await notification.save();
    
    res.status(200).json({ success: true, notification });
  } catch (error) {
    next(error);
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    
    // Update all unread notifications for this admin
    const result = await Notification.updateMany(
      { adminId, read: false },
      { $set: { read: true } }
    );
    
    res.status(200).json({ 
      success: true, 
      count: result.modifiedCount,
      message: `Marked ${result.modifiedCount} notifications as read` 
    });
  } catch (error) {
    next(error);
  }
};

// Delete a notification
export const deleteNotification = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    const notificationId = req.params.id;
    
    // Make sure notification exists and belongs to this admin
    const notification = await Notification.findOne({ 
      _id: notificationId, 
      adminId 
    });
    
    if (!notification) {
      return next(errorHandler(404, 'Notification not found'));
    }
    
    // Delete the notification
    await Notification.findByIdAndDelete(notificationId);
    
    res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
}; 