import mongoose from 'mongoose';

const AgentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  //General
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  //General
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
  //Specific
  position: {
    type: String,
    default: ''
  },
  whatsapp: {
    type: String,
    default: ''
  },
  //Specific
  department: {
    type: String,
    default: ''
  },
  contactNumber: {
    type: String,
    default: ''
  },
  //Specific
  vcard: {
    type: String,
    default: ''
  },
  //Specific
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