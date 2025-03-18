import React, { useEffect, useState } from "react";
import { Briefcase, MapPin, CalendarCheck } from "lucide-react";
import styles from "./AppliedJobs.module.css";

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const userId = localStorage.getItem("user_id"); // Get user_id from localStorage

  useEffect(() => {
    if (!userId) {
      console.error("User ID not found");
      return;
    }

    const fetchAppliedJobs = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/api/applied-jobs/${userId}`
        );
        const data = await response.json();

        if (data.status === "success") {
          setAppliedJobs(data.appliedJobs);
        } else {
          console.error("Error fetching applied jobs:", data.message);
        }
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      }
    };

    fetchAppliedJobs();
  }, [userId]);

  return (
    <div className={styles.appliedJobsContainer}>
      <h2 className={styles.heading}>My Applied Jobs</h2>
      {appliedJobs.length > 0 ? (
        <div className={styles.jobsGrid}>
          {appliedJobs.map((job) => (
            <div key={job.id} className={styles.jobCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.jobTitle}>{job.title}</h3>
                <span
                  className={`${styles.statusBadge} ${
                    styles[
                      job.status
                        ? job.status.toLowerCase().replace(/\s+/g, "-")
                        : "pending"
                    ]
                  }`}
                >
                  {job.status || "Pending"}
                </span>
              </div>
              <p className={styles.company}>
                <Briefcase size={16} /> {job.company}
              </p>
              <p className={styles.location}>
                <MapPin size={16} /> {job.location}
              </p>
              <p className={styles.date}>
                <CalendarCheck size={16} /> Applied on:{" "}
                {new Date(job.applied_date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.noJobs}>You haven't applied for any jobs yet.</p>
      )}
    </div>
  );
};

export default AppliedJobs;
