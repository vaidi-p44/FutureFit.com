import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Employeenavbar.module.css";

const Enavlink = () => {
  const [hasRequested, setHasRequested] = useState(false);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    checkPreviousRequest();
  }, []);

  const checkPreviousRequest = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/get-request/${userId}`
      );
      const data = await response.json();

      if (data.status === "success" && data.data) {
        setHasRequested(true);
      }
    } catch (error) {
      console.error("Error fetching request status:", error);
    }
  };

  // Define `links` as an array
  const links = [
    { name: "Home", url: "/EmployeeDashboard" },
    { name: "Jobs & Responses", url: "/jobs" },
    { name: "Find Talent", url: hasRequested ? "/FindTalentPage" : "/resdex" }, // ✅ Conditionally change URL
    { name: "Post Jobs", url: "/post-jobs" },
    { name: "analytics", url: "/analytics" },
  ];

  return (
    <nav className={styles.navmenu}>
      {links.map((link, index) => (
        <Link key={index} to={link.url} className={styles.navLink}>
          {link.name}
        </Link>
      ))}
    </nav>
  );
};

export default Enavlink;
