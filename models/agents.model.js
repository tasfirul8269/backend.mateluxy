import mongoose from 'mongoose';

const AgentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  profileImage: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true  
  },
  position: {
    type: String,
    default: ''
  },
  whatsapp: {
    type: String,
    default: ''
  },
  department: {
    type: String,
    default: ''
  },
  contactNumber: {
    type: String,
    default: ''
  },
  vcard: {
    type: String,
    default: ''
  },
  languages: {
    type: [String],
    default: []
  },
  aboutMe: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  socialLinks: {
    type: [String],
    default: []
  }
}, { timestamps: true });

const Agent = mongoose.model('Agent', AgentSchema);

export default Agent;