import express from "express";
import { OAuth2Client } from "google-auth-library";
import query from "../config/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/auth/google", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res
      .status(400)
      .json({ status: "error", message: "Token is missing" });
  }

  try {
    // Verify Google ID Token
    const ticket = await client.verifyIdToken({
      idToken: token, // ✅ Make sure this is an ID Token
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid Google token" });
    }

    const { email, name, picture } = payload;

    // Check if user exists in database
    let user = await query("SELECT * FROM job_seeker WHERE user_email = ?", [
      email,
    ]);

    if (user.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "User not registered. Please sign up first.",
      });
    }

    const userData = user[0];

    // Generate JWT Token
    const authToken = jwt.sign(
      { user_id: userData.id, email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    res.json({
      status: "success",
      user_id: userData.id,
      role: userData.role,
      token: authToken,
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(400).json({ status: "error", message: "Invalid Google token" });
  }
});

export default router;
