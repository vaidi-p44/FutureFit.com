import { useState } from "react";
import axios from "axios";
import styles from "./OtpPopup.module.css";
import ResetPassword from "../ResetPassword/ResetPassword"; // Import ResetPassword page
import { toast } from "react-toastify";

const OtpPopup = ({ email, onClose }) => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const otpToken = localStorage.getItem("otpToken"); // Retrieve stored token

  const handleVerifyOtp = async (e) => {
    e.preventDefault(); // Prevent form from reloading
    try {
      const response = await axios.post(
        "http://localhost:8081/api/verify-otp",
        {
          otp, // ✅ Use `otp` state
          otpToken, // ✅ Send OTP token for verification
        }
      );

      if (response.data.message === "OTP verified successfully") {
        toast.success("OTP Verified!");
        setIsVerified(true); // ✅ Set state to show ResetPassword page
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed.");
    }
  };

  return (
    <div className={styles.popup_container}>
      <div className={styles.popup}>
        <h2>Verify OTP</h2>
        {message && <p className={styles.success}>{message}</p>}

        {!isVerified ? (
          <form onSubmit={handleVerifyOtp}>
            <input
              type="text"
              placeholder="Enter OTP"
              className={styles.input_field}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button className={styles.login_button}>Verify OTP</button>
          </form>
        ) : (
          <ResetPassword email={email} /> // ✅ Show ResetPassword component after verification
        )}
      </div>
    </div>
  );
};

export default OtpPopup;
