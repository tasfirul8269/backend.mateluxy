import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'PROPERTY_ADDED',
      'PROPERTY_UPDATED',
      'PROPERTY_DELETED',
      'AGENT_ADDED',
      'AGENT_UPDATED',
      'AGENT_DELETED',
      'ADMIN_ADDED',
      'ADMIN_UPDATED',
      'ADMIN_DELETED',
      'SYSTEM'
    ]
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  read: {
    type: Boolean,
    default: false
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  entityId: {
    type: String,
    default: null
  },
  entityName: {
    type: String,
    default: null
  },
  icon: {
    type: String,
    default: null
  },
  color: {
    type: String,
    default: null
  }
}, { timestamps: true });

// Pre-save hook to set icon and color based on type
NotificationSchema.pre('save', function(next) {
  // Default icons and colors for each notification type
  const typeConfigs = {
    'PROPERTY_ADDED': { icon: '🏠', color: 'bg-green-500' },
    'PROPERTY_UPDATED': { icon: '🔄', color: 'bg-blue-500' },
    'PROPERTY_DELETED': { icon: '🗑️', color: 'bg-red-500' },
    'AGENT_ADDED': { icon: '👤', color: 'bg-green-500' },
    'AGENT_UPDATED': { icon: '🔄', color: 'bg-blue-500' },
    'AGENT_DELETED': { icon: '🗑️', color: 'bg-red-500' },
    'ADMIN_ADDED': { icon: '👑', color: 'bg-green-500' },
    'ADMIN_UPDATED': { icon: '🔄', color: 'bg-blue-500' },
    'ADMIN_DELETED': { icon: '🗑️', color: 'bg-red-500' },
    'SYSTEM': { icon: '⚙️', color: 'bg-gray-500' }
  };

  // Only set icon and color if not already set
  if (!this.icon && typeConfigs[this.type]) {
    this.icon = typeConfigs[this.type].icon;
  }
  
  if (!this.color && typeConfigs[this.type]) {
    this.color = typeConfigs[this.type].color;
  }
  
  next();
});

const Notification = mongoose.model('Notification', NotificationSchema);

export default Notification; 