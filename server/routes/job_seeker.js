// import express from "express";

// import query from "../config/db.js";

// const router = express.Router();

// router.get("/api/job_seekers", async (req, res) => {
//   try {
//     const jobSeekers = await query("SELECT * FROM job_seeker");
//     console.log("Fetched job seekers:", jobSeekers);
//     res.json(jobSeekers);
//   } catch (error) {
//     console.error("Error fetching job seekers:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// router.put("/api/job_seekers/:id", async (req, res) => {
//   const { id } = req.params;
//   const { user_email, user_mobile } = req.body;
//   const isEmailVerified = req.body.isEmailVerified === "Yes" ? 1 : 0; // Convert "Yes" -> 1, "No" -> 0

//   try {
//     const result = await query(
//       "UPDATE job_seeker SET user_email = ?, user_mobile = ?, isEmailVerified = ? WHERE user_id = ?",
//       [user_email, user_mobile, isEmailVerified, id]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: "Job seeker not found" });
//     }

//     res.json({ message: "Job seeker updated successfully" });
//   } catch (error) {
//     console.error("Error updating job seeker:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// export default router;
