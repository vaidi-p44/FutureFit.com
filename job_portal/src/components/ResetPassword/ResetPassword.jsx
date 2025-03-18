import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "../login/login.module.css";
import { LuLock } from "react-icons/lu";

const ResetPassword = ({ email }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const otpToken = localStorage.getItem("otpToken"); // ✅ Retrieve OTP token

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const otpToken = localStorage.getItem("otpToken"); // Get token from localStorage

    if (!otpToken) {
      toast.error("OTP token is missing. Please verify OTP again.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8081/api/reset-password",
        {
          email,
          password,
          otpToken, // ✅ Send OTP token for verification
        }
      );

      toast.success(response.data.message);
      setTimeout(() => navigate("/"), 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed.");
    }
  };

  return (
    <div className={styles.logincontainer}>
      <h2 className={styles.form_title}>Reset Password</h2>
      <form className={styles.login_form} onSubmit={handleResetPassword}>
        <div className={styles.input}>
          <input
            type="password"
            placeholder="Enter new password"
            className={styles.input_field}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <LuLock className={styles.icon} />
        </div>
        <div className={styles.input}>
          <input
            type="password"
            placeholder="Confirm new password"
            className={styles.input_field}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <LuLock className={styles.icon} />
        </div>
        <button className={styles.login_button}>Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
