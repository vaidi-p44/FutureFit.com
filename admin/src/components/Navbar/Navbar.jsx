import { useState } from "react";
import { FiMenu, FiSearch, FiMoon, FiSun, FiBell } from "react-icons/fi";
import styles from "./Navbar.module.css";
import ProfileIcon from "../../assets/profileicon.png";

const Navbar = ({ toggleDarkMode, darkMode, toggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSection}>
        <button className={styles.menuButton} onClick={toggleSidebar}>
          <FiMenu />
        </button>
        <div className={styles.searchBar}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.rightSection}>
        <button className={styles.iconButton} onClick={toggleDarkMode}>
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>
        <button className={styles.iconButton}>
          <FiBell />
        </button>
        <div className={styles.profile}>
          <img src={ProfileIcon} alt="Profile" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
