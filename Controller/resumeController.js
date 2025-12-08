import {
    createResumeService,
    updateResumeService,
    getResumeService,
    getResumeByShareIdService,
  } from "../Services/resumeService.js";
  
  export const createResume = async (req, res) => {
    try {
      const { userId,templateName, personalInfo, summary, education, experience, skills, projects, certifications, awards, interests, references } = req.body;
  console.log(userId, templateName, personalInfo, summary, education, experience, skills, projects, certifications, awards, interests, references, "here is req.body");
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
      const { userId, templateName, personalInfo, summary, education, experience, skills, projects, certifications, awards, interests, references } = req.body;
  
      // Validation
      if (!userId || !templateName) {
        return res.status(400).json({
          success: false,
          message: "userId and templateName are required",
        }); 
      }
  
      // Update resume
      const updatedResume = await updateResumeService(
        userId, 
        templateName, 
        personalInfo, 
        summary, 
        education, 
        experience, 
        skills, 
        projects, 
        certifications, 
        awards, 
        interests, 
        references
      );
  
      res.json({
        success: true,
        message: "Resume updated successfully",
        resume: updatedResume,
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
      const { userId, templateName } = req.query;
  
      // Validation
      if (!userId || !templateName) {
        return res.status(400).json({
          success: false,
          message: "userId and templateName are required",
        });
      }
  
      // Get resume
      const resume = await getResumeService(userId, templateName);
  
      if (!resume) {
        return res.json({
          success: true,
          message: "Resume not found",
          resume: null,
        });
      }
  
      res.json({
        success: true,
        message: "Resume fetched successfully",
        resume: resume,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  };
  
  export const getResumeByShareId = async (req, res) => {
    try {
      const { shareId } = req.params;
      console.log(shareId, "here is shareId");
      const resume = await getResumeByShareIdService({shareId});
      console.log(resume, "here is resume");
      res.json({
        success: true,
        message: "Resume fetched successfully",
        resume: resume,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  };