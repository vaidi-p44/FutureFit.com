import express from "express";
import query from "../config/db.js";
import dotenv from "dotenv";
import multer from "multer";
import cloudinary from "cloudinary";

dotenv.config();

const router = express.Router();

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 60000,
});

// Configure Multer (Store file in memory before upload)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload function to Cloudinary
const uploadToCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder: "company_logos", resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

/**
 * 📌 Save or update employee registration data
 */
router.post(
  "/register-employee",
  upload.single("companyLogo"),
  async (req, res) => {
    console.log("Received request body:", req.body);
    console.log(
      "Received file:",
      req.file ? req.file.originalname : "No file uploaded"
    ); // Debugging line

    const {
      user_id,
      hiringFor,
      companyName,
      industry,
      employeeCount,
      designation,
      pincode,
      address,
    } = req.body;

    // Validate required fields
    if (
      !user_id ||
      !companyName ||
      !industry ||
      !designation ||
      !pincode ||
      !address
    ) {
      return res
        .status(400)
        .json({ status: "error", message: "Required fields are missing." });
    }

    let companyLogoUrl = null;

    // Upload to Cloudinary if a file is provided
    if (req.file) {
      console.log("Uploading to Cloudinary...");
      try {
        companyLogoUrl = await uploadToCloudinary(req.file.buffer);
        console.log("Cloudinary Upload Success:", companyLogoUrl);
      } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        return res
          .status(500)
          .json({ status: "error", message: "Image upload failed." });
      }
    }

    try {
      // 1️⃣ Check if user_id exists in the `employee` table
      const sqlCheckUser = "SELECT * FROM employee WHERE user_id = ?";
      const userExists = await query(sqlCheckUser, [user_id]);

      if (userExists.length === 0) {
        return res
          .status(404)
          .json({ status: "error", message: "Invalid user ID." });
      }

      console.log("User found, proceeding to save employee data...");

      // 2️⃣ Check if user already has an employee registration entry
      const sqlCheckEmployee =
        "SELECT * FROM EmployeeRegistration WHERE user_id = ?";
      const existingEmployee = await query(sqlCheckEmployee, [user_id]);

      if (existingEmployee.length > 0) {
        console.log("Updating existing employee registration...");
        const sqlUpdate = `
        UPDATE EmployeeRegistration 
        SET hiringFor = ?, companyName = ?, industry = ?, employeeCount = ?, designation = ?, pincode = ?, address = ?, companyLogo = ? 
        WHERE user_id = ?
      `;
        await query(sqlUpdate, [
          hiringFor,
          companyName,
          industry,
          employeeCount || null,
          designation,
          pincode,
          address,
          companyLogoUrl || existingEmployee[0].companyLogo, // Keep existing logo if not updated
          user_id,
        ]);

        return res.status(200).json({
          status: "success",
          message: "Employee registration updated successfully.",
        });
      } else {
        console.log("Inserting new employee registration...");
        const sqlInsert = `
        INSERT INTO EmployeeRegistration (user_id, hiringFor, companyName, industry, employeeCount, designation, pincode, address, companyLogo) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
        await query(sqlInsert, [
          user_id,
          hiringFor,
          companyName,
          industry,
          employeeCount || null,
          designation,
          pincode,
          address,
          companyLogoUrl,
        ]);

        return res.status(201).json({
          status: "success",
          message: "Employee registration saved successfully.",
        });
      }
    } catch (error) {
      console.error("Error saving employee registration:", error);
      return res
        .status(500)
        .json({ status: "error", message: "Internal server error." });
    }
  }
);

router.get("/company-profile/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    // Check if the employee is registered
    const sqlFetchProfile = `
      SELECT * FROM EmployeeRegistration WHERE user_id = ?
    `;
    const profile = await query(sqlFetchProfile, [user_id]);

    if (profile.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Company profile not found." });
    }

    res.status(200).json(profile[0]); // Send profile data
  } catch (error) {
    console.error("Error fetching company profile:", error);
    res
      .status(500)
      .json({ status: "error", message: "Internal server error." });
  }
});

export default router;
