import jwt from "jsonwebtoken";
import express from "express";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import query from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

/**
 * @route   POST /api/forgot-password
 * @desc    Sends OTP to the user's email for password reset
 */
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists in job_seeker or employee table
    const user = await query(
      `SELECT user_email FROM job_seeker WHERE user_email = ? 
       UNION 
       SELECT user_email FROM employee WHERE user_email = ?`,
      [email, email]
    );

    if (!user.length) {
      return res.status(400).json({ message: "Email not found" });
    }

    const otp = generateOTP();
    const otpToken = jwt.sign({ email, otp }, process.env.JWT_SECRET, {
      expiresIn: "10m", // OTP expires in 10 minutes
    });

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
    });

    res.json({ message: "OTP sent to your email", otpToken });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

/**
 * @route   POST /api/verify-otp
 * @desc    Verifies OTP before allowing password reset
 */
router.post("/verify-otp", async (req, res) => {
  const { otp, otpToken } = req.body;

  try {
    if (!otpToken) {
      return res.status(400).json({ message: "OTP token is required" });
    }

    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

    if (parseInt(decoded.otp) !== parseInt(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }
});

/**
 * @route   POST /api/reset-password
 * @desc    Resets user password after OTP verification
 */
router.post("/reset-password", async (req, res) => {
  const { email, password, otpToken } = req.body;

  try {
    if (!otpToken) {
      return res.status(400).json({ message: "OTP token is required" });
    }

    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

    if (decoded.email !== email) {
      return res
        .status(400)
        .json({ message: "Invalid request. Email mismatch." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password in job_seeker and employee tables
    const jobSeekerUpdate = await query(
      `UPDATE job_seeker SET password = ? WHERE user_email = ?`,
      [hashedPassword, email]
    );

    const employeeUpdate = await query(
      `UPDATE employee SET password = ? WHERE user_email = ?`,
      [hashedPassword, email]
    );

    if (jobSeekerUpdate.affectedRows > 0 || employeeUpdate.affectedRows > 0) {
      return res.json({ message: "Password reset successfully" });
    }

    return res
      .status(400)
      .json({ message: "User not found or password not updated" });
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }
});

export default router;

// import jwt from "jsonwebtoken";
// import express from "express";
// import bcrypt from "bcryptjs";
// import nodemailer from "nodemailer";
// import query from "../config/db.js";
// import dotenv from "dotenv";

// dotenv.config();
// const router = express.Router();

// // Generate a 6-digit OTP
// const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// router.post("/forgot-password", async (req, res) => {
//   const { email } = req.body;

//   try {
//     // Check if user exists in job_seeker or employee table
//     const user = await query(
//       `SELECT 'job_seeker' as type, user_email FROM job_seeker WHERE user_email = ?
//        UNION
//        SELECT 'employee' as type, user_email FROM employee WHERE user_email = ?`,
//       [email, email]
//     );

//     if (!user.length) {
//       return res.status(400).json({ message: "Email not found" });
//     }

//     const userType = user[0].type; // Get the type of user (job_seeker or employee)
//     const otp = generateOTP();
//     const otpToken = jwt.sign(
//       { email, otp, userType },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "10m", // OTP expires in 10 minutes
//       }
//     );

//     // Send OTP via email
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Password Reset OTP",
//       text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
//     });

//     res.json({ message: "OTP sent to your email", otpToken });
//   } catch (error) {
//     console.error("Error in forgot-password:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// });

// // Verify OTP and Reset Password
// router.post("/reset-password", async (req, res) => {
//   const { otp, password, otpToken } = req.body;

//   try {
//     const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

//     if (decoded.otp !== parseInt(otp)) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     if (decoded.userType === "job_seeker") {
//       await query(`UPDATE job_seeker SET password = ? WHERE user_email = ?`, [
//         hashedPassword,
//         decoded.email,
//       ]);
//     } else {
//       await query(`UPDATE employee SET password = ? WHERE user_email = ?`, [
//         hashedPassword,
//         decoded.email,
//       ]);
//     }

//     res.json({ message: "Password reset successfully" });
//   } catch (err) {
//     console.error("Error in reset-password:", err);
//     res.status(400).json({ message: "Invalid or expired OTP" });
//   }
// });

// router.post("/verify-otp", (req, res) => {
//   const { otp, otpToken } = req.body;

//   try {
//     const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

//     if (decoded.otp !== parseInt(otp)) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     res.json({ success: true, message: "OTP verified successfully" });
//   } catch (err) {
//     res.status(400).json({ message: "Invalid or expired OTP" });
//   }
// });

// export default router;
