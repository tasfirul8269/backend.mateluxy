import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  type: {
    type: String,
    enum: ['property', 'agent', 'admin', 'system'],
    required: true
  },
  action: {
    type: String,
    enum: ['added', 'updated', 'deleted', 'login', 'logout', 'info'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  entityType: {
    type: String,
    enum: ['Property', 'Agent', 'Admin'],
    required: false
  }
}, { timestamps: true });

// Add index for faster queries
NotificationSchema.index({ adminId: 1, read: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', NotificationSchema);

export default Notification; 