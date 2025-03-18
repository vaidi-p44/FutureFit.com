import { useState } from "react";
import axios from "axios";
import styles from "./register.module.css";
import { FaUser } from "react-icons/fa6";
import { LuLock } from "react-icons/lu";
import { IoIosEyeOff, IoIosEye } from "react-icons/io";
import { MdOutlineMail, MdLocalPhone } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Otp from "./../Otp/otp";
const Register = ({ onRegisterSuccess, toggleLoginForm }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({
    user_email: "",
    user_mobile: "",
    password: "",
    role: "job_seeker",
  });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const isValidPhone = (phone) => /^\d{10}$/.test(phone);

  const fetchUserProfile = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/Aboutyou/${userId}`
      );
      return response.data?.data || response.data;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      return null;
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isValidEmail(values.user_email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!isValidPhone(values.user_mobile)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (values.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8081/Register",
        values
      );

      if (response.data.status === "success") {
        localStorage.setItem("user_id", response.data.user_id);
        localStorage.setItem("role", values.role);

        // Fix: Remove undefined variable token
        // localStorage.setItem("token", token); ❌ Incorrect
        // Token is not returned in response, so remove this line.

        localStorage.setItem("isLoggedIn", "true");

        toast.success("Registration successful! Sending OTP...");

        // Fix: Ensure OTP popup is triggered correctly
        setIsOtpSent(true);
        setShowOtpPopup(true);
      } else {
        toast.error(
          response.data.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );

      if (error.response?.data?.message === "Email already exists") {
        toast.error(
          "This email is already registered. Please use a different email."
        );
      } else {
        toast.error("An error occurred during registration. Please try again.");
      }
    }
  };

  return (
    <div className={styles.registerContainer}>
      <ToastContainer />
      <h2 className={styles.formTitle}>Register</h2>
      <form className={styles.registerForm} onSubmit={handleRegister}>
        <div className={styles.input}>
          <input
            type="email"
            placeholder="Enter your email"
            className={styles.inputField}
            onChange={(e) =>
              setValues({ ...values, user_email: e.target.value })
            }
            required
            autoComplete="off"
          />
          <MdOutlineMail className={styles.icon} />
        </div>
        <div className={styles.input}>
          <input
            type="text"
            placeholder="Enter your mobile number"
            className={styles.inputField}
            onChange={(e) =>
              setValues({ ...values, user_mobile: e.target.value })
            }
            required
            autoComplete="off"
          />
          <MdLocalPhone className={styles.icon} />
        </div>
        <div className={styles.input}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className={styles.inputField}
            onChange={(e) => setValues({ ...values, password: e.target.value })}
            required
            autoComplete="off"
          />
          <LuLock className={styles.icon} />
          <span className={styles.eye} onClick={togglePasswordVisibility}>
            {showPassword ? <IoIosEye /> : <IoIosEyeOff />}
          </span>
        </div>
        <div className={styles.input_type}>
          <label className={styles.radios}>
            <input
              className={styles.radiobtn}
              type="radio"
              name="role"
              value="job_seeker"
              checked={values.role === "job_seeker"}
              onChange={(e) => setValues({ ...values, role: e.target.value })}
            />
            JobSeeker
          </label>

          <label className={styles.radios}>
            <input
              className={styles.radiobtn}
              type="radio"
              name="role"
              value="employee"
              checked={values.role === "employee"}
              onChange={(e) => setValues({ ...values, role: e.target.value })}
            />
            Employee
          </label>
        </div>
        <button className={styles.registerButton}>Register</button>
        <div>
          <p className={styles.signup}>
            Already have an account?{" "}
            <span
              className={styles.signup}
              onClick={toggleLoginForm}
              style={{ cursor: "pointer", color: "blue", marginLeft: "5px" }}
            >
              Log in
            </span>
          </p>
        </div>
        {isOtpSent && (
          <p className={styles.verificationMessage}>
            OTP sent to your email. Please enter it to verify your account.
          </p>
        )}
      </form>

      {showOtpPopup && (
        <div className={styles.otpOverlay}>
          <Otp
            userEmail={values.user_email} // ✅ Pass the correct email
            onClose={() => setShowOtpPopup(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Register;

// import { useState } from "react";
// import axios from "axios";
// import styles from "./register.module.css";
// import { FaUser } from "react-icons/fa6";
// import { LuLock } from "react-icons/lu";
// import { IoIosEyeOff, IoIosEye } from "react-icons/io";
// import { MdOutlineMail, MdLocalPhone } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Register = ({ onRegisterSuccess }) => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [values, setValues] = useState({
//     user_email: "",
//     user_mobile: "",
//     password: "",
//     role: "job_seeker",
//   });
//   const [isEmailVerified, setIsEmailVerified] = useState(false);
//   const navigate = useNavigate();

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
//   const isValidPhone = (phone) => /^\d{10}$/.test(phone);

//   const fetchUserProfile = async (userId) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8081/api/Aboutyou/${userId}`
//       );
//       return response.data?.data || response.data;
//     } catch (error) {
//       console.error("Failed to fetch user data:", error);
//       return null;
//     }
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();

//     if (!isValidEmail(values.user_email)) {
//       toast.error("Please enter a valid email address.");
//       return;
//     }

//     if (!isValidPhone(values.user_mobile)) {
//       toast.error("Please enter a valid 10-digit mobile number.");
//       return;
//     }

//     if (values.password.length < 6) {
//       toast.error("Password must be at least 6 characters long.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:8081/Register",
//         values
//       );

//       if (response.data.status === "success") {
//         const { user_id, token, isEmailVerified } = response.data;
//         const role = values.role;

//         if (!token) {
//           toast.error("Error: Token not received. Try again.");
//           return;
//         }

//         localStorage.setItem("user_id", user_id);
//         localStorage.setItem("role", role);
//         localStorage.setItem("token", token);
//         localStorage.setItem("isLoggedIn", "true");
//         localStorage.setItem(
//           "isEmailVerified",
//           isEmailVerified ? "true" : "false"
//         );

//         setIsEmailVerified(isEmailVerified);

//         const userProfile = await fetchUserProfile(user_id);
//         if (userProfile) {
//           localStorage.setItem("userProfile", JSON.stringify(userProfile));
//         }

//         onRegisterSuccess(userProfile);

//         toast.success("Registration successful! Please verify your email.");

//         setTimeout(() => {
//           if (isEmailVerified) {
//             navigate(
//               role === "job_seeker" ? "/Aboutyou" : "/EmployeeRegistration"
//             );
//             window.location.reload();
//           } else {
//             navigate("/verifyemail");
//             // toast.error("This email is in valid.");
//           }
//         }, 2000);
//       } else {
//         toast.error(
//           response.data.message || "Registration failed. Please try again."
//         );
//       }
//     } catch (error) {
//       if (error.response?.data?.message === "Email already exists") {
//         toast.error(
//           "This email is already registered. Please use a different email."
//         );
//       } else {
//         toast.error("An error occurred during registration. Please try again.");
//       }
//       console.error("Registration error:", error);
//     }
//   };

//   return (
//     <div className={styles.registerContainer}>
//       <ToastContainer />
//       <h2 className={styles.formTitle}>Register</h2>
//       <form className={styles.registerForm} onSubmit={handleRegister}>
//         <div className={styles.input}>
//           <input
//             type="email"
//             placeholder="Enter your email"
//             className={styles.inputField}
//             onChange={(e) =>
//               setValues({ ...values, user_email: e.target.value })
//             }
//             required
//             autoComplete="off"
//           />
//           <MdOutlineMail className={styles.icon} />
//         </div>
//         <div className={styles.input}>
//           <input
//             type="text"
//             placeholder="Enter your mobile number"
//             className={styles.inputField}
//             onChange={(e) =>
//               setValues({ ...values, user_mobile: e.target.value })
//             }
//             required
//             autoComplete="off"
//           />
//           <MdLocalPhone className={styles.icon} />
//         </div>
//         <div className={styles.input}>
//           <input
//             type={showPassword ? "text" : "password"}
//             placeholder="Enter your password"
//             className={styles.inputField}
//             onChange={(e) => setValues({ ...values, password: e.target.value })}
//             required
//             autoComplete="off"
//           />
//           <LuLock className={styles.icon} />
//           <span className={styles.eye} onClick={togglePasswordVisibility}>
//             {showPassword ? <IoIosEye /> : <IoIosEyeOff />}
//           </span>
//         </div>
//         <div className={styles.input_type}>
//           <label className={styles.radios}>
//             <input
//               className={styles.radiobtn}
//               type="radio"
//               name="role"
//               value="job_seeker"
//               checked={values.role === "job_seeker"}
//               onChange={(e) => setValues({ ...values, role: e.target.value })}
//             />
//             JobSeeker
//           </label>

//           <label className={styles.radios}>
//             <input
//               className={styles.radiobtn}
//               type="radio"
//               name="role"
//               value="employee"
//               checked={values.role === "employee"}
//               onChange={(e) => setValues({ ...values, role: e.target.value })}
//             />
//             Employee
//           </label>
//         </div>
//         <button className={styles.registerButton}>Register</button>

//         {!isEmailVerified && (
//           <p className={styles.verificationMessage}>
//             Please check your email for a verification link.
//           </p>
//         )}
//       </form>
//     </div>
//   );
// };

// export default Register;

// import { useState } from "react";
// import axios from "axios";
// import styles from "./register.module.css";
// import { FaUser } from "react-icons/fa6";
// import { LuLock } from "react-icons/lu";
// import { IoIosEyeOff } from "react-icons/io";
// import { IoIosEye } from "react-icons/io";
// import { MdOutlineMail } from "react-icons/md";
// import { MdLocalPhone } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Register = ({ onRegisterSuccess }) => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [values, setValues] = useState({
//     user_email: "",
//     user_mobile: "",
//     password: "",
//     role: "job_seeker",
//   });
//   const navigate = useNavigate();

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
//   const isValidPhone = (phone) => /^\d{10}$/.test(phone);

//   const fetchUserProfile = async (userId) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8081/api/Aboutyou/${userId}`
//       );
//       return response.data?.data || response.data;
//     } catch (error) {
//       console.error("Failed to fetch user data:", error);
//       return null;
//     }
//   };

//   // Handle form submission
//   const handleRegister = async (e) => {
//     e.preventDefault();

//     if (!isValidEmail(values.user_email)) {
//       toast.error("Please enter a valid email address.");
//       return;
//     }

//     if (!isValidPhone(values.user_mobile)) {
//       toast.error("Please enter a valid 10-digit mobile number.");
//       return;
//     }

//     if (values.password.length < 6) {
//       toast.error("Password must be at least 6 characters long.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:8081/Register",
//         values
//       );

//       if (response.data.status === "success") {
//         const { user_id, token } = response.data;
//         const role = values.role; // Extract role from state
//         localStorage.setItem("user_id", user_id); // Save user_id in local storage
//         localStorage.setItem("role", role);
//         localStorage.setItem("token", token);
//         localStorage.setItem("isLoggedIn", "true");

//         const userProfile = await fetchUserProfile(user_id);
//         if (userProfile) {
//           localStorage.setItem("userProfile", JSON.stringify(userProfile));
//         }

//         onRegisterSuccess(userProfile);

//         toast.success("Registration successful! Redirecting...");
//         setTimeout(() => {
//           if (role === "job_seeker") {
//             navigate("/Aboutyou");
//           } else {
//             navigate("/EmployeeRegistration");
//           }
//           window.location.reload();
//         }, 2000);
//       } else {
//         toast.error(
//           response.data.message || "Registration failed. Please try again."
//         );
//       }
//     } catch (error) {
//       if (
//         error.response &&
//         error.response.data.message === "Email already exists"
//       ) {
//         toast.error(
//           "This email is already registered. Please use a different email."
//         );
//       } else {
//         toast.error("An error occurred during registration. Please try again.");
//       }
//       console.error("Registration error:", error);
//     }
//   };

//   return (
//     <div className={styles.registerContainer}>
//       <ToastContainer />
//       <h2 className={styles.formTitle}>Register</h2>
//       <form className={styles.registerForm} onSubmit={handleRegister}>
//         <div className={styles.input}>
//           <input
//             type="email"
//             placeholder="Enter your email"
//             className={styles.inputField}
//             onChange={(e) =>
//               setValues({ ...values, user_email: e.target.value })
//             }
//             required
//             autoComplete="off"
//           />
//           <MdOutlineMail className={styles.icon} />
//         </div>
//         <div className={styles.input}>
//           <input
//             type="text"
//             placeholder="Enter your mobile number"
//             className={styles.inputField}
//             onChange={(e) =>
//               setValues({ ...values, user_mobile: e.target.value })
//             }
//             required
//             autoComplete="off"
//           />
//           <MdLocalPhone className={styles.icon} />
//         </div>
//         <div className={styles.input}>
//           <input
//             type={showPassword ? "text" : "password"}
//             placeholder="Enter your password"
//             className={styles.inputField}
//             onChange={(e) => setValues({ ...values, password: e.target.value })}
//             required
//             autoComplete="off"
//           />
//           <LuLock className={styles.icon} />
//           <span className={styles.eye} onClick={togglePasswordVisibility}>
//             {showPassword ? <IoIosEye /> : <IoIosEyeOff />}
//           </span>
//         </div>
//         <div className={styles.input_type}>
//           <label className={styles.radios}>
//             <input
//               className={styles.radiobtn}
//               type="radio"
//               name="role"
//               value="job_seeker"
//               checked={values.role === "job_seeker"}
//               onChange={(e) => setValues({ ...values, role: e.target.value })}
//             />
//             JobSeeker
//           </label>

//           <label className={styles.radios}>
//             <input
//               className={styles.radiobtn}
//               type="radio"
//               name="role"
//               value="employee"
//               checked={values.role === "employee"}
//               onChange={(e) => setValues({ ...values, role: e.target.value })}
//             />
//             Employee
//           </label>
//         </div>
//         <button className={styles.registerButton}>Register</button>
//       </form>
//     </div>
//   );
// };

// export default Register;
