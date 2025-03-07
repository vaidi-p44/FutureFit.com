import express from "express";
import query from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Save or update user education
router.post("/careerpreferences", async (req, res) => {
  const { user_id, looking_for, available_time, preferred_location } = req.body;

  // Validate required fields
  if (!user_id || !looking_for || !available_time || !preferred_location) {
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

    // 5. Check if a profile exists for the user with the same education_type
    const sqlCheckProfile =
      "SELECT * FROM career_preferences WHERE user_id = ? ";
    const existingProfile = await query(sqlCheckProfile, [user_id]);

    if (existingProfile.length > 0) {
      // Update existing profile
      const sqlUpdate = `
        UPDATE career_preferences 
        SET looking_for = ?, available_time = ?,  preferred_location = ?
        WHERE user_id = ?`;
      await query(sqlUpdate, [
        looking_for,
        available_time,
        preferred_location,
        user_id,
      ]);

      return res.status(200).json({
        status: "success",
        message: "your details updated successfully.",
      });
    } else {
      // Insert new profile
      const sqlInsert = `
        INSERT INTO career_preferences
        (user_id, looking_for, available_time, preferred_location) 
        VALUES (?, ?, ?, ?)`;
      await query(sqlInsert, [
        user_id,
        looking_for,
        available_time,
        preferred_location,
      ]);

      return res.status(201).json({
        status: "success",
        message: "your details saved successfully.",
      });
    }
  } catch (error) {
    if (error.code === "ER_NO_SUCH_TABLE") {
      console.error("Table not found:", error.sqlMessage);
    } else if (error.code === "ER_BAD_FIELD_ERROR") {
      console.error("Invalid column name:", error.sqlMessage);
    } else {
      console.error("Unknown SQL error:", error.sqlMessage);
    }
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
      error: error.sqlMessage, // Add SQL message for better debugging
    });
  }
});

// Get user education by user_id
router.get("/careerpreferences/:user_id", async (req, res) => {
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
      FROM career_preferences
      WHERE user_id = ?`;

    const results = await query(sql, [user_id]);
    console.log("Career Data:", results);
    if (results.length > 0) {
      const careerData = results.map((row) => ({
        ...row,
      }));

      return res.status(200).json({
        status: "success",
        data: careerData,
      });
    } else {
      return res.status(200).json({
        status: "success",
        data: [],
        message: "No any details found.",
      });
    }
  } catch (error) {
    console.error("Error fetching career data:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error." });
  }
});

export default router;
