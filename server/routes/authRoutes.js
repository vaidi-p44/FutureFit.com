// import jwt from "jsonwebtoken";
// import express from "express";
// import { body, validationResult } from "express-validator";
// import bcrypt from "bcryptjs";
// import query from "../config/db.js";
// import nodemailer from "nodemailer";
// import dotenv from "dotenv";

// dotenv.config();
// const router = express.Router();

// // Function to generate a unique email verification token
// const generateEmailVerificationToken = (email) => {
//   return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
// };

// // Function to send email verification link
// const sendEmailVerificationLink = async (email, verificationToken) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   const verificationAPI = `${process.env.BACKEND_URL}/api/auth/verify-email-click`;

//   const mailOptions = {
//     from: '"Future Fit" <your-email@example.com>',
//     to: email,
//     subject: "Email Verification",
//     html: `
//       <div style="text-align: center;">
//         <h2>Welcome to Future Fit!</h2>
//         <p>Please verify your email by clicking the button below:</p>
//         <form action="${verificationAPI}" method="POST">
//           <input type="hidden" name="token" value="${verificationToken}" />
//           <button type="submit"
//             style="padding: 12px 20px; font-size: 16px; font-weight: bold; color: white; background-color: #28a745; border: none; cursor: pointer; border-radius: 5px;">
//             ✅ Yes, I'm In
//           </button>
//         </form>
//         <p>If you didn’t request this, you can safely ignore this email.</p>
//       </div>
//     `,
//   };

//   try {
//     // Debugging logs
//     console.log("Sending email to:", email);
//     await transporter.sendMail(mailOptions);
//     console.log("Email sent successfully!");
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw new Error("Failed to send email");
//   }
// };

// // Register route to accept user data and send email verification link
// router.post(
//   "/register",
//   [
//     body("user_email").isEmail().withMessage("Invalid email format"),
//     body("password")
//       .isLength({ min: 6 })
//       .withMessage("Password must be at least 6 characters long"),
//     body("role")
//       .isIn(["employee", "job_seeker"])
//       .withMessage("Role must be either 'employee' or 'job_seeker'"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { user_email, password, role } = req.body;

//     try {
//       const sqlCheckEmail = `SELECT * FROM ${
//         role === "job_seeker" ? "job_seeker" : "employee"
//       } WHERE user_email = ?`;
//       const existingUser = await query(sqlCheckEmail, [user_email]);

//       if (existingUser.length > 0) {
//         return res
//           .status(400)
//           .json({ status: "error", message: "Email already exists" });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);
//       const emailVerificationToken = generateEmailVerificationToken(user_email);

//       try {
//         await sendEmailVerificationLink(user_email, emailVerificationToken);
//         res.status(200).json({
//           status: "pending_verification",
//           message: "Verification email sent to your email address",
//         });
//       } catch (error) {
//         console.error("Error sending verification email:", error);
//         res
//           .status(500)
//           .json({ status: "error", message: "Failed to send email" });
//       }
//     } catch (error) {
//       console.error("Registration error:", error);
//       return res
//         .status(500)
//         .json({ status: "error", message: "Internal server error" });
//     }
//   }
// );

// // Verify email route (Updated)
// router.get("/verify-email", async (req, res) => {
//   const { email } = req.query; // Ensure email is being passed correctly
//   if (!email) {
//     return res.status(400).json({ status: "error", message: "Email is required" });
//   }

//   try {
//     const decoded = jwt.verify(email, process.env.JWT_SECRET);
//     const { email } = decoded;

//     const sqlFindUser = `SELECT 'job_seeker' AS role, user_email FROM job_seeker WHERE user_email = ?
//                           UNION
//                           SELECT 'employee' AS role, user_email FROM employee WHERE user_email = ?`;
//     const results = await query(sqlFindUser, [email, email]);

//     if (results.length === 0) {
//       return res
//         .status(400)
//         .json({ status: "error", message: "User not found" });
//     }

//     const { role } = results[0];
//     const user = await query(`SELECT * FROM ${role} WHERE user_email = ?`, [
//       email,
//     ]);

//     if (user[0].isEmailVerified) {
//       return res
//         .status(200)
//         .json({ status: "success", message: "Email is already verified" });
//     }

//     // Proceed with verifying the user
//     const updateSql = `UPDATE ${role} SET isEmailVerified = true WHERE user_email = ?`;
//     await query(updateSql, [email]);

//     res
//       .status(200)
//       .json({ status: "success", message: "Email verified successfully!" });
//   } catch (error) {
//     console.error("Error verifying email:", error);
//     res.status(400).json({
//       status: "error",
//       message: "Invalid or expired verification token",
//     });
//   // }
// });

// // Resend email verification route (FIXED)
// router.post("/resend-verification", async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res
//       .status(400)
//       .json({ status: "error", message: "Email is required" });
//   }

//   try {
//     const sqlFindUser = `SELECT 'job_seeker' AS role, user_email FROM job_seeker WHERE user_email = ?
//                           UNION
//                           SELECT 'employee' AS role, user_email FROM employee WHERE user_email = ?`;
//     const results = await query(sqlFindUser, [email, email]);

//     if (results.length === 0) {
//       return res
//         .status(404)
//         .json({ status: "error", message: "User not found" });
//     }

//     const { role } = results[0];
//     const sqlCheckVerified = `SELECT isEmailVerified FROM ${role} WHERE user_email = ?`;
//     const verificationStatus = await query(sqlCheckVerified, [email]);

//     if (verificationStatus[0].isEmailVerified) {
//       return res
//         .status(400)
//         .json({ status: "error", message: "Email is already verified" });
//     }

//     // Generate a new verification token
//     const verificationToken = generateEmailVerificationToken(email);

//     // Send new verification email
//     await sendEmailVerificationLink(email, verificationToken);

//     res
//       .status(200)
//       .json({ status: "success", message: "Verification email resent" });
//   } catch (error) {
//     console.error("Error resending verification email:", error);
//     res.status(500).json({ status: "error", message: "Server error" });
//   }
// });

// export default router;
