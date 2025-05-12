import mongoose from 'mongoose';

const propertyRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  countryCode: {
    type: String,
    default: '+971',
    trim: true
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  propertyTitle: {
    type: String,
    required: true
  },
  privacyConsent: {
    type: Boolean,
    required: true,
    default: false
  },
  marketingConsent: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'closed'],
    default: 'new'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
propertyRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const PropertyRequest = mongoose.model('PropertyRequest', propertyRequestSchema);

export default PropertyRequest; 