import express from "express";
import query from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // ✅ Load environment variables

const router = express.Router();

router.post("/login", async (req, res) => {
  const { user_email, password } = req.body;

  // ✅ Hardcoded Admin Login (For Testing)
  if (user_email === "parmarvaidehi30@gmail.com" && password === "vaidehi@44") {
    const token = jwt.sign(
      { user_id: 9999, role: "admin" },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.json({
      status: "success",
      message: "Admin login successful!",
      user_id: 9999,
      role: "admin",
      token: token,
      redirectUrl: "http://localhost:5174/Dashboard",
    });
  }

  try {
    // ✅ Check Job Seekers Table
    const sqlGetJobSeeker = "SELECT * FROM job_seeker WHERE user_email = ?";
    const jobSeekerUsers = await query(sqlGetJobSeeker, [user_email]);

    if (jobSeekerUsers.length > 0) {
      const jobSeeker = jobSeekerUsers[0];
      const match = await bcrypt.compare(password, jobSeeker.password);

      if (match) {
        const token = jwt.sign(
          { user_id: jobSeeker.user_id, role: "job_seeker" },
          process.env.JWT_SECRET || "default_secret",
          { expiresIn: "1d" }
        );

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        return res.json({
          status: "success",
          message: "Login successful!",
          user_id: jobSeeker.user_id,
          role: "job_seeker",
          token, // ✅ Include token
        });
      }
    }

    // ✅ Check Employee Table
    const sqlGetEmployee = "SELECT * FROM employee WHERE user_email = ?";
    const employeeUsers = await query(sqlGetEmployee, [user_email]);

    if (employeeUsers.length > 0) {
      const employee = employeeUsers[0];
      const match = await bcrypt.compare(password, employee.password);

      if (match) {
        const token = jwt.sign(
          { user_id: employee.user_id, role: "employee" },
          process.env.JWT_SECRET || "default_secret",
          { expiresIn: "1d" }
        );

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        return res.json({
          status: "success",
          message: "Login successful!",
          user_id: employee.user_id,
          role: "employee",
          token, // ✅ Include token
        });
      }
    }

    // ❌ Invalid Email or Password
    return res
      .status(400)
      .json({ status: "error", message: "Invalid email or password" });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ status: "error", message: "Login failed" });
  }
});

// ✅ Logout Route
router.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ status: "success", message: "Logged out successfully!" });
});

export default router;

// import express from "express";
// import query from "../config/db.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// const router = express.Router();

// router.post("/login", async (req, res) => {
//   const { user_email, password } = req.body;

//   // ✅ Hardcoded admin check
//   if (user_email === "parmarvaidehi30@gmail.com" && password === "vaidehi@44") {
//     const token = jwt.sign(
//       { user_id: 9999, role: "admin" },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     console.log("Generated Admin Token:", token); // ✅ Debug log

//     res.cookie("token", token);
//     return res.json({
//       status: "success",
//       message: "Admin login successful!",
//       user_id: 9999,
//       role: "admin",
//       token: token, // ✅ Ensure token is sent in response
//     });
//   }

//   try {
//     const sqlGetJobSeeker = "SELECT * FROM job_seeker WHERE user_email = ?";
//     const jobSeekerUsers = await query(sqlGetJobSeeker, [user_email]);

//     if (jobSeekerUsers.length > 0) {
//       const jobSeeker = jobSeekerUsers[0];
//       const match = await bcrypt.compare(password, jobSeeker.password);

//       if (match) {
//         const token = jwt.sign(
//           { user_id: jobSeeker.user_id, role: "job_seeker" },
//           process.env.JWT_SECRET,
//           { expiresIn: "1d" }
//         );
//         res.cookie("token", token);
//         return res.json({
//           status: "success",
//           message: "Login successful!",
//           user_id: jobSeeker.user_id,
//           role: "job_seeker",
//         });
//       }
//     }

//     // Check employee table
//     const sqlGetEmployee = "SELECT * FROM employee WHERE user_email = ?";
//     const employeeUsers = await query(sqlGetEmployee, [user_email]);

//     if (employeeUsers.length > 0) {
//       const employee = employeeUsers[0];
//       const match = await bcrypt.compare(password, employee.password);

//       if (match) {
//         const token = jwt.sign(
//           { user_id: employee.user_id, role: "employee" },
//           process.env.JWT_SECRET,
//           { expiresIn: "1d" }
//         );
//         res.cookie("token", token);
//         return res.json({
//           status: "success",
//           message: "Login successful!",
//           user_id: employee.user_id,
//           role: "employee",
//         });
//       }
//     }

//     res.status(400).json({ message: "Invalid email or password" });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ message: "Login failed" });
//   }
// });

// router.get("/logout", (req, res) => {
//   res.clearCookie("token", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//   }); // Clears the JWT token cookie
//   res.json({ status: "success" }); // Responds to the client confirming the logout
// });

// export default router;
