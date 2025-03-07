import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import query from "../config/db.js";

dotenv.config();

const router = express.Router();

// Cloudinary configuration for resume upload
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 60000,
});

// Multer setup for resume upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Utility function for uploading files to Cloudinary
const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder: "resumes" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });

// Endpoint to upload the resume
router.post("/uploadResume", upload.single("resume"), async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res
      .status(400)
      .json({ status: "error", message: "User ID is required" });
  }

  try {
    // Check if the user exists in the job_seeker table
    const sqlCheckUser = "SELECT * FROM job_seeker WHERE user_id = ?";
    const existingUser = await query(sqlCheckUser, [user_id]);

    if (existingUser.length === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "User does not exist." });
    }

    let resume_url = null;

    // Upload resume to Cloudinary if file is provided
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      resume_url = uploadResult.secure_url;
    }

    // Check if resume already exists for the user
    const sqlCheckResume = "SELECT * FROM resumes WHERE user_id = ?";
    const existingResume = await query(sqlCheckResume, [user_id]);

    if (existingResume.length > 0) {
      // Update the existing resume URL
      const sqlUpdate = "UPDATE resumes SET resume_url = ? WHERE user_id = ?";
      await query(sqlUpdate, [
        resume_url || existingResume[0].resume_url,
        user_id,
      ]);

      return res
        .status(200)
        .json({ status: "success", message: "Resume updated successfully" });
    } else {
      // Insert new resume record
      const sqlInsert =
        "INSERT INTO resumes (user_id, resume_url) VALUES (?, ?)";
      await query(sqlInsert, [user_id, resume_url]);

      return res
        .status(201)
        .json({ status: "success", message: "Resume uploaded successfully" });
    }
  } catch (error) {
    console.error("Error uploading resume:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
});

// Endpoint to get a user's resume
router.get("/resume/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    // Check if resume exists
    const sqlGetResume = "SELECT resume_url FROM resumes WHERE user_id = ?";
    const resume = await query(sqlGetResume, [user_id]);

    if (resume.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Resume not found" });
    }

    res
      .status(200)
      .json({ status: "success", resume_url: resume[0].resume_url });
  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

export default router;
