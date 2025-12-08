// models/Resume.js
import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

 
  // Resume data stored in JSON
  personalInfo: {
    name: String,
    email: String,
    phone: String,
    address: String
  },

  summary: String,

  templateName: String,

  // Work Experience
  experience: [
    {
      position: String,
      company: String,
      location: String,
      startDate: String,
      endDate: String,
      isPresent: { type: Boolean, default: false },
      description: String
    }
  ],

  education: [
    {
      degree: String,
      institution: String,
      location: String,
      startDate: String,
      endDate: String,
      isPresent: { type: Boolean, default: false },
      description: String
    }
  ],

  skills: [String],

  // References
  references: [
    {
      name: String,
      title: String,
      company: String,
      email: String
    }
  ],

  // Shareable URL ID
  shareId: { 
    type: String, 
    unique: true, 
    sparse: true // Allows null values but ensures uniqueness when present
  },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Resume", resumeSchema);
