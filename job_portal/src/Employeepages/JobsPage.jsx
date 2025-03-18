import { useState, useEffect } from "react";
import { Plus, Search, Filter, Download, X } from "lucide-react";
import styles from "./JobsPage.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function JobsPage() {
  const [activeTab, setActiveTab] = useState("active");
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobApplicants, setSelectedJobApplicants] = useState([]);
  const [showApplicants, setShowApplicants] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const user_id = localStorage.getItem("user_id");
  const navigate = useNavigate();
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      if (!user_id) {
        console.error("No user_id found in localStorage");
        return;
      }

      const response = await axios.get(
        `http://localhost:8081/api/jobs/user/${user_id}`
      );

      if (response.data?.jobs && Array.isArray(response.data.jobs)) {
        setJobs(response.data.jobs);
      } else {
        console.error("Unexpected API response:", response.data);
        setJobs([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    }
  };

  const fetchApplicants = async (job) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/job-applications/${job.id}`
      );

      if (
        response.data?.applicants &&
        Array.isArray(response.data.applicants)
      ) {
        setSelectedJob(job);
        setSelectedJobApplicants(response.data.applicants);
        setShowApplicants(true);
      } else {
        console.error("Unexpected Applicants API response:", response.data);
        setSelectedJobApplicants([]);
      }
    } catch (error) {
      console.error("Error fetching applicants:", error);
      setSelectedJobApplicants([]);
    }
  };

  const fetchApplicantDetails = async (applicant) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/candidates/${applicant.user_id}`
      );
      console.log("Fetched Applicant Data:", response.data); // Debugging

      if (response.data && response.data.data) {
        setSelectedApplicant({
          full_name: response.data.data.full_name || "N/A",
          user_email: response.data.data.user_email || "Not provided",
          user_mobile: response.data.data.user_mobile || "Not provided",
          city: response.data.data.city || "",
          state: response.data.data.state || "",
          experience: response.data.data.total_experience ?? "N/A", // Ensures 'N/A' if null
          skills:
            response.data.data.skills && response.data.data.skills.length > 0
              ? response.data.data.skills
              : ["No skills listed"],

          languages:
            response.data.data.languages &&
            response.data.data.languages.length > 0
              ? response.data.data.languages
              : "No languages listed",
          education:
            response.data.data.education_details &&
            response.data.data.education_details.length > 0
              ? response.data.data.education_details
              : ["No education details available"], // Ensure it's an array
          resume: response.data.data.resume_url || null,
        });
      } else {
        console.error("API returned an empty object or incorrect structure.");
        setSelectedApplicant(null);
      }
    } catch (error) {
      console.error("Error fetching applicant details:", error);
      setSelectedApplicant(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Jobs & Responses</h1>
        <button
          onClick={() => navigate("/post-jobs")}
          className={styles.postButton}
        >
          <Plus size={20} /> Post New Job
        </button>
      </div>

      <div className={styles.jobsList}>
        <table className={styles.jobsTable}>
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Location</th>
              <th>Experience</th>
              <th>Responses</th>
              <th>Posted On</th>
              <th>Expires On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{job.location}</td>
                  <td>{job.experience}</td>
                  <td>
                    <span
                      className={styles.responses}
                      onClick={() => fetchApplicants(job)}
                    >
                      {job.responses} responses
                    </span>
                  </td>
                  <td>{new Date(job.postedDate).toLocaleDateString()}</td>
                  <td>{new Date(job.expiryDate).toLocaleDateString()}</td>
                  <td>
                    <button className={styles.actionButton}>View</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No jobs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showApplicants && selectedJob && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Applicants for {selectedJob.title}</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowApplicants(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div className={styles.applicantsGrid}>
              {selectedJobApplicants.length > 0 ? (
                selectedJobApplicants.map((applicant) => (
                  <div
                    key={applicant.application_id}
                    className={styles.applicantCard}
                    onClick={() => fetchApplicantDetails(applicant)}
                  >
                    <img
                      src={applicant.profile_photo}
                      alt="Profile"
                      className={styles.profilePhoto}
                    />
                    <h3>{applicant.full_name}</h3>
                    <p>{applicant.email}</p>
                  </div>
                ))
              ) : (
                <p>No applicants found.</p>
              )}
            </div>

            {selectedApplicant && (
              <div className={styles.applicantDetailsModal}>
                <h3>{selectedApplicant.full_name || "N/A"}</h3>
                <p>Email: {selectedApplicant.user_email || "Not provided"}</p>
                <p>Mobile: {selectedApplicant.user_mobile || "Not provided"}</p>

                <p>
                  Location:
                  {selectedApplicant.city || selectedApplicant.state
                    ? `${selectedApplicant.city || ""}, ${selectedApplicant.state || ""}`
                    : "Not provided"}
                </p>

                <p>Experience: {selectedApplicant.experience}</p>

                <p>
                  Skills:{" "}
                  {Array.isArray(selectedApplicant.skills) &&
                  selectedApplicant.skills.length > 0
                    ? selectedApplicant.skills.join(", ")
                    : "No skills listed"}
                </p>

                <p>
                  Languages:{" "}
                  {Array.isArray(selectedApplicant.languages) &&
                  selectedApplicant.languages.length > 0
                    ? selectedApplicant.languages.join(", ")
                    : "No languages listed"}
                </p>

                <h4>Education</h4>
                <ul>
                  {Array.isArray(selectedApplicant.education) &&
                  selectedApplicant.education.length > 0 ? (
                    selectedApplicant.education.map((edu, index) => (
                      <li key={index}>{edu}</li>
                    ))
                  ) : (
                    <li>No education details available</li>
                  )}
                </ul>

                {selectedApplicant.resume ? (
                  <a
                    href={selectedApplicant.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button>View Resume</button>
                  </a>
                ) : (
                  <p>No resume uploaded</p>
                )}

                <button
                  className={styles.closeButton}
                  onClick={() => setSelectedApplicant(null)}
                >
                  Close Details
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// import { useState } from "react";
// import { Plus, Search, Filter, Download } from "lucide-react";
// import styles from "./JobsPage.module.css";

// export default function JobsPage() {
//   const [activeTab, setActiveTab] = useState("active");
//   const [jobs] = useState([
//     {
//       id: 1,
//       title: "Senior React Developer",
//       location: "Bangalore",
//       experience: "5-8 years",
//       responses: 45,
//       status: "active",
//       postedDate: "2024-01-15",
//       expiryDate: "2024-02-15",
//     },
//     {
//       id: 2,
//       title: "Product Manager",
//       location: "Mumbai",
//       experience: "6-10 years",
//       responses: 32,
//       status: "active",
//       postedDate: "2024-01-14",
//       expiryDate: "2024-02-14",
//     },
//   ]);

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <h1 className={styles.title}>Jobs & Responses</h1>
//         <button className={styles.postButton}>
//           <Plus size={20} />
//           Post New Job
//         </button>
//       </div>

//       <div className={styles.searchBar}>
//         <div className={styles.searchInput}>
//           <Search size={20} />
//           <input
//             type="text"
//             placeholder="Search jobs by title, skills or company"
//           />
//         </div>
//         <button className={styles.filterButton}>
//           <Filter size={20} />
//           Filters
//         </button>
//         <button className={styles.exportButton}>
//           <Download size={20} />
//           Export
//         </button>
//       </div>

//       <div className={styles.tabs}>
//         <button
//           className={`${styles.tab} ${activeTab === "active" ? styles.active : ""}`}
//           onClick={() => setActiveTab("active")}
//         >
//           Active Jobs
//           <span className={styles.count}>2</span>
//         </button>
//         <button
//           className={`${styles.tab} ${activeTab === "expired" ? styles.active : ""}`}
//           onClick={() => setActiveTab("expired")}
//         >
//           Expired Jobs
//           <span className={styles.count}>0</span>
//         </button>
//         <button
//           className={`${styles.tab} ${activeTab === "closed" ? styles.active : ""}`}
//           onClick={() => setActiveTab("closed")}
//         >
//           Closed Jobs
//           <span className={styles.count}>0</span>
//         </button>
//       </div>

//       <div className={styles.jobsList}>
//         <table className={styles.jobsTable}>
//           <thead>
//             <tr>
//               <th>Job Title</th>
//               <th>Location</th>
//               <th>Experience</th>
//               <th>Responses</th>
//               <th>Posted On</th>
//               <th>Expires On</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {jobs.map((job) => (
//               <tr key={job.id}>
//                 <td className={styles.jobTitle}>{job.title}</td>
//                 <td>{job.location}</td>
//                 <td>{job.experience}</td>
//                 <td>
//                   <span className={styles.responses}>
//                     {job.responses} responses
//                   </span>
//                 </td>
//                 <td>{new Date(job.postedDate).toLocaleDateString()}</td>
//                 <td>{new Date(job.expiryDate).toLocaleDateString()}</td>
//                 <td>
//                   <div className={styles.actions}>
//                     <button className={styles.actionButton}>View</button>
//                     <button className={styles.actionButton}>Edit</button>
//                     <button className={styles.actionButton}>Close</button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
