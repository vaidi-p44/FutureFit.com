import { main } from "@popperjs/core";
import styles from "./login.module.css";
import Sociallogin from "./sociallogin";
import { IconContext } from "react-icons";
import { MdOutlineMail } from "react-icons/md";
import { LuLock } from "react-icons/lu";
import { IoIosEyeOff } from "react-icons/io";
import { IoIosEye } from "react-icons/io";
import { useState } from "react";
import axios from "axios";

import { useNavigate, Link } from "react-router-dom";

const Login = ({ onLoginSuccess, toggleRegisterForm }) => {
  var eicon = <MdOutlineMail className={styles.icon} />;
  var licon = <LuLock className={styles.icon} />;
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [values, setvalues] = useState({
    user_email: "",
    password: "",
    role: "job_seeker",
  });

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handlelogin = (e) => {
    e.preventDefault();

    // Log the current input values for debugging
    console.log(values.user_email, values.password);

    axios
      .post("http://localhost:8081/login", values)

      .then((res) => {
        if (res.data.status === "success") {
          localStorage.setItem("user_id", res.data.user_id);
          localStorage.setItem("role", res.data.role);
          localStorage.setItem("admin_token", res.data.token);

          // ✅ Set token for future requests
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${res.data.token}`;

          if (res.data.role === "admin") {
            // ✅ Open the admin panel in a new tab
            window.open("http://localhost:5174/", "_blank");
          } else if (res.data.role === "job_seeker") {
            navigate("/");
          } else if (res.data.role === "employee") {
            navigate("/EmployeeDashboard");
          }
          onLoginSuccess();
          location.reload();
        } else {
          // Show an alert with the message from backend if login fails
          alert(res.data.message);
        }
      })
      .catch((err) => {
        // Log the error for debugging
        console.error("Error:", err);

        // If a 400 error occurs, extract the message from the response and alert it
        if (err.response) {
          alert(err.response.data.message); // This will be the error message from the backend
        } else {
          alert("An error occurred. Please try again later.");
        }
      });
  };

  // // for open a otm mobile number form

  // const [open, setOpen] = useState(false);

  // const toggleLoginForm = () => {
  //     setOpen((prev) => !prev);
  // };

  // //otp use for login

  // const handleOTPLogin = (e) => {
  //   e.preventDefault();
  //   console.log("OTP form values:", values.email, values.otp);
  //   axios
  //     .post("http://localhost:8081/otp-login", {
  //       email: values.email,
  //       otp: values.otp,
  //     })
  //     .then((res) => {
  //       if (res.data.status === "success") {
  //         window.location.href = "/";
  //       } else {
  //         alert(res.data.message);
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // };
  return (
    <>
      <div className={styles.logincontainer}>
        <h2 className={styles.form_title}>Log in with</h2>
        <Sociallogin />
        <p className={styles.separator}>
          <span>or</span>
        </p>

        <form action="" className={styles.login_form} onSubmit={handlelogin}>
          <div className={styles.input_type}>
            <label className={styles.radios}>
              <input
                className={styles.radiobtn}
                type="radio"
                name="role"
                value="job_seeker"
                checked={values.role === "job_seeker"}
                onChange={(e) => setvalues({ ...values, role: e.target.value })}
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
                onChange={(e) => setvalues({ ...values, role: e.target.value })}
              />
              Employee
            </label>
          </div>
          <div className={styles.input}>
            <input
              type="email"
              placeholder="Enter your email / Username"
              className={styles.input_field}
              onChange={(e) =>
                setvalues({ ...values, user_email: e.target.value })
              }
              required
              autoComplete="off"
            />
            <MdOutlineMail className={styles.icon} />
          </div>
          <div className={styles.input}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={styles.input_field}
              onChange={(e) =>
                setvalues({ ...values, password: e.target.value })
              }
              required
              autoComplete="off"
            />
            <LuLock className={styles.icon} />
            <span className={styles.eye} onClick={togglePasswordVisibility}>
              {showPassword ? <IoIosEye /> : <IoIosEyeOff />}
            </span>
          </div>
          <a href="/forgot-password" className={styles.forgot_pass_link}>
            Forgot Password?
          </a>
          <button className={styles.login_button}>Log In</button>

          <p className={styles.signup}>
            Don't have account?
            <span
              className={styles.signup}
              onClick={toggleRegisterForm}
              style={{ cursor: "pointer", color: "blue", marginLeft: "5px" }}
            >
              Sign up
            </span>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
