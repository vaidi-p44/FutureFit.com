import express from "express";
import query from "../config/db.js"; // Use `query` instead of `db`
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Define a mapping for user types to table names and columns
const tableMap = {
  job_seeker: { table: "job_seeker_feedback", column: "job_seeker_id" },
  employee: { table: "employee_feedback", column: "employee_id" },
};

// Submit Feedback - Handles both Job Seekers and Employees
router.post("/submit", async (req, res) => {
  const { userType, userId, rating, message, category } = req.body;

  if (!userType || !userId || !rating || !message || !category) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const userData = tableMap[userType];
  if (!userData) {
    return res.status(400).json({ error: "Invalid user type" });
  }

  try {
    const sql = `INSERT INTO ${userData.table} (${userData.column}, rating, message, category, status) VALUES (?, ?, ?, ?, 'pending')`;
    await query(sql, [userId, rating, message, category]);

    res.status(201).json({ message: "Feedback submitted successfully!" });
  } catch (error) {
    console.error("Error inserting feedback:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch Feedback for Admin
router.get("/all", async (req, res) => {
  try {
    // Fetch job seeker feedback with full name and email
    const [jobSeekerFeedback] = await query(`
        SELECT 
          f.id, 
          f.job_seeker_id, 
          f.rating, 
          f.message, 
          f.category, 
          f.date, 
          f.status, 
          f.response, 
          ay.full_name, 
          js.user_email
        FROM job_seeker_feedback f
        JOIN aboutyou ay ON f.job_seeker_id = ay.user_id
        JOIN job_seeker js ON f.job_seeker_id = js.user_id
      `);

    // Fetch employee feedback with full name, email, and company name
    const [employeeFeedback] = await query(`
        SELECT 
          f.id, 
          f.employee_id, 
          f.rating, 
          f.message, 
          f.category, 
          f.date, 
          f.status, 
          f.response, 
          e.user_email, 
          er.companyName
        FROM employee_feedback f
        JOIN employeeregistration er ON f.employee_id = er.user_id
        JOIN employee e ON f.employee_id = e.user_id
      `);

    console.log("Backend Response:", { jobSeekerFeedback, employeeFeedback }); // Debugging

    res.json({
      jobSeekerFeedback: jobSeekerFeedback || [],
      employeeFeedback: employeeFeedback || [],
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Mark Feedback as Resolved
router.put("/resolve/:id", async (req, res) => {
  const { id } = req.params;
  const { userType } = req.body;

  console.log("Received request to resolve:", { id, userType }); // Debug log

  if (!userType) {
    return res.status(400).json({ error: "User type is required" });
  }

  const userData = tableMap[userType];
  if (!userData) {
    return res.status(400).json({ error: "Invalid user type" });
  }

  try {
    const sql = `UPDATE ${userData.table} SET status = 'resolved' WHERE user_id = ?`;
    await query(sql, [id]);

    console.log(`Feedback ${id} resolved successfully!`); // Debug log
    res.json({ message: "Feedback marked as resolved!" });
  } catch (error) {
    console.error("Error updating feedback:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
