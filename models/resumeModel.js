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


  education: [
    {
      school: String,
      degree: String,
      startDate: String,
      endDate: String
    }
  ],

  skills: [String],

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Resume", resumeSchema);
