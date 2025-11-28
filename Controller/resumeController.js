import {
    createResumeService,
    findUserByEmail,
    verifyPassword,
  } from "../Services/resumeService.js";
  import { generateToken } from "../Services/jwtService.js";
  
  export const createResume = async (req, res) => {
    try {
      const { userId,templateName, personalInfo, summary, education, experience, skills, projects, certifications, awards, interests, references } = req.body;
  
      // Validation
      if (!userId || !templateName) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }
  
      
      // Create user
      const resume = await createResumeService({ userId, templateName , personalInfo, summary, education, experience, skills, projects, certifications, awards, interests, references });
      console.log(resume, "here is resume");
      // Generate JWT token

    
      res.status(201).json({
        success: true,
        message: "User created successfully",
        resume,
      });
    } catch (error) {
     
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  };
  
  export const updateResume = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }
  
      // Find user
      const user = await findUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }
  
      // Verify password
      const isPasswordValid = await verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }
  
  
      res.json({
        success: true,
        message: "Login successful",
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  };
  
  export const deleteResume = async (req, res) => {
     
        res.json({
        success: true,
        message: "Logout successful",
        });
  };
  
  export const getResume = async (req, res) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }
  
    
  
      const user = await findUserByEmail(decoded.email);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      const { password, ...userWithoutPassword } = user;
      res.json({
        success: true,
        user: userWithoutPassword,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  };
  