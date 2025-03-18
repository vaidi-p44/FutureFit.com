import { useState } from "react";
import axios from "axios";
import styles from "../login/login.module.css";
import { MdOutlineMail } from "react-icons/md";
import OtpPopup from "./OtpPopup"; // Import OTP popup

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showOtpPopup, setShowOtpPopup] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8081/api/forgot-password",
        {
          email,
        }
      );

      // ✅ Store OTP token in localStorage
      if (res.data.otpToken) {
        localStorage.setItem("otpToken", res.data.otpToken);
      }

      setMessage(res.data.message);
      setShowOtpPopup(true); // Show OTP popup
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className={styles.logincontainer}>
      <h2 className={styles.form_title}>Forgot Password</h2>
      {message && <p className={styles.success}>{message}</p>}
      <form className={styles.login_form} onSubmit={handleSendOtp}>
        <div className={styles.input}>
          <input
            type="email"
            placeholder="Enter your email"
            className={styles.input_field}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
          />
          <MdOutlineMail className={styles.icon} />
        </div>
        <button className={styles.login_button}>Send OTP</button>
      </form>

      {showOtpPopup && (
        <OtpPopup email={email} onClose={() => setShowOtpPopup(false)} />
      )}
    </div>
  );
};

export default ForgotPassword;
