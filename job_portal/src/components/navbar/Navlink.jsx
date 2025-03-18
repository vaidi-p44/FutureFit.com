import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./navbar.module.css";

const Navlink = () => {
  // Define `links` as an array
  const links = [
    { name: "Home", url: "/" },
    { name: "Find Jobs", url: "/Find-jobs" },
    // { name: "Find Talent", url: "/Find-talent" },
    // { name: "Post Jobs", url: "/post-jobs" },
    { name: "About Us", url: "/about" },
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

export default Navlink;
