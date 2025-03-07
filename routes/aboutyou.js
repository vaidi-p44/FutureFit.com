import express from "express";
import query from "../config/db.js";
import multer from "multer";
import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 60000,
});

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Utility function to upload files to Cloudinary
const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder: "profile_photos" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });

// Save or update user profile
router.post("/Aboutyou", upload.single("profile_Photo"), async (req, res) => {
  const {
    user_id,
    full_name,
    nick_name,
    gender,
    dob,
    city,
    state,
    address,
    work_status,
    total_experience,
    current_post,
    current_salary,
  } = req.body;

  if (!user_id) {
    return res
      .status(400)
      .json({ status: "error", message: "User ID is required" });
  }

  try {
    let profile_photo = null;

    // Upload profile photo to Cloudinary if file is provided
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      profile_photo = uploadResult.secure_url;
    }

    // Check if a profile exists for the user
    const sqlCheckProfile = "SELECT * FROM aboutyou WHERE user_id = ?";
    const existingProfile = await query(sqlCheckProfile, [user_id]);

    if (existingProfile.length > 0) {
      // Update existing profile
      const sqlUpdate = `
          UPDATE aboutyou 
          SET full_name = ?, nick_name = ?, gender = ?, dob = ?, city = ?, state = ?, address = ?, 
              profile_photo = ?, work_status = ?, total_experience = ?, current_salary = ?,  current_post=?
          WHERE user_id = ?`;
      await query(sqlUpdate, [
        full_name,
        nick_name,
        gender,
        dob,
        city,
        state,
        address,
        profile_photo || existingProfile[0].profile_photo,
        work_status,
        total_experience || null,
        current_salary || null,
        current_post || null,
        user_id,
      ]);

      return res
        .status(200)
        .json({ status: "success", message: "Profile updated successfully" });
    } else {
      // Insert new profile
      const sqlInsert = `
          INSERT INTO aboutyou 
          (user_id, full_name, nick_name, gender, dob, city, state, address, profile_photo, work_status, total_experience, current_salary, current_post) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
      await query(sqlInsert, [
        user_id,
        full_name,
        nick_name,
        gender,
        dob,
        city,
        state,
        address,
        profile_photo,
        work_status,
        total_experience || null,
        current_salary || null,
        current_post || null,
      ]);

      return res
        .status(201)
        .json({ status: "success", message: "Details saved successfully" });
    }
  } catch (error) {
    console.error("Detailed error:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
});

// Get user profile by user_id
router.get("/Aboutyou/:user_id", async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res
      .status(400)
      .json({ status: "error", message: "User ID is required" });
  }

  try {
    const sql = `
      SELECT
        u.user_id,
        u.user_email,
        u.user_mobile,
        a.full_name,
        a.nick_name,
        a.gender,
        a.dob,
        a.city,
        a.state,
        a.address,
        a.profile_photo,
        a.work_status,
        a.total_experience,
        a.current_salary,
        a.current_post
      FROM job_seeker u
      LEFT JOIN aboutyou a ON u.user_id = a.user_id
      WHERE u.user_id = ?`;

    const results = await query(sql, [user_id]);

    if (results.length > 0) {
      const user = results[0];

      // Format the dob to 'yyyy-mm-dd' if it exists
      if (user.dob) {
        user.dob = new Date(user.dob).toISOString().split("T")[0];
      }

      return res.status(200).json({
        status: "success",
        data: user,
      });
    } else {
      return res
        .status(404)
        .json({ status: "error", message: "User not found." });
    }
  } catch (err) {
    console.error("Error fetching user data:", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
});

export default router;

// import express from "express";
// import query from "../config/db.js";
// import multer from "multer";
// import cloudinary from "cloudinary";
// import dotenv from "dotenv";

// dotenv.config();

// const router = express.Router();

// // Cloudinary configuration
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Multer configuration for file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Utility function to upload files to Cloudinary
// const uploadToCloudinary = (buffer) =>
//   new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.v2.uploader.upload_stream(
//       { folder: "profile_photos" },
//       (error, result) => {
//         if (error) return reject(error);
//         resolve(result);
//       }
//     );
//     uploadStream.end(buffer);
//   });

// // Save or update user profile
// router.post("/Aboutyou", upload.single("profile_Photo"), async (req, res) => {
//   const { user_id, full_name, nick_name, gender, dob, city, state, address } =
//     req.body;

//   if (!user_id) {
//     return res
//       .status(400)
//       .json({ status: "error", message: "User ID is required" });
//   }

//   try {
//     let profile_photo = null;

//     // Upload profile photo to Cloudinary if file is provided
//     if (req.file) {
//       const uploadResult = await uploadToCloudinary(req.file.buffer);
//       profile_photo = uploadResult.secure_url;
//     }

//     // Check if a profile exists for the user
//     const sqlCheckProfile = "SELECT * FROM aboutyou WHERE user_id = ?";
//     const existingProfile = await query(sqlCheckProfile, [user_id]);

//     if (existingProfile.length > 0) {
//       // Update existing profile
//       const sqlUpdate = `
//           UPDATE aboutyou
//           SET full_name = ?,nick_name=?, gender = ?, dob = ?, city = ?, state = ?, address = ?, profile_photo = ?
//           WHERE user_id = ?`;
//       await query(sqlUpdate, [
//         full_name,
//         nick_name,
//         gender,
//         dob,
//         city,
//         state,
//         address,
//         profile_photo || existingProfile[0].profile_photo,
//         user_id,
//       ]);

//       return res
//         .status(200)
//         .json({ status: "success", message: "Profile updated successfully" });
//     } else {
//       // Insert new profile
//       const sqlInsert = `
//           INSERT INTO aboutyou
//           (user_id, full_name, nick_name, gender, dob, city, state, address, profile_photo)
//           VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)`;
//       await query(sqlInsert, [
//         user_id,
//         full_name,
//         nick_name,
//         gender,
//         dob,
//         city,
//         state,
//         address,
//         profile_photo,
//       ]);

//       return res
//         .status(201)
//         .json({ status: "success", message: "Details saved successfully" });
//     }
//   } catch (error) {
//     console.error("Detailed error:", error);
//     return res.status(500).json({
//       status: "error",
//       message: error.message || "Internal server error",
//     });
//   }
// });

// // Get user profile by user_id
// router.get("/Aboutyou/:user_id", async (req, res) => {
//   const { user_id } = req.params;

//   if (!user_id) {
//     return res
//       .status(400)
//       .json({ status: "error", message: "User ID is required" });
//   }

//   try {
//     const sql = `
//       SELECT
//         u.user_id,
//         u.user_email,
//         u.user_mobile,
//         a.full_name,
//         a.nick_name,
//         a.gender,
//         a.dob,
//         a.city,
//         a.state,
//         a.address,
//         a.profile_photo
//       FROM job_seeker u
//       LEFT JOIN aboutyou a ON u.user_id = a.user_id
//       WHERE u.user_id = ?`;

//     const results = await query(sql, [user_id]);

//     if (results.length > 0) {
//       const user = results[0];

//       // Format the dob to 'yyyy-mm-dd' if it exists
//       if (user.dob) {
//         user.dob = new Date(user.dob).toISOString().split("T")[0];
//       }

//       return res.status(200).json({
//         status: "success",
//         data: user,
//       });
//     } else {
//       return res
//         .status(404)
//         .json({ status: "error", message: "User not found." });
//     }
//   } catch (err) {
//     console.error("Error fetching user data:", err);
//     return res
//       .status(500)
//       .json({ status: "error", message: "Internal server error" });
//   }
// });

// export default router;
