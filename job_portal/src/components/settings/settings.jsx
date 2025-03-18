import React from "react";

import AccountManagement from "../AccountManagement/AccountManagement";
import Footer from "../Footer/Footer";
import styles from "./settings.module.css";

const Settings = () => {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}>
          <AccountManagement />
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default Settings;
