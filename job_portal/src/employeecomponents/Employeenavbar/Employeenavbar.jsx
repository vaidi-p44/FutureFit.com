import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Settings,
  User,
  FileText,
  LogOut,
  Building2,
  Users,
} from "lucide-react";
import axios from "axios";
import styles from "./Employeenavbar.module.css";
import logo from "../../assets/futurefit.png";
import Enavlink from "./Enavlink";
import ProfileIcon from "../../assets/profile.jpg";

const Employeenavbar = ({ user }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // State to store user and company data
  const [userData, setUserData] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle error state

  // Fetch user and company data based on user_id from localStorage
  const fetchData = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }

    setIsLoading(true); // Set loading state to true
    try {
      const response = await axios.get(
        `http://localhost:8081/api/employee/${userId}`
      );
      setUserData(response.data.data); // Assuming response.data.data contains the user data
      setIsLoading(false); // Set loading state to false once data is fetched
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data"); // Set error state
      setIsLoading(false); // Set loading state to false in case of error
    }
  };

  useEffect(() => {
    fetchData(); // Call fetchData when component mounts
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8081/logout", {
        withCredentials: true,
      });
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user_id");
      localStorage.removeItem("role");
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>; // Show loading state
  if (error) return <div>{error}</div>; // Show error state

  return (
    <nav className={styles.navbar}>
      <div className={styles.imglogo}>
        <img src={logo} alt="logo" />
      </div>
      <Enavlink />

      <div className={styles.rightSection}>
        <button
          className={styles.profileButton}
          onClick={() => setIsProfileOpen(!isProfileOpen)}
        >
          <div className={styles.profilename}>
            {userData?.companyName || "User Name"}
          </div>
          <div className={styles.profileIcon}>
            <img
              src={userData?.companyLogo || ProfileIcon}
              alt="Profile"
              className={styles.profileImg}
            />
          </div>
        </button>

        {isProfileOpen && (
          <div className={styles.profileDropdown}>
            <div className={styles.profileHeader}>
              <img
                src={userData?.companyLogo || ProfileIcon}
                alt="Profile"
                className={styles.profileImageLarge}
              />
              <div className={styles.profileDetails}>
                <h3 className={styles.profileFullName}>
                  {userData?.companyName || "User Name"}
                </h3>
                <h2 className={styles.profileRole}>
                  {userData?.designation || "Role"}
                </h2>
                {/* <h4 className={styles.profileEmail}>{userData?.user_email}</h4>
                <h4 className={styles.profilePhone}>{userData?.user_mobile}</h4> */}
              </div>
            </div>

            <div className={styles.dropdownLinks}>
              <span
                className={styles.dropdownLink}
                onClick={() => navigate("/CompanyProfile")}
              >
                <Building2 size={16} />
                <span>Company Profile</span>
              </span>
              <span
                className={styles.dropdownLink}
                onClick={() => navigate("/Profile")}
              >
                <Building2 size={16} />
                <span>posted jobs</span>
              </span>
              <span
                className={styles.dropdownLink}
                onClick={() => navigate("/subscriptions")}
              >
                <FileText size={16} />
                <span>My Subscriptions</span>
              </span>
              <span
                className={styles.dropdownLink}
                onClick={() => navigate("/setting")}
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
                onClick={() => navigate("/Feedbackforemp")}
              >
                <Users size={16} />
                <span>Give Feedback</span>
              </span>
              <button onClick={handleLogout} className={styles.logoutButton}>
                <LogOut size={16} />
                <span>Logout from FutureFit</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Employeenavbar;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ChevronDown,
//   Settings,
//   User,
//   FileText,
//   LogOut,
//   Building2,
//   Users,
// } from "lucide-react";
// import axios from "axios";
// import styles from "./Employeenavbar.module.css";
// import logo from "../../assets/futurefit.png";
// import Enavlink from "./Enavlink";
// import ProfileIcon from "../../assets/profile.jpg";

// const Employeenavbar = ({ user }) => {
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const navigate = useNavigate();
//   const [isLoggedIn, setIsLoggedIn] = useState(true);

//   const [userData, setUserData] = useState(null);

//   const handleLogout = async () => {
//     try {
//       await axios.get("http://localhost:8081/logout", {
//         withCredentials: true,
//       });
//       localStorage.removeItem("isLoggedIn");
//       localStorage.removeItem("user_id");
//       localStorage.removeItem("role");
//       setIsLoggedIn(false);
//       navigate("/");
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   return (
//     <nav className={styles.navbar}>
//       <div className={styles.imglogo}>
//         <img src={logo} alt="logo" />
//       </div>
//       <Enavlink />

//       <div className={styles.rightSection}>
//         <button
//           className={styles.profileButton}
//           onClick={() => setIsProfileOpen(!isProfileOpen)}
//         >
//           <div className={styles.profilename}>
//             {userData?.nick_name || "Your Name"}
//           </div>
//           <div className={styles.profileIcon}>
//             <img
//               src={ProfileIcon}
//               alt="Profile"
//               className={styles.profileImg}
//             />
//           </div>
//           {/* <div className={styles.profileInfo}>
//             <img src="" alt="" className={styles.profileImage} />
//             <span className={styles.profileName}>name</span>
//           </div> */}
//           {/* <ChevronDown className={styles.chevron} /> */}
//         </button>

//         {isProfileOpen && (
//           <div className={styles.profileDropdown}>
//             <div className={styles.profileHeader}>
//               <img src="" alt="" className={styles.profileImageLarge} />
//               <div className={styles.profileDetails}>
//                 <h3 className={styles.profileFullName}>name</h3>
//                 <p className={styles.profileRole}>Superuser</p>
//                 <p className={styles.profileEmail}>email</p>
//                 <p className={styles.profilePhone}>phone</p>
//               </div>
//             </div>

//             <div className={styles.dropdownLinks}>
//               <span
//                 className={styles.dropdownLink}
//                 onClick={() => navigate("/CompanyProfile")}
//               >
//                 <Building2 size={16} />
//                 <span>Company Profile</span>
//               </span>
//               <span
//                 className={styles.dropdownLink}
//                 onClick={() => navigate("/subscriptions")}
//               >
//                 <FileText size={16} />
//                 <span>My Subscriptions</span>
//               </span>
//               <span
//                 className={styles.dropdownLink}
//                 onClick={() => navigate("/setting")}
//               >
//                 <Settings size={16} />
//                 <span>Settings</span>
//                 {/* <ChevronDown className={styles.submenuIndicator} /> */}
//               </span>
//               <div className={styles.settingsSubmenu}>
//                 <span
//                   className={styles.submenuLink}
//                   onClick={() => navigate("ProductSettings")}
//                 >
//                   Product Settings
//                 </span>
//                 <span
//                   className={styles.submenuLink}
//                   onClick={() => navigate("ManageUsers")}
//                 >
//                   Manage Users
//                 </span>

//                 <span
//                   className={styles.submenuLink}
//                   onClick={() => navigate("ChangePassword")}
//                 >
//                   Change Password
//                 </span>
//               </div>
//               <span
//                 className={styles.dropdownLink}
//                 onClick={() => navigate("/help")}
//               >
//                 <User size={16} />
//                 <span>Help</span>
//               </span>
//               <span
//                 className={styles.dropdownLink}
//                 onClick={() => navigate("/feedback")}
//               >
//                 <Users size={16} />
//                 <span>Give Feedback</span>
//               </span>
//               <button
//                 onClick={() => {
//                   /* handle logout */
//                 }}
//                 className={styles.logoutButton}
//               >
//                 <LogOut size={16} />
//                 <span onClick={handleLogout}>Logout from FutureFit</span>
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };
// export default Employeenavbar;
