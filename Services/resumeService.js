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

  // Check if user already exists
  const resume = await Resume.create({ userId: resumeData.userId, templateName: resumeData.templateName, personalInfo: resumeData.personalInfo, summary: resumeData.summary, education: resumeData.education, skills: resumeData.skills });
  console.log(resume, "here is resume");

  const user = await User.findByIdAndUpdate(resumeData.userId, { $push: { resumes: resume._id } }, { new: true });
  console.log(user, "here is user");
  return resume;
};

// Find user by email
export const findUserByEmail = async (email) => {
  // const users = await getUsers();
  return await User.findOne({ email: email });
};

// Verify password
export const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
