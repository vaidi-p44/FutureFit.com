import express from "express";
import query from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Save or update user education
router.post("/EducationForm", async (req, res) => {
  const {
    user_id,
    course_name,
    college_name,
    percentage,
    starting_year,
    ending_year,
    course_type,
    // skills,
    education_type,
  } = req.body;

  // Validate required fields
  if (!user_id || !course_name || !education_type) {
    return res
      .status(400)
      .json({ status: "error", message: "Required fields are missing." });
  }

  try {
    // 1. Verify if user_id exists
    const sqlCheckUser = "SELECT * FROM job_seeker WHERE user_id = ?";
    const userExists = await query(sqlCheckUser, [user_id]);

    if (userExists.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Invalid user ID." });
    }

    // 2. Handle starting_year validation based on education_type
    let validStartingYear = starting_year;
    if (["class12", "class10"].includes(education_type)) {
      validStartingYear = starting_year || null; // Allow null for class12 or class10
    } else if (!starting_year) {
      return res
        .status(400)
        .json({ status: "error", message: "Starting year is required." });
    }

    // 3. Handle course_type logic
    let validCourseType = course_type || null; // Allow NULL if course_type is not provided

    // 4. Parse skills to JSON string
    // const skillsString = JSON.stringify(skills || []);

    // 5. Check if a profile exists for the user with the same education_type
    const sqlCheckProfile =
      "SELECT * FROM education WHERE user_id = ? AND education_type = ?";
    const existingProfile = await query(sqlCheckProfile, [
      user_id,
      education_type,
    ]);

    if (existingProfile.length > 0) {
      // Update existing profile
      const sqlUpdate = `
        UPDATE education 
        SET course_name = ?, college_name = ?, percentage = ?, 
            starting_year = ?, ending_year = ?, course_type = ?
           
        WHERE user_id = ? AND education_type = ?`;
      await query(sqlUpdate, [
        course_name,
        college_name,
        percentage,
        validStartingYear,
        ending_year,
        validCourseType,
        // skillsString,
        user_id,
        education_type,
      ]);

      return res.status(200).json({
        status: "success",
        message: "Education details updated successfully.",
      });
    } else {
      // Insert new profile
      const sqlInsert = `
        INSERT INTO education 
        (user_id, course_name, college_name, percentage, 
         starting_year, ending_year, course_type,  education_type) 
        VALUES (?, ?, ?, ?, ?, ?, ?,  ?)`;
      await query(sqlInsert, [
        user_id,
        course_name,
        college_name,
        percentage,
        validStartingYear,
        ending_year,
        validCourseType,
        // skillsString,
        education_type,
      ]);

      return res.status(201).json({
        status: "success",
        message: "Education details saved successfully.",
      });
    }
  } catch (error) {
    console.error("Error saving education details:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error." });
  }
});

// Get user education by user_id
router.get("/EducationForm/:user_id", async (req, res) => {
  const { user_id } = req.params;

  // Validate required field
  if (!user_id) {
    return res
      .status(400)
      .json({ status: "error", message: "User ID is required." });
  }

  try {
    const sql = `
      SELECT *
      FROM education
      WHERE user_id = ?`;

    const results = await query(sql, [user_id]);

    if (results.length > 0) {
      // Parse skills JSON from database
      const educationData = results.map((row) => ({
        ...row,
        // skills: row.skills ? JSON.parse(row.skills) : [],
      }));

      return res.status(200).json({
        status: "success",
        data: educationData,
      });
    } else {
      return res.status(200).json({
        status: "success",
        data: [],
        message: "No education details found.",
      });
    }
  } catch (error) {
    console.error("Error fetching education data:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error." });
  }
});

export default router;
