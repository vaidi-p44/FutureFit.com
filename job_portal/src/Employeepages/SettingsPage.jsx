import { useState } from "react"
import { User, Building2, Lock, Bell, Users, Shield } from "lucide-react"
import styles from "./SettingsPage.module.css"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <button
            className={`${styles.tabButton} ${activeTab === "profile" ? styles.active : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <User size={20} />
            Profile Settings
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "company" ? styles.active : ""}`}
            onClick={() => setActiveTab("company")}
          >
            <Building2 size={20} />
            Company Profile
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "security" ? styles.active : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <Lock size={20} />
            Security
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "notifications" ? styles.active : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            <Bell size={20} />
            Notifications
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "team" ? styles.active : ""}`}
            onClick={() => setActiveTab("team")}
          >
            <Users size={20} />
            Team Members
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "privacy" ? styles.active : ""}`}
            onClick={() => setActiveTab("privacy")}
          >
            <Shield size={20} />
            Privacy
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "profile" && (
            <div className={styles.formSection}>
              <h2>Profile Settings</h2>
              <form className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input type="text" placeholder="Enter your full name" />
                </div>
                <div className={styles.formGroup}>
                  <label>Email Address</label>
                  <input type="email" placeholder="Enter your email" />
                </div>
                <div className={styles.formGroup}>
                  <label>Phone Number</label>
                  <input type="tel" placeholder="Enter your phone number" />
                </div>
                <div className={styles.formGroup}>
                  <label>Designation</label>
                  <input type="text" placeholder="Enter your designation" />
                </div>
                <button type="submit" className={styles.saveButton}>
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === "company" && (
            <div className={styles.formSection}>
              <h2>Company Profile</h2>
              <form className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Company Name</label>
                  <input type="text" placeholder="Enter company name" />
                </div>
                <div className={styles.formGroup}>
                  <label>Industry</label>
                  <select>
                    <option value="">Select industry</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Company Size</label>
                  <select>
                    <option value="">Select company size</option>
                    <option value="1-50">1-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501+">501+ employees</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Company Website</label>
                  <input type="url" placeholder="Enter company website" />
                </div>
                <button type="submit" className={styles.saveButton}>
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* Add similar sections for other tabs */}
        </div>
      </div>
    </div>
  )
}

