import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Send Job Offer Request
router.post("/send-job-offer", async (req, res) => {
  const {
    candidateEmail,
    employerEmail,
    employerName,
    jobTitle,
    jobDescription,
  } = req.body;

  if (!candidateEmail || !employerEmail || !jobTitle || !jobDescription) {
    return res.status(400).json({ message: "Missing required details" });
  }

  // Create transporter using existing email credentials
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email content
  const mailOptions = {
    from: employerEmail,
    to: candidateEmail,
    subject: `Job Offer: ${jobTitle}`,
    html: `
      <h3>Hello,</h3>
      <p><b>${employerName}</b> has sent you a job offer.</p>
      <h4>Job Title: ${jobTitle}</h4>
      <p>${jobDescription}</p>
      <br/>
      <p>If you are interested, please reply to this email.</p>
      <br/>
      <p>Best regards,</p>
      <p>${employerName}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Job offer email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send job offer email" });
  }
});

export default router;
