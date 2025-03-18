"use client";

import { useState } from "react";
import { Download, X } from "lucide-react";
import styles from "./candidate-profile.module.css";

const CandidateProfile = ({
  candidate,
  onClose,
  otherCandidates = [],
  onCandidateSelect,
}) => {
  const [selectedTab, setSelectedTab] = useState("about");

  if (!candidate) {
    return (
      <div className={styles.profileOverlay}>
        <div className={styles.profileContent}>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
          <h2>No Candidate Selected</h2>
          <p>Please select a candidate to view their profile.</p>
        </div>
      </div>
    );
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/resume/${candidate.user_id}`
      );
      if (!response.ok) throw new Error("Resume not found");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${candidate.full_name}-resume.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading resume:", error);
      alert("Failed to download resume");
    }
  };

  return (
    <div className={styles.profileOverlay}>
      {/* Sidebar for Other Candidates */}
      <div className={styles.sidebar}>
        <h3>Other Candidates</h3>
        <div className={styles.candidateList}>
          {otherCandidates.length > 0 ? (
            otherCandidates.map((other) => (
              <div
                key={other.user_id}
                className={styles.candidateItem}
                onClick={() => onCandidateSelect(other)}
              >
                <h4>{other.full_name || "Unknown Name"}</h4>
                <p>
                  {other.city || "Unknown City"},{" "}
                  {other.state || "Unknown State"}
                </p>
              </div>
            ))
          ) : (
            <p>No other candidates available</p>
          )}
        </div>
      </div>

      {/* Main Profile Content */}
      <div className={styles.profileContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>

        {/* Profile Header */}
        <div className={styles.profileHeader}>
          <div className={styles.profileInfo}>
            <h2>{candidate.full_name || "Unknown Name"}</h2>
            <p>
              {candidate.city || "Unknown City"},{" "}
              {candidate.state || "Unknown State"}
            </p>
          </div>
          <button className={styles.downloadButton} onClick={handleDownload}>
            <Download size={20} />
            Download Resume
          </button>
        </div>

        {/* Profile Tabs */}
        <div className={styles.tabs}>
          {["about", "experience", "education"].map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${selectedTab === tab ? styles.active : ""}`}
              onClick={() => setSelectedTab(tab)}
              aria-selected={selectedTab === tab}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {selectedTab === "about" && (
            <div>
              <h3>Skills</h3>
              <div className={styles.skillsTags}>
                {candidate.skills?.length > 0 ? (
                  candidate.skills.map((skill, index) => (
                    <span key={index} className={styles.skillTag}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <p>No skills available</p>
                )}
              </div>
              <h3>Available From</h3>
              <p>{candidate.available_time || "Immediately"}</p>
            </div>
          )}

          {selectedTab === "experience" && (
            <div>
              <h3>Work Experience</h3>
              <p>
                {candidate.experience
                  ? `${candidate.experience} years`
                  : "Not specified"}
              </p>
              <p>Current Company: {candidate.company || "Not specified"}</p>
            </div>
          )}

          {selectedTab === "education" && (
            <div>
              <h3>Education Details</h3>
              {candidate.education_details &&
              Array.isArray(candidate.education_details) ? (
                <ul>
                  {candidate.education_details.map((edu, index) => (
                    <li key={index}>{edu}</li>
                  ))}
                </ul>
              ) : (
                <p>No education details available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
