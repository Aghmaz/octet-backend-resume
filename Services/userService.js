import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import { User } from "../models/userModel.js";
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

// Write users to file
export const saveUsers = async (users) => {
  await ensureDataDirectory();
  await fs.writeFile(USER_FILE_PATH, JSON.stringify(users, null, 2));
};

// Create new user
// export const createUser = async (userData) => {
//   // const users = await getUsers();
//   console.log(userData, "here is user Data");
//   // Check if user already exists
//   const existingUser = await User.findOne({ email: userData.email });
//   console.log(existingUser, "here is user");
//   if (existingUser) {
//     throw new Error("User with this email already exists");
//   }

//   // Hash password
//   const hashedPassword = await bcrypt.hash(userData.password, 10);
//   console.log(hashedPassword, "passowrd here");
//   // Create user object
//   // const newUser = {
//   //   id: Date.now().toString(),
//   //   fullName: userData.fullName,
//   //   email: userData.email,
//   //   password: hashedPassword,
//   //   createdAt: new Date().toISOString(),
//   // };

//   // users.push(newUser);
//   const user = new User({
//     email: userData.email,
//     name: userData.name,
//     password: hashedPassword,
//   });
//   // await saveUsers(users);
//   await user.save();

//   // Return user without password
//   // const { password, ...userWithoutPassword } = newUser;
//   return user;
// };

export const createUser = async (userData) => {
  console.log(userData, "here is user Data");

  // Check if user already exists
  const existingUser = await User.findOne({ email: userData.email });
  console.log(existingUser, "here is user");

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const user = new User({
    email: userData.email,
    name: userData.name,
    password: hashedPassword,
  });

  await user.save();

  return user;
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
