import express from "express";
import query from "../config/db.js";

const router = express.Router();

router.get("/candidates", async (req, res, next) => {
  try {
    const {
      jobType, // "Intern" or "Job"
      currentPost,
      experience,
      age,
      skills,
      location,
      languages,
      education,
    } = req.query;

    let sql = `
      SELECT 
          js.user_id,
          COALESCE(js.user_email, '') AS user_email,
          COALESCE(js.user_mobile, '') AS user_mobile,
          MAX(ay.full_name) AS full_name,
          MAX(ay.nick_name) AS nick_name,
          MAX(ay.gender) AS gender,
          MAX(ay.dob) AS dob,
          MAX(ay.city) AS city,
          MAX(ay.state) AS state,
          MAX(ay.address) AS address,
          MAX(ay.profile_photo) AS profile_photo,
          MAX(ay.work_status) AS work_status,
          MAX(ay.total_experience) AS total_experience,
          MAX(ay.current_salary) AS current_salary,
          MAX(ay.current_post) AS current_post,
          MAX(cp.looking_for) AS looking_for,
          MAX(cp.preferred_location) AS preferred_location,
          MAX(cp.available_time) AS available_time,
          GROUP_CONCAT(DISTINCT CASE WHEN sl.type = 'skill' THEN TRIM(sl.skill_or_language) END SEPARATOR ', ') AS skills,
         IFNULL(GROUP_CONCAT(DISTINCT CASE WHEN sl.type = 'language' THEN TRIM(sl.skill_or_language) END SEPARATOR ', '), '') AS languages,

      
          GROUP_CONCAT(
              DISTINCT CONCAT(
                  ed.education_type, ' - ', ed.course_name, ' (', ed.college_name, ', ', ed.starting_year, '-', ed.ending_year, ', ', ed.course_type, ')'
              ) ORDER BY ed.ending_year DESC SEPARATOR '|'
          ) AS education_details,
          MAX(res.resume_url) AS resume_url
      FROM job_seeker js
      LEFT JOIN aboutyou ay ON js.user_id = ay.user_id
      LEFT JOIN career_preferences cp ON js.user_id = cp.user_id
      LEFT JOIN skill_or_languages sl ON js.user_id = sl.user_id
      LEFT JOIN education ed ON js.user_id = ed.user_id
      LEFT JOIN resumes res ON js.user_id = res.user_id
      WHERE 1=1
    `;

    const queryParams = [];

    // 🔹 Apply Filters Securely
    if (jobType) {
      sql += ` AND cp.looking_for = ?`;
      queryParams.push(jobType);
    }
    if (currentPost) {
      sql += ` AND ay.current_post LIKE ?`;
      queryParams.push(`%${currentPost}%`);
    }
    if (experience) {
      sql += ` AND ay.total_experience >= ?`;
      queryParams.push(experience);
    }
    if (age) {
      sql += ` AND TIMESTAMPDIFF(YEAR, ay.dob, CURDATE()) <= ?`;
      queryParams.push(age);
    }
    if (skills) {
      sql += ` AND sl.skill_or_language LIKE ?`;
      queryParams.push(`%${skills}%`);
    }
    if (location) {
      sql += ` AND (ay.city LIKE ? OR cp.preferred_location LIKE ?)`;
      queryParams.push(`%${location}%`, `%${location}%`);
    }
    if (languages) {
      sql += ` AND sl.skill_or_language LIKE ?`;
      queryParams.push(`%${languages}%`);
    }
    if (education) {
      sql += ` AND ed.course_name LIKE ?`;
      queryParams.push(`%${education}%`);
    }

    sql += ` GROUP BY js.user_id`;

    const candidates = await query(sql, queryParams);

    // 🔹 Debugging: Log the data being fetched
    console.log("Raw Candidates Data:", candidates);

    // 🔹 Format Data for Frontend
    const formattedCandidates = candidates.map((candidate) => ({
      ...candidate,
      skills: candidate.skills
        ? candidate.skills.split(",").map((s) => s.trim())
        : [],
      languages: candidate.languages
        ? candidate.languages
            .split(",")
            .map((l) => l.trim().replace(/^"|"$/g, ""))
        : [],

      education_details: candidate.education_details
        ? candidate.education_details.split("|")
        : [],
    }));

    console.log("Formatted Candidates Data:", formattedCandidates);

    res.json({ data: formattedCandidates });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// Update Job Seeker Details
router.put("/job_seekers/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const updatedFields = req.body;

    let sql = "UPDATE job_seeker SET ";
    const queryParams = [];
    const updates = [];

    Object.entries(updatedFields).forEach(([key, value]) => {
      updates.push(`${key} = ?`);
      queryParams.push(value);
    });

    sql += updates.join(", ") + " WHERE user_id = ?";
    queryParams.push(user_id);

    await query(sql, queryParams);

    res.json({ message: "Job seeker updated successfully." });
  } catch (error) {
    console.error("Error updating job seeker:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

router.get("/candidates/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT 
          js.user_id,
          COALESCE(js.user_email, '') AS user_email,
          COALESCE(js.user_mobile, '') AS user_mobile,
          MAX(ay.full_name) AS full_name,
          MAX(ay.nick_name) AS nick_name,
          MAX(ay.gender) AS gender,
          MAX(ay.dob) AS dob,
          MAX(ay.city) AS city,
          MAX(ay.state) AS state,
          MAX(ay.address) AS address,
          MAX(ay.profile_photo) AS profile_photo,
          MAX(ay.work_status) AS work_status,
          MAX(ay.total_experience) AS total_experience,
          MAX(ay.current_salary) AS current_salary,
          MAX(ay.current_post) AS current_post,
          MAX(cp.looking_for) AS looking_for,
          MAX(cp.preferred_location) AS preferred_location,
          MAX(cp.available_time) AS available_time,
          IFNULL(GROUP_CONCAT(DISTINCT CASE WHEN sl.type = 'skill' THEN TRIM(sl.skill_or_language) END SEPARATOR ', '), '') AS skills,
          IFNULL(GROUP_CONCAT(DISTINCT CASE WHEN sl.type = 'language' THEN TRIM(sl.skill_or_language) END SEPARATOR ', '), '') AS languages,
          IFNULL(
              GROUP_CONCAT(
                  DISTINCT CONCAT(
                      ed.education_type, ' - ', ed.course_name, ' (', ed.college_name, ', ', ed.starting_year, '-', ed.ending_year, ', ', ed.course_type, ')'
                  ) ORDER BY ed.ending_year DESC SEPARATOR '|'
              ), ''
          ) AS education_details,
          MAX(res.resume_url) AS resume_url
      FROM job_seeker js
      LEFT JOIN aboutyou ay ON js.user_id = ay.user_id
      LEFT JOIN career_preferences cp ON js.user_id = cp.user_id
      LEFT JOIN skill_or_languages sl ON js.user_id = sl.user_id
      LEFT JOIN education ed ON js.user_id = ed.user_id
      LEFT JOIN resumes res ON js.user_id = res.user_id
      WHERE js.user_id = ?
      GROUP BY js.user_id
    `;

    const candidates = await query(sql, [id]);

    if (candidates.length === 0) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const candidate = candidates[0];

    const formattedCandidate = {
      ...candidate,
      skills: Array.isArray(candidate.skills)
        ? candidate.skills
        : candidate.skills && candidate.skills.trim().length > 0
        ? candidate.skills.split(",").map((s) => s.trim())
        : [],

      languages:
        candidate.languages && candidate.languages.trim().length > 0
          ? candidate.languages.split(",").map((l) => l.trim())
          : [],
      education_details:
        candidate.education_details &&
        candidate.education_details.trim().length > 0
          ? candidate.education_details.split("|")
          : [],
      total_experience: candidate.total_experience || "N/A",
      resume_url: candidate.resume_url || null,
    };

    res.json({ data: formattedCandidate });
  } catch (error) {
    console.error("Error fetching candidate:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

export default router;
