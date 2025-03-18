import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./login.module.css";

const SocialLogin = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      console.log("Google Login Response:", response); // Debugging

      if (!response) {
        alert("Google Login Failed: No response from Google");
        return;
      }

      try {
        // Send the ID Token to the backend
        const res = await axios.post("http://localhost:8081/api/auth/google", {
          token: response.credential, // Send the correct token!
        });

        if (res.data.status === "success") {
          localStorage.setItem("user_id", res.data.user_id);
          localStorage.setItem("role", res.data.role);
          localStorage.setItem("admin_token", res.data.token);
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${res.data.token}`;

          navigate(res.data.role === "job_seeker" ? "/" : "/EmployeeDashboard");

          if (onLoginSuccess) {
            onLoginSuccess();
          }
        } else {
          alert(res.data.message);
        }
      } catch (error) {
        console.error("Google Login Error:", error);
        alert("Google Login Failed. Try Again.");
      }
    },
    onError: () => alert("Google Login Failed"),
    ux_mode: "popup", // ✅ Important for token retrieval
  });

  return (
    <div className={styles.social_login}>
      <button className={styles.social_button} onClick={googleLogin}>
        <FcGoogle className={styles.social_icon} /> Sign in with Google
      </button>
    </div>
  );
};

export default SocialLogin;

// import { FcGoogle } from "react-icons/fc";
// import styles from "./login.module.css";
// const Sociallogin = () => {
//     return(
//         <>
//      <div className={styles.social_login}>
//             <button className={styles.social_button}>
//             <FcGoogle className={styles.social_icon}/> Sign in with Google
//             </button>
//         </div>
//         </>
//     );

// };
// export default Sociallogin;
