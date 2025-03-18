import express from "express";
import query from "../config/db.js"; // Correct database import
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Apply for a job (Prevent duplicate applications)
router.post("/apply-job", async (req, res) => {
  const { user_id, job_id, status } = req.body;

  if (!user_id || !job_id || !status) {
    return res
      .status(400)
      .json({ status: "error", message: "Missing required fields" });
  }

  try {
    // Check if the user has already applied for the job
    const existingApplication = await query(
      "SELECT * FROM job_applied_details WHERE user_id = ? AND job_id = ?",
      [user_id, job_id]
    );

    if (existingApplication.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "You have already applied for this job",
      });
    }

    // Insert the application if it doesn't exist
    await query(
      "INSERT INTO job_applied_details (user_id, job_id, applied_date, status) VALUES (?, ?, NOW(), ?)",
      [user_id, job_id, status]
    );

    res.json({ status: "success", message: "Job applied successfully" });
  } catch (error) {
    console.error("Error applying for job:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to apply for job" });
  }
});

// Fetch applied jobs for a specific user
router.get("/applied-jobs/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const results = await query(
      `SELECT jad.job_id AS id, jad.applied_date, jad.status, 
                jobs.title, jobs.company, jobs.location
         FROM job_applied_details jad
         JOIN jobs ON jad.job_id = jobs.id
         WHERE jad.user_id = ?`,
      [user_id]
    );

    console.log("Fetched Applied Jobs from DB:", results); // 🔍 Debugging Log

    res.json({ status: "success", appliedJobs: results });
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to fetch applied jobs" });
  }
});

// Route to fetch job applicants
router.get("/job-applications/:job_id", async (req, res) => {
  const { job_id } = req.params;

  try {
    const sql = `
      SELECT 
    ja.id AS application_id, 
    ja.user_id, 
    ay.full_name,  -- Fetch full_name from aboutyou
    u.user_email AS email,  -- Fetch email from job_seeker
    ay.profile_photo,  -- Fetch profile photo from aboutyou
    r.resume_url AS resume  -- Fetch resume from resumes table
FROM job_applied_details ja
JOIN job_seeker u ON ja.user_id = u.user_id
JOIN aboutyou ay ON ay.user_id = u.user_id  -- Join with aboutyou for full_name & profile_photo
LEFT JOIN resumes r ON r.user_id = u.user_id  -- Join with resumes to get resume URL
WHERE ja.job_id = ?;`;

    const applicants = await query(sql, [job_id]);

    return res.status(200).json({
      status: "success",
      applicants,
    });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
});

router.get("/applied-jobs", async (req, res) => {
  try {
    const results = await query(`
      SELECT jad.job_id AS id, jad.applied_date, jad.status, 
             jobs.title, jobs.company, jobs.location, 
             ay.full_name, js.user_email
      FROM job_applied_details jad
      JOIN jobs ON jad.job_id = jobs.id
      JOIN aboutyou ay ON ay.user_id = jad.user_id
      JOIN job_seeker js ON jad.user_id = js.user_id;
    `);

    console.log("Applied Jobs from DB:", results); // ✅ Debugging log

    if (results.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Job not found" });
    }

    res.json({ status: "success", appliedJobs: results });
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to fetch applied jobs" });
  }
});

export default router;
