import styles from "./navbar.module.css";
import logo from "../../assets/futurefit.png";
import ProfileIcon from "../../assets/profileicon.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoMdNotificationsOutline } from "react-icons/io";
import Navlink from "./Navlink";
import Register from "../register/Register";
import Login from "../login/login";
import {
  ChevronDown,
  Settings,
  User,
  FileText,
  LogOut,
  Building2,
  Users,
} from "lucide-react";
const Navbar = () => {
  const [open, setOpen] = useState(false); // To toggle the login form visibility
  const [ropen, setRopen] = useState(false); // To toggle the register form visibility
  const [isLoggedIn, setIsLoggedIn] = useState(false); // User login state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // To toggle the profile dropdown
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(true); // Toggle between Login and Register

  useEffect(() => {
    const fetchUserData = async () => {
      const user_id = localStorage.getItem("user_id");
      if (!user_id) return;

      try {
        const response = await axios.get(
          `http://localhost:8081/api/Aboutyou/${user_id}`
        );
        if (response.data?.data) {
          setUserData(response.data.data);
        } else {
          setUserData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    const storedLoginState = localStorage.getItem("isLoggedIn");
    if (storedLoginState === "true") {
      setIsLoggedIn(true);
      fetchUserData();
    }
  }, []);

  const toggleLoginForm = () => {
    setOpen(true);
    setShowLogin(true); // Show login form
  };

  const toggleRegisterForm = () => {
    setOpen(true);
    setShowLogin(false); // Show register form
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLoginSuccess = (userProfile) => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    if (userProfile) {
      setUserData(userProfile);
    }
    setOpen(false);
  };

  const handleRegisterSuccess = (userProfile) => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    if (userProfile) {
      setUserData(userProfile);
    }
    setRopen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8081/logout", {
        withCredentials: true,
      });
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user_id");
      localStorage.removeItem("role");
      localStorage.removeItem("admin_token");

      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.imglogo}>
        <img src={logo} alt="logo" />
      </div>
      <Navlink />
      <div className={styles.logininfo}>
        {isLoggedIn ? (
          <>
            <div className={styles.profilename}>
              {userData?.nick_name || "Your Name"}
            </div>
            <div className={styles.profileIcon} onClick={toggleDropdown}>
              <img
                src={userData?.profile_photo || ProfileIcon}
                alt="Profile"
                className={styles.profileImg}
              />
            </div>
            {isDropdownOpen && (
              <div className={styles.profileDropdown}>
                <div className={styles.dropdownLinks}>
                  <span
                    className={styles.dropdownLink}
                    onClick={() => navigate("/ProfileSection")}
                  >
                    <Building2 size={16} />
                    <span>Profile</span>
                  </span>
                  <span
                    className={styles.dropdownLink}
                    onClick={() => navigate("/AppliedJobs")}
                  >
                    <Building2 size={16} />
                    <span>appled jobs</span>
                  </span>

                  <span
                    className={styles.dropdownLink}
                    onClick={() => navigate("/Settings")}
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </span>
                  <span
                    className={styles.dropdownLink}
                    onClick={() => navigate("/help")}
                  >
                    <User size={16} />
                    <span>Help</span>
                  </span>
                  <span
                    className={styles.dropdownLink}
                    onClick={() => navigate("/feedback")}
                  >
                    <Users size={16} />
                    <span>Give Feedback</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className={styles.logoutButton}
                  >
                    <LogOut size={16} />
                    <span>Logout from FutureFit</span>
                  </button>
                  {/* <button className={styles.dropdownItem} onClick={openProfile}>
                  Profile
                </button>
                <button className={styles.dropdownItem} onClick={openSettings}>
                  Settings
                </button>
                <button className={styles.dropdownItem} onClick={handleLogout}>
                  Logout
                </button> */}
                </div>
              </div>
            )}
            <div className={styles.notification}>
              <IoMdNotificationsOutline className={styles.icon} />
            </div>
          </>
        ) : (
          <>
            <div className={styles.navlogin} onClick={toggleLoginForm}>
              Login
            </div>
            <div className={styles.navRegister} onClick={toggleRegisterForm}>
              Register
            </div>

            {open && (
              <div className={styles.openlogin}>
                <div className={styles.onclicklogin}>
                  <button
                    className={styles.closeButton}
                    onClick={() => setOpen(false)}
                  >
                    ✖
                  </button>

                  {showLogin ? (
                    <Login
                      onLoginSuccess={handleLoginSuccess}
                      toggleRegisterForm={toggleRegisterForm}
                    />
                  ) : (
                    <Register
                      onRegisterSuccess={handleRegisterSuccess}
                      toggleLoginForm={toggleLoginForm}
                    />
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
