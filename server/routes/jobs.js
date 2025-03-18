import express from "express";
import query from "../config/db.js";
import multer from "multer";
import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Route to post a new job (enforcing plan-based restrictions)
router.post("/jobs", async (req, res) => {
  const validPlans = {
    standard: 15,
    classified: 30,
    "hot vacancy": 30,
  };

  const {
    user_id,
    title,
    company,
    location,
    type,
    category,
    experience,
    salary,
    description,
    requirements,
    status,
    benefits,
    plan_type,
  } = req.body;

  if (!user_id) {
    return res.status(400).json({
      status: "error",
      message: "User ID is required",
    });
  }

  const formattedPlanType = plan_type ? plan_type.trim().toLowerCase() : null;

  if (!formattedPlanType || !validPlans[formattedPlanType]) {
    return res.status(400).json({
      status: "error",
      message: "Invalid or missing plan type",
    });
  }

  try {
    const checkPlanSql = `
    SELECT p.id, p.plan_type, p.expires_at 
    FROM job_posting_plans p
    WHERE p.employee_id = ? 
    AND p.status = 'success' 
    AND p.expires_at > NOW() 
    AND NOT EXISTS (
        SELECT 1 FROM jobs j WHERE j.job_posting_plan_id = p.id
    )
    ORDER BY p.expires_at ASC
    LIMIT 1

    `;

    // ✅ Added missing `user_id` parameter
    query(
      checkPlanSql,
      [user_id, formattedPlanType, user_id, user_id],
      (err, results) => {
        if (err) {
          console.error("Database error (plan check):", err);
          return res.status(500).json({
            status: "error",
            message: "Database error while checking plan",
          });
        }

        if (results.length === 0) {
          return res.status(400).json({
            status: "error",
            message: "No available plan. Please purchase a new plan.",
          });
        }

        const planId = results[0].id;
        const expires_at = new Date();
        expires_at.setDate(
          expires_at.getDate() + validPlans[formattedPlanType]
        );

        const insertJobSql = `
  INSERT INTO jobs 
    (user_id, title, company, location, type, category, experience, salary, description, requirements, benefits, status, created_at, job_posting_plan_id) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
`;

        query(
          insertJobSql,
          [
            user_id,
            title,
            company,
            location,
            type,
            category,
            experience,
            salary,
            description,
            requirements,
            benefits,
            status || "active",
            planId,
          ],
          (err) => {
            if (err) {
              console.error("Database error (insert job):", err);
              return res.status(500).json({
                status: "error",
                message: "Database error while posting job",
              });
            }

            return res.status(201).json({
              status: "success",
              message: "Job posted successfully",
            });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error posting job:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

router.get("/check-posted-jobs", (req, res) => {
  const { employee_id } = req.query;

  if (!employee_id) {
    return res.status(400).json({
      status: "error",
      message: "Missing employee ID",
    });
  }

  const checkPlanSql = `
    SELECT p.id, p.plan_type, p.expires_at 
    FROM job_posting_plans p
    WHERE p.employee_id = ? 
    AND p.status = 'success' 
    AND p.expires_at > NOW() 
    AND NOT EXISTS (
        SELECT 1 FROM jobs j WHERE j.job_posting_plan_id = p.id
    )
    ORDER BY p.expires_at ASC
    LIMIT 1
  `;

  query(checkPlanSql, [employee_id], (err, results) => {
    if (err) {
      console.error("Database error (check available plan):", err);
      return res.status(500).json({
        status: "error",
        message: "Database error while checking plan",
      });
    }

    if (results.length > 0) {
      return res.json({
        status: "success",
        message: "You have an available plan to post a job.",
        plan: results[0],
      });
    } else {
      return res.json({
        status: "error",
        message: "No available plan. Please purchase a new plan.",
      });
    }
  });
});

// Route to post a new job (including job image)
// router.post("/jobs", async (req, res) => {
//   const {
//     user_id, // Added user_id from the request body
//     title,
//     company,
//     location,
//     type,
//     category,
//     experience,
//     salary,
//     description,
//     requirements,
//     status,
//     benefits,
//   } = req.body;

//   if (!user_id) {
//     return res.status(400).json({
//       status: "error",
//       message: "User ID is required",
//     });
//   }

//   try {
//     // Insert job data into the database, now including user_id
//     const sql = `
//       INSERT INTO jobs
//        (user_id, title, company, location, type, category, experience, salary, description, requirements, benefits, status)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//     await query(sql, [
//       user_id, // Add user_id as part of the insert
//       title,
//       company,
//       location,
//       type,
//       category,
//       experience,
//       salary,
//       description,
//       requirements,
//       benefits,
//       status || "active", // Default to 'active'
//     ]);

//     return res.status(201).json({
//       status: "success",
//       message: "Job posted successfully",
//     });
//   } catch (error) {
//     console.error("Error posting job:", error);
//     return res.status(500).json({
//       status: "error",
//       message: error.message || "Internal server error",
//     });
//   }
// });

// Route to fetch all jobs
router.get("/jobs", async (req, res) => {
  try {
    const sql = "SELECT * FROM jobs WHERE status != 'closed'";
    const jobs = await query(sql);

    return res.status(200).json({
      status: "success",
      jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
});

router.get("/alljobs", async (req, res) => {
  try {
    const sql = `
      SELECT j.*, e.companyName 
      FROM jobs j
      LEFT JOIN EmployeeRegistration e ON j.user_id = e.user_id
    `;

    const jobs = await query(sql);
    res.status(200).json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res
      .status(500)
      .json({ status: "error", message: "Internal server error." });
  }
});

// ✅ Route to fetch a single job by ID
router.get("/jobs/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const sql = "SELECT * FROM jobs WHERE id = ?";
    const job = await query(sql, [id]);

    if (job.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Job not found",
      });
    }

    return res.status(200).json({
      status: "success",
      job: job[0],
    });
  } catch (error) {
    console.error("Error fetching job:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

// ✅ Route to update a job by ID
router.put("/jobs/:id", async (req, res) => {
  const { id } = req.params;
  const {
    title,
    company,
    location,
    type,
    category,
    experience,
    salary,
    description,
    requirements,
    benefits,
    status,
  } = req.body;

  try {
    // Check if job exists
    const checkSql = "SELECT * FROM jobs WHERE id = ?";
    const jobExists = await query(checkSql, [id]);

    if (jobExists.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Job not found",
      });
    }

    const updateSql = `
      UPDATE jobs 
      SET title = ?, company = ?, location = ?, type = ?, category = ?, 
          experience = ?, salary = ?, description = ?, requirements = ?, benefits = ?, status = ?
      WHERE id = ?`;

    await query(updateSql, [
      title,
      company,
      location,
      type,
      category,
      experience,
      salary,
      description,
      requirements,
      benefits,
      status,
      id,
    ]);

    return res.status(200).json({
      status: "success",
      message: "Job updated successfully",
    });
  } catch (error) {
    console.error("Error updating job:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

// ✅ Route to delete a job by ID
router.delete("/jobs/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Check if job exists
    const checkSql = "SELECT * FROM jobs WHERE id = ?";
    const jobExists = await query(checkSql, [id]);

    if (jobExists.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Job not found",
      });
    }

    const deleteSql = "DELETE FROM jobs WHERE id = ?";
    await query(deleteSql, [id]);

    return res.status(200).json({
      status: "success",
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

// ✅ Route to fetch jobs by user_id

router.get("/jobs/user/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const jobsSql = `
      SELECT j.*, 
      (SELECT COUNT(*) FROM job_applied_details ja WHERE ja.job_id = j.id) AS responses
      FROM jobs j
      WHERE j.user_id = ?`;

    const jobs = await query(jobsSql, [user_id]);

    return res.status(200).json({
      status: "success",
      jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

router.get("/jobs", async (req, res) => {
  try {
    const jobsSql = "SELECT * FROM jobs";
    const jobs = await query(jobsSql);

    // Fetch applied candidates for each job
    for (const job of jobs) {
      const applicationsSql = `
        SELECT ja.id AS application_id, ja.user_id, u.full_name, u.email, u.profile_photo, ja.resume
        FROM job_applications ja
        JOIN users u ON ja.user_id = u.id
        WHERE ja.job_id = ?`;

      const candidates = await query(applicationsSql, [job.id]);
      job.applied_candidates = candidates;
    }

    return res.status(200).json({
      status: "success",
      jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
});

export default router;
