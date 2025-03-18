import React from "react";
import styles from "./AccountManagement.module.css";

const AccountManagement = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Manage account</h2>
      <p className={styles.description}></p>

      <div className={styles.options}>
        <div className={styles.option}>
          <div className={styles.optionInfo}>
            <h3 className={styles.optionTitle}>Deactivate account</h3>
            <p className={styles.optionDescription}>
              Temporarily hide your account from recruiters. Reactivate anytime
              by logging back in.
            </p>
          </div>
          <button className={styles.deactivateButton}>Deactivate</button>
        </div>

        <div className={styles.option}>
          <div className={styles.optionInfo}>
            <h3 className={styles.optionTitle}>Delete account</h3>
            <p className={styles.optionDescription}>
              Permanently remove your account from Naukri. Once deleted, it
              cannot be restored.
            </p>
          </div>
          <button className={styles.deleteButton}>
            <svg
              className={styles.deleteIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default AccountManagement;
