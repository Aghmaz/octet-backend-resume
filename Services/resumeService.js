import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
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


export const createResumeService = async (resumeData) => {
  console.log(resumeData, "here is resume Data");
//check if resume already exists
  const existingResume = await Resume.findOne({ userId: resumeData.userId});
  console.log(existingResume, "here is existing resume");
  
//match template name with resume template and update resume 
const updateResume = await Resume.findByIdAndUpdate(existingResume._id, { templateName: resumeData.templateName, personalInfo: resumeData.personalInfo, summary: resumeData.summary, education: resumeData.education, skills: resumeData.skills }, { new: false });
console.log(updateResume, "here is updateResume");
if(!updateResume){
  throw new Error("Resume not updated");
}
if(updateResume.templateName !== resumeData.templateName){
await updateResume.save()
console.log(updateResume, "here is updated resume");
return updateResume;
}

  // create resume
  const resume = await Resume.create({ userId: resumeData.userId, templateName: resumeData.templateName, personalInfo: resumeData.personalInfo, summary: resumeData.summary, education: resumeData.education, skills: resumeData.skills });
  console.log(resume, "here is resume");

  const user = await User.findByIdAndUpdate(resumeData.userId, { $push: { resumes: resume._id } }, { new: true });
  await user.save()
  console.log(user, "here is user");    
  return resume;
};

// Find user by email
export const findUserByEmail = async (userId, templateName, personalInfo, summary, education, experience, skills, projects, certifications, awards, interests, references) => {
  console.log(userId, "here is userId");
//  check if user exists
    const user =  await User.findOne({ _id: userId });
    console.log(user, "here is user");
  if(!user){
    throw new Error("User not found");
  }
  // check if resume exists
  const resume = await Resume.findOne({ userId: userId, templateName: templateName });
  console.log(resume, "here is resume");
  if(!resume){
    throw new Error("Resume not found");
  }
  // update resume
  const updateResume = await Resume.findByIdAndUpdate(resume._id, { personalInfo: personalInfo, summary: summary, education: education, experience: experience, skills: skills, projects: projects, certifications: certifications, awards: awards, interests: interests, references: references }, { new: true });
  console.log(updateResume, "here is updateResume");
  if(!updateResume){
  throw new Error("Resume not updated");
 }
//  save resume
  await updateResume.save()
  console.log(updateResume, "here is updated resume");
  // return updated resume
  return updateResume;
};

// Verify password
export const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
