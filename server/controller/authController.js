const sendVerificationEmail = require("../utils/emailSender");
const jwt = require("jsonwebtoken");

// Example function to register user
const registerUser = async (req, res) => {
  try {
    const { email } = req.body;

    // Generate a token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send email verification
    await sendVerificationEmail(email, token);

    res.status(200).json({ message: "Verification email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send verification email" });
  }
};

module.exports = { registerUser };
