import Notification from "../models/notification.model.js";
import { errorHandler } from "../utils/erros.js";

// Get all notifications for the authenticated user
export const getNotifications = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    
    const notifications = await Notification.find({ 
      recipient: adminId 
    }).sort({ createdAt: -1 }).limit(50);
    
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

// Create a new notification
export const createNotification = async (req, res, next) => {
  try {
    const { type, message, entityId, entityName, recipients } = req.body;
    
    // Validate required fields
    if (!type || !message) {
      return next(errorHandler(400, "Type and message are required"));
    }
    
    // Default recipient is current admin if no recipients specified
    const adminId = req.user.id;
    const notificationRecipients = recipients || [adminId];
    
    // Create notifications for all recipients
    const notifications = await Promise.all(
      notificationRecipients.map(recipient => {
        return Notification.create({
          type,
          message,
          entityId,
          entityName,
          recipient,
          createdBy: adminId
        });
      })
    );
    
    res.status(201).json(notifications);
  } catch (error) {
    next(error);
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;
    
    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: adminId },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return next(errorHandler(404, "Notification not found"));
    }
    
    res.status(200).json(notification);
  } catch (error) {
    next(error);
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    
    const result = await Notification.updateMany(
      { recipient: adminId, read: false },
      { read: true }
    );
    
    res.status(200).json({ 
      success: true, 
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    next(error);
  }
};

// Delete a notification
export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;
    
    const notification = await Notification.findOneAndDelete({ 
      _id: id, 
      recipient: adminId 
    });
    
    if (!notification) {
      return next(errorHandler(404, "Notification not found"));
    }
    
    res.status(200).json({ 
      success: true, 
      message: "Notification deleted" 
    });
  } catch (error) {
    next(error);
  }
};

// Clear all notifications
export const clearAllNotifications = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    
    const result = await Notification.deleteMany({ 
      recipient: adminId 
    });
    
    res.status(200).json({ 
      success: true, 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    next(error);
  }
}; 