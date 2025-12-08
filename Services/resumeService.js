import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "../models/userModel.js";
import Resume from "../models/resumeModel.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USER_FILE_PATH = path.join(__dirname, "../data/users.json");

// Ensure data directory exists
const ensureDataDirectory = async () => {
  const dataDir = path.dirname(USER_FILE_PATH);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
};

// Read users from file
export const getUsers = async () => {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(USER_FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    if (error.code === "ENOENT") {
      await fs.writeFile(USER_FILE_PATH, JSON.stringify([], null, 2));
      return [];
    }
    throw error;
  }
};

// Generate unique shareId
const generateShareId = () => {
  return crypto.randomBytes(16).toString('hex');
};

export const createResumeService = async ({userId, templateName, personalInfo, summary, education, experience, skills, projects, certifications, awards, interests, references}) => {
  console.log(userId, templateName, personalInfo, summary, education, experience, skills, projects, certifications, awards, interests, references, "here is resume Data");
  
  // Check if resume already exists for this user
  const existingResume = await Resume.findOne({ userId: userId });
  console.log(existingResume, "here is existing resume");
  
  if(existingResume){
    // Update existing resume
    const updateResume = await Resume.findByIdAndUpdate(
      existingResume._id, 
      { 
        templateName: templateName, 
        personalInfo: personalInfo, 
        summary: summary, 
        education: education || [],
        experience: experience || [],
        skills: skills || [],
        references: references || []
      }, 
      { new: true }
    );
    console.log(updateResume, "here is updateResume");
    if(!updateResume){
      throw new Error("Resume not updated");
    }
    await updateResume.save();
    return updateResume;
  }

  // Generate shareId
  let shareId = generateShareId();
  // Ensure uniqueness
  while(await Resume.findOne({ shareId: shareId })){
    shareId = generateShareId();
  }

  // Create new resume
  const resume = await Resume.create({ 
    userId: userId, 
    templateName: templateName, 
    personalInfo: personalInfo, 
    summary: summary, 
    education: education || [],
    experience: experience || [],
    skills: skills || [],
    references: references || [],
    shareId: shareId
  });
  console.log(resume, "here is resume");

  const user = await User.findByIdAndUpdate(userId, { $push: { resumes: resume._id } }, { new: true });
  console.log(user, "here is user");    
  await user.save();
  return resume;
};

// Update resume service - Only updates fields that are provided
export const updateResumeService = async (userId, templateName, personalInfo, summary, education, experience, skills, projects, certifications, awards, interests, references) => {
  console.log(userId, "here is userId");
  
  // Check if user exists
  const user = await User.findOne({ _id: userId });
  console.log(user, "here is user");
  if(!user){
    throw new Error("User not found");
  }
  
  // Check if resume exists
  const resume = await Resume.findOne({ userId: userId, templateName: templateName });
  console.log(resume, "here is resume");
  if(!resume){
    throw new Error("Resume not found");
  }
  
  // Build update object - only include fields that are provided (not undefined)
  const updateFields = {};
  
  if (personalInfo !== undefined) {
    updateFields.personalInfo = personalInfo;
  }
  
  if (summary !== undefined) {
    updateFields.summary = summary;
  }
  
  if (education !== undefined) {
    updateFields.education = education;
  }
  
  if (experience !== undefined) {
    updateFields.experience = experience;
  }
  
  if (skills !== undefined) {
    updateFields.skills = skills;
  }
  
  if (projects !== undefined) {
    updateFields.projects = projects;
  }
  
  if (certifications !== undefined) {
    updateFields.certifications = certifications;
  }
  
  if (awards !== undefined) {
    updateFields.awards = awards;
  }
  
  if (interests !== undefined) {
    updateFields.interests = interests;
  }
  
  if (references !== undefined) {
    updateFields.references = references;
  }
  
  // Update resume - only update fields that were provided
  const updateResume = await Resume.findByIdAndUpdate(
    resume._id, 
    { $set: updateFields }, 
    { new: true }
  );
  console.log(updateResume, "here is updateResume");
  if(!updateResume){
    throw new Error("Resume not updated");
  }
  
  // Generate shareId if it doesn't exist
  if(!updateResume.shareId){
    let shareId = generateShareId();
    // Ensure uniqueness
    while(await Resume.findOne({ shareId: shareId })){
      shareId = generateShareId();
    }
    updateResume.shareId = shareId;
    await updateResume.save();
  }
  
  // Return updated resume
  return updateResume;
};

// Get resume by userId and templateName
export const getResumeService = async (userId, templateName) => {
  console.log(userId, templateName, "here is userId and templateName");
  
  // Check if user exists
  const user = await User.findOne({ _id: userId });
  if(!user){
    throw new Error("User not found");
  }
  
  // Find resume
  let resume = await Resume.findOne({ userId: userId, templateName: templateName });
  if(!resume){
    return null; // Resume doesn't exist yet
  }
  
  // Generate shareId if it doesn't exist
  if(!resume.shareId){
    let shareId = generateShareId();
    // Ensure uniqueness
    while(await Resume.findOne({ shareId: shareId })){
      shareId = generateShareId();
    }
    resume.shareId = shareId;
    await resume.save();
  }
  
  return resume;
};

// Get resume by shareId (public endpoint)
export const getResumeByShareIdService = async (shareId) => {
  console.log(shareId, "here is shareId");
  
  const resume = await Resume.findOne( shareId );
  if(!resume){
    return null;
  }
  
  return resume;
};

// Verify password
export const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
