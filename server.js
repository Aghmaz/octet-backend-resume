import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./Routes/authRoutes.js";
import resumeRoutes from "./Routes/resumeRoutes.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Vite default port
    credentials: true, // Allow cookies
  })
);
app.use(express.json());
app.use(cookieParser());

// local mongodb connection  localhost === mongodb://0.0.0.0:27017
mongoose
  .connect("mongodb://localhost:27017/octetResumeDatabase")
  .then(() => {
    console.log("Mongodb Connected");
  })
  .catch((err) => {
    console.log(err, "mongodb connection");
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
