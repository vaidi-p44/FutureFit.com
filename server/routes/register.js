import jwt from "jsonwebtoken";
import express from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import query from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// ✅ Email Transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Register User (Send OTP Before Storing)
// ✅ Register User (Send OTP Before Storing)
router.post(
  "/register",
  [
    body("user_email").isEmail().withMessage("Invalid email format"),
    body("user_mobile").isMobilePhone().withMessage("Invalid mobile number"),
    body("role")
      .isIn(["employee", "job_seeker"])
      .withMessage("Role must be either 'employee' or 'job_seeker'"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { user_email, user_mobile, password, role } = req.body;

    try {
      const table = role === "job_seeker" ? "job_seeker" : "employee";
      const otpTable =
        role === "job_seeker"
          ? "job_seeker_email_verifications"
          : "employee_email_verifications";

      // ✅ Check if user already exists
      const existingUser = await query(
        `SELECT user_id FROM ${table} WHERE user_email = ?`,
        [user_email]
      );

      if (existingUser.length > 0) {
        return res
          .status(400)
          .json({ status: "error", message: "Email already exists" });
      }

      let userId;
      if (existingUser.length > 0) {
        userId = existingUser[0].user_id; // ✅ Use existing user ID
      } else {
        // ✅ Insert the user first
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await query(
          `INSERT INTO ${table} (user_email, user_mobile, password, is_verified) VALUES (?, ?, ?, false)`,
          [user_email, user_mobile, hashedPassword, role]
        );
        userId = result.insertId;
      }

      if (!userId) {
        return res
          .status(500)
          .json({ status: "error", message: "Failed to create user." });
      }

      // ✅ Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000);

      // ✅ Store OTP in the database with expiration
      await query(
        `INSERT INTO ${otpTable} (user_email, otp, expires_at) 
     VALUES (?, ?, NOW() + INTERVAL 5 MINUTE) 
     ON DUPLICATE KEY UPDATE otp = ?, expires_at = NOW() + INTERVAL 5 MINUTE`,
        [user_email, otp, otp]
      );

      // ✅ Send OTP Email
      await transporter.sendMail({
        from: `"Future Fit" <${process.env.EMAIL_USER}>"`,
        to: user_email,
        subject: "Email Verification OTP",
        html: `<p>Your OTP for email verification is: <strong></bold><h1>${otp}</h1></bold></strong></p>`,
      });

      return res.status(200).json({
        status: "success",
        message: "OTP sent to email. Please verify to continue.",
        user_id: userId,
      });
    } catch (error) {
      console.error("OTP Send Error:", error);
      return res
        .status(500)
        .json({ status: "error", message: "Failed to send OTP." });
    }
  }
);

// ✅ Verify OTP and Register User
router.post("/verify-otp", async (req, res) => {
  const { user_email, otp, role } = req.body;

  if (!user_email || !otp || !role) {
    return res.status(400).json({
      status: "error",
      message: "Missing required fields (email, OTP, or role).",
    });
  }

  try {
    const table = role === "job_seeker" ? "job_seeker" : "employee";
    const otpTable =
      role === "job_seeker"
        ? "job_seeker_email_verifications"
        : "employee_email_verifications";

    // ✅ Check if OTP matches and hasn't expired
    const otpCheck = await query(
      `SELECT * FROM ${otpTable} WHERE user_email = ? AND otp = ? AND expires_at > NOW()`,
      [user_email, otp]
    );

    if (otpCheck.length === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid or expired OTP." });
    }

    // ✅ Check if user exists before updating
    const userCheck = await query(
      `SELECT * FROM ${table} WHERE user_email = ?`,
      [user_email]
    );
    if (userCheck.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "User not found. Please register again.",
      });
    }

    const userId = userCheck[0].user_id; // ✅ Extract user_id

    // ✅ Update user verification status
    await query(`UPDATE ${table} SET is_verified = true WHERE user_email = ?`, [
      user_email,
    ]);

    const token = jwt.sign({ user_email, role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // ✅ Delete OTP after successful verification
    await query(`DELETE FROM ${otpTable} WHERE user_email = ?`, [user_email]);

    return res.status(200).json({
      status: "success",
      message: "Email verified and account updated successfully.",
      token,
      user_id: userId, // ✅ Return user_id
      isEmailVerified: true,
    });
  } catch (error) {
    console.error("Verification error:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
});

router.post("/resend-otp", async (req, res) => {
  const { user_email, role } = req.body;

  if (!user_email || !role) {
    return res.status(400).json({
      status: "error",
      message: "Missing required fields (email or role).",
    });
  }

  try {
    const table = role === "job_seeker" ? "job_seeker" : "employee";
    const otpTable =
      role === "job_seeker"
        ? "job_seeker_email_verifications"
        : "employee_email_verifications";

    // ✅ Check if the user exists
    const userCheck = await query(
      `SELECT * FROM ${table} WHERE user_email = ?`,
      [user_email]
    );
    if (userCheck.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "User not found. Please register first.",
      });
    }

    // ✅ Generate a new 6-digit OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000);

    // ✅ Store new OTP in the database with expiration
    await query(
      `INSERT INTO ${otpTable} (user_email, otp, expires_at) 
       VALUES (?, ?, NOW() + INTERVAL 5 MINUTE) 
       ON DUPLICATE KEY UPDATE otp = ?, expires_at = NOW() + INTERVAL 5 MINUTE`,
      [user_email, newOtp, newOtp]
    );

    // ✅ Send OTP Email
    await transporter.sendMail({
      from: `"Future Fit" <${process.env.EMAIL_USER}>`,
      to: user_email,
      subject: "Resend OTP - Email Verification",
      html: `<p>Your new OTP for email verification is: <strong><h1>${newOtp}</h1></strong></p>`,
    });

    return res.status(200).json({
      status: "success",
      message: "New OTP sent to email. Please verify to continue.",
    });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to resend OTP." });
  }
});

// ✅ Get All Job Seekers
router.get("/api/job_seekers", async (req, res) => {
  try {
    const jobSeekers = await query("SELECT * FROM job_seeker");
    res.json(jobSeekers);
  } catch (error) {
    console.error("Error fetching job seekers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Update Job Seeker
router.put("/api/job_seekers/:id", async (req, res) => {
  const { id } = req.params;
  const { user_email, user_mobile, is_verified } = req.body;

  try {
    const result = await query(
      "UPDATE job_seeker SET user_email = ?, user_mobile = ?, is_verified = ? WHERE user_id = ?",
      [user_email, user_mobile, is_verified ? 1 : 0, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Job seeker not found" });
    }

    res.json({ message: "Job seeker updated successfully" });
  } catch (error) {
    console.error("Error updating job seeker:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get All Employees
router.get("/api/employee", async (req, res) => {
  try {
    const employees = await query("SELECT * FROM employee");
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Update Employee
router.put("/api/employee/:id", async (req, res) => {
  const { id } = req.params;
  const { user_email, user_mobile, is_verified } = req.body;

  try {
    const result = await query(
      "UPDATE employee SET user_email = ?, user_mobile = ?, is_verified = ? WHERE user_id = ?",
      [user_email, user_mobile, is_verified ? 1 : 0, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ message: "Employee updated successfully" });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;

// import jwt from "jsonwebtoken";
// import express from "express";
// import { body, validationResult } from "express-validator";
// import bcrypt from "bcryptjs";
// import query from "../config/db.js";

// const router = express.Router();

// router.post(
//   "/register",
//   [
//     body("user_email").isEmail().withMessage("Invalid email format"),
//     body("user_mobile").isMobilePhone().withMessage("Invalid mobile number"),
//     body("password")
//       .isLength({ min: 6 })
//       .withMessage("Password must be at least 6 characters long"),
//     body("role")
//       .isIn(["employee", "job_seeker"])
//       .withMessage("Role must be either 'employee' or 'job_seeker'"),
//   ],
//   async (req, res) => {
//     // Validate inputs
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { user_email, user_mobile, password, role } = req.body;

//     try {
//       // Check if email already exists
//       const sqlCheckEmail = `SELECT * FROM ${
//         role === "job_seeker" ? "job_seeker" : "employee"
//       } WHERE user_email = ?`;
//       const existingUser = await query(sqlCheckEmail, [user_email]);

//       if (existingUser.length > 0) {
//         return res
//           .status(400)
//           .json({ status: "error", message: "Email already exists" });
//       }

//       // Hash the password
//       const hashedPassword = await bcrypt.hash(password, 10);

//       // Insert the new user into the database
//       const sqlInsert = `INSERT INTO ${
//         role === "job_seeker" ? "job_seeker" : "employee"
//       } (user_email, user_mobile, password) VALUES (?, ?, ?)`;
//       const result = await query(sqlInsert, [
//         user_email,
//         user_mobile,
//         hashedPassword,
//         role,
//       ]);

//       const userId = result.insertId; // Get the newly created user_id

//       // Generate a JWT token
//       const token = jwt.sign(
//         { user_id: userId }, // Payload
//         process.env.JWT_SECRET, // Secret key
//         { expiresIn: "1h" } // Token expiration
//       );

//       // Respond with success and the token
//       return res.status(200).json({
//         status: "success",
//         message: "Registration successful",
//         user_id: userId,
//         token, // Include the token in the response
//       });
//     } catch (error) {
//       console.error("Registration error:", error);
//       return res
//         .status(500)
//         .json({ status: "error", message: "Internal server error" });
//     }
//   }
// );

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

// router.get("/api/employee", async (req, res) => {
//   try {
//     const jobSeekers = await query("SELECT * FROM employee");
//     console.log("Fetched employee:", jobSeekers);
//     res.json(jobSeekers);
//   } catch (error) {
//     console.error("Error fetching employee:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// router.put("/api/employee/:id", async (req, res) => {
//   const { id } = req.params;
//   const { user_email, user_mobile } = req.body;
//   const isEmailVerified = req.body.isEmailVerified === "Yes" ? 1 : 0; // Convert "Yes" -> 1, "No" -> 0

//   try {
//     const result = await query(
//       "UPDATE employee SET user_email = ?, user_mobile = ?, isEmailVerified = ? WHERE user_id = ?",
//       [user_email, user_mobile, isEmailVerified, id]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: "employee not found" });
//     }

//     res.json({ message: "employee updated successfully" });
//   } catch (error) {
//     console.error("Error updating employee:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// export default router;
