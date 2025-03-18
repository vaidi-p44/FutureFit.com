import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Otp.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Otp = ({ userEmail, onClose }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (!canResend) {
      timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setCanResend(true);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [canResend]);

  const handleChange = (index, event) => {
    const value = event.target.value;
    if (!isNaN(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-input${index + 2}`).focus();
        // if (nextInput) {
        //   nextInput.focus();
        // }
      }
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      const response = await axios.post("http://localhost:8081/resend-otp", {
        user_email: userEmail, // Ensure email is passed correctly
        role: localStorage.getItem("role"), // Get role from localStorage
      });

      if (response.data.status === "success") {
        toast.success("A new OTP has been sent to your email.");
      } else {
        toast.error(response.data.message || "Failed to resend OTP.");
      }
    } catch (error) {
      console.error("Resend OTP error:", error.response?.data || error.message);
      toast.error("Error resending OTP. Please try again.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8081/verify-otp", {
        user_email: userEmail, // ✅ Ensure this is passed correctly
        otp: enteredOtp, // ✅ Fix typo from `otpCode` to `enteredOtp`
        role: localStorage.getItem("role"), // Get role from localStorage
      });

      if (response.data.status === "success") {
        toast.success("OTP Verified! Registration successful.");

        localStorage.setItem("isEmailVerified", "true");

        setTimeout(() => {
          navigate(
            localStorage.getItem("role") === "job_seeker"
              ? "/Aboutyou"
              : "/EmployeeRegistration"
          );
          window.location.reload();
        }, 2000);
      } else {
        toast.error(response.data.message || "OTP verification failed.");
      }
    } catch (error) {
      console.error(
        "OTP verification error:",
        error.response?.data || error.message
      );
      toast.error("Invalid or expired OTP. Try again.");
    }
  };

  return (
    <>
      <div className={styles.otpPopup} onClick={(e) => e.stopPropagation()}>
        <form className={styles.otpForm} onSubmit={handleSubmit}>
          <ToastContainer />
          <span className={styles.mainHeading}>Enter OTP</span>
          <div className={styles.inputContainer}>
            {otp.map((value, index) => (
              <input
                key={index}
                required
                maxLength="1"
                type="text"
                className={styles.otpInput}
                id={`otp-input${index + 1}`}
                value={value}
                onChange={(event) => handleChange(index, event)}
              />
            ))}
          </div>
          <button className={styles.verifyButton} type="submit">
            Verify
          </button>
          <button className={styles.exitBtn} type="button" onClick={onClose}>
            ×
          </button>
          <p className={styles.resendNote}>
            Didn't receive the code?{" "}
            <button
              className={styles.resendBtn}
              type="button"
              onClick={handleResend}
              disabled={!canResend}
            >
              {canResend ? "Resend Code" : `Wait ${resendTimer}s`}
            </button>
          </p>
        </form>
      </div>
    </>
  );
};

export default Otp;

// import { useState } from "react";
// import styles from "./Otp.module.css";

// const Otp = () => {
//   const [otp, setOtp] = useState(["", "", "", ""]);

//   const handleChange = (index, event) => {
//     const value = event.target.value;
//     if (!isNaN(value) && value.length <= 1) {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);

//       if (value && index < 3) {
//         document.getElementById(`otp-input${index + 2}`).focus();
//       }
//     }
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     alert(`OTP Entered: ${otp.join("")}`);
//   };

//   const handleResend = () => {
//     alert("Resending OTP...");
//   };

//   return (
//     <form className={styles.otpForm} onSubmit={handleSubmit}>
//       <span className={styles.mainHeading}>Enter OTP</span>
//       <p className={styles.otpSubheading}>
//         We have sent a verification code to your mobile number
//       </p>
//       <div className={styles.inputContainer}>
//         {otp.map((value, index) => (
//           <input
//             key={index}
//             required
//             maxLength="1"
//             type="text"
//             className={styles.otpInput}
//             id={`otp-input${index + 1}`}
//             value={value}
//             onChange={(event) => handleChange(index, event)}
//           />
//         ))}
//       </div>
//       <button className={styles.verifyButton} type="submit">
//         Verify
//       </button>
//       <button
//         className={styles.exitBtn}
//         type="button"
//         onClick={() => alert("Closing OTP Form...")}
//       >
//         ×
//       </button>
//       <p className={styles.resendNote}>
//         Didn't receive the code?{" "}
//         <button
//           className={styles.resendBtn}
//           type="button"
//           onClick={handleResend}
//         >
//           Resend Code
//         </button>
//       </p>
//     </form>
//   );
// };

// export default Otp;
