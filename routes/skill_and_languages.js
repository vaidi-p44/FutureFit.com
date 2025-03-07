import express from "express";
import query from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Save or update user skills
router.post("/skill_or_languages", async (req, res) => {
  console.log("Received request:", req.body);
  const { user_id, skill_or_language, type } = req.body;

  if (!user_id || !skill_or_language || !type) {
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

    console.log("User found, proceeding to save skills...");
    const skillsString = JSON.stringify(
      Array.isArray(skill_or_language) ? skill_or_language : [skill_or_language]
    );
    const sqlCheckProfile =
      "SELECT * FROM skill_or_languages WHERE user_id = ? AND type = ?";
    const existingProfile = await query(sqlCheckProfile, [user_id, type]);
    if (existingProfile.length > 0) {
      console.log("Updating existing skills...");
      const sqlUpdate = `UPDATE skill_or_languages 
                         SET skill_or_language=?, type=? 
                         WHERE user_id = ? AND type = ?`;
      await query(sqlUpdate, [skillsString, type, user_id, type]);

      return res
        .status(200)
        .json({ status: "success", message: "Skills updated successfully." });
    } else {
      // No need for separate handling for "skill" or "language", directly insert
      console.log("Inserting new skills or languages...");
      const sqlInsert = `
        INSERT INTO skill_or_languages 
        (user_id, skill_or_language, type) 
        VALUES (?, ?, ?)`;
      await query(sqlInsert, [user_id, skillsString, type]);

      return res
        .status(201)
        .json({ status: "success", message: "Data saved successfully." });
    }
  } catch (error) {
    console.error("Error saving skills:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error." });
  }
});

// Get user skills by user_id
router.get("/skill_or_languages/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const { type } = req.query; // Get `type` from query parameters

  if (!user_id || !type) {
    return res
      .status(400)
      .json({ status: "error", message: "User ID and type are required." });
  }

  try {
    const sql =
      "SELECT * FROM skill_or_languages WHERE user_id = ? AND type = ?";
    const results = await query(sql, [user_id, type]);

    if (results.length > 0) {
      return res.status(200).json({
        status: "success",
        message: `${type} fetched successfully.`,
        data: results.map((row) => ({
          ...row,
          skill_or_language: JSON.parse(row.skill_or_language || "[]"),
        })),
      });
    } else {
      return res.status(200).json({
        status: "success",
        message: `No ${type} found.`,
        data: [],
      });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error." });
  }
});

export default router;

// import express from "express";
// import query from "../config/db.js";
// import dotenv from "dotenv";

// dotenv.config();

// const router = express.Router();

// // Save or update user skills
// router.post("/skill_or_languages", async (req, res) => {
//   console.log("Received request:", req.body);
//   const { user_id, skill_or_language, type } = req.body;

//   if (!user_id || !skill_or_language || !type) {
//     return res
//       .status(400)
//       .json({ status: "error", message: "Required fields are missing." });
//   }

//   try {
//     // 1. Verify if user_id exists
//     const sqlCheckUser = "SELECT * FROM job_seeker WHERE user_id = ?";
//     const userExists = await query(sqlCheckUser, [user_id]);

//     if (userExists.length === 0) {
//       return res
//         .status(404)
//         .json({ status: "error", message: "Invalid user ID." });
//     }

//     console.log("User found, proceeding to save skills...");
//     const skillsString = JSON.stringify(
//       Array.isArray(skill_or_language) ? skill_or_language : [skill_or_language]
//     );
//     const sqlCheckProfile =
//       "SELECT * FROM skill_or_languages WHERE user_id = ? AND type = ?";
//     const existingProfile = await query(sqlCheckProfile, [user_id, type]);
//     if (existingProfile.length > 0) {
//       console.log("Updating existing skills...");
//       const sqlUpdate = `
//       UPDATE skill_or_languages
//       SET skill_or_language=?, type=?
//       WHERE user_id = ? AND type = ? `;
//       await query(sqlUpdate, [skillsString, type, user_id, type]);

//       return res
//         .status(200)
//         .json({ status: "success", message: "Skills updated successfully." });
//     } else {
//       if (type === "skill") {
//         // Handle saving skills
//         console.log("Inserting new skills...");
//         await saveToSkillsCollection(user_id, skill_or_language);
//       } else if (type === "language") {
//         // Handle saving languages
//         console.log("Inserting new languages...");
//         await saveToLanguagesCollection(user_id, skill_or_language);
//       } else {
//         return res.status(400).json({ message: "Invalid type provided" });
//       }
//       const sqlInsert = `
//         INSERT INTO skill_or_languages
//         (user_id, skill_or_language, type)
//         VALUES (?, ?, ?)`;
//       await query(sqlInsert, [user_id, skillsString, type]);

//       return res
//         .status(201)
//         .json({ status: "success", message: "data saved successfully." });
//     }
//   } catch (error) {
//     console.error("Error saving skills:", error);
//     return res
//       .status(500)
//       .json({ status: "error", message: "Internal server error." });
//   }
// });
// // Get user skills by user_id
// router.get("/skill_or_languages/:user_id", async (req, res) => {
//   const { user_id } = req.params;
//   const { type } = req.query; // Get `type` from query parameters

//   if (!user_id || !type) {
//     return res
//       .status(400)
//       .json({ status: "error", message: "User ID and type are required." });
//   }

//   try {
//     const sql =
//       "SELECT * FROM skill_or_languages WHERE user_id = ? AND type = ?";
//     const results = await query(sql, [user_id, type]);

//     if (results.length > 0) {
//       return res.status(200).json({
//         status: "success",
//         message: `${type} fetched successfully.`,
//         data: results.map((row) => ({
//           ...row,
//           skill_or_language: JSON.parse(row.skill_or_language || "[]"),
//         })),
//       });
//     } else {
//       return res.status(200).json({
//         status: "success",
//         message: `No ${type} found.`,
//         data: [],
//       });
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return res
//       .status(500)
//       .json({ status: "error", message: "Internal server error." });
//   }
// });

// // router.get("/skill_or_languages/:user_id", async (req, res) => {
// //   const { user_id } = req.params;

// //   if (!user_id) {
// //     return res
// //       .status(400)
// //       .json({ status: "error", message: "User ID is required." });
// //   }

// //   try {
// //     const sql = "SELECT * FROM skill_or_languages WHERE user_id = ?";
// //     const results = await query(sql, [user_id]);

// //     if (results.length > 0) {
// //       const langData = results.map((row) => {
// //         let parsedlang = [];
// //         try {
// //           // Attempt to parse the stringified JSON back into an array
// //           parsedSkills = JSON.parse(row.skill_or_language);
// //         } catch (error) {
// //           console.error(
// //             "Invalid JSON in skill_or_language:",
// //             row.skill_or_language
// //           );
// //         }
// //         return {
// //           ...row,
// //           skill_or_language: parsedlang,
// //         };
// //       });

// //       return res.status(200).json({
// //         status: "success",
// //         message: "Skills fetched successfully.",
// //         data: skillData,
// //       });
// //     } else {
// //       return res.status(200).json({
// //         status: "success",
// //         message: "No skills found.",
// //         data: [],
// //       });
// //     }
// //   } catch (error) {
// //     console.error("Error fetching skills:", error.message || error);
// //     return res
// //       .status(500)
// //       .json({ status: "error", message: "Internal server error." });
// //   }
// // });

// export default router;
