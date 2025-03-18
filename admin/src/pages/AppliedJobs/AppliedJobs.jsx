import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AppliedJobs.module.css";

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [searchCompany, setSearchCompany] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/applied-jobs");
        setApplications(res.data.appliedJobs);
      } catch (err) {
        console.error("Error fetching applied jobs:", err);
        setError("Failed to load applied jobs.");
      }
    };
    fetchAppliedJobs();
  }, []);

  const handleClearFilters = () => {
    setSearchName("");
    setSearchTitle("");
    setSearchCompany("");
    setStatusFilter("All");
  };

  const filteredApplications = applications.filter((app) => {
    const matchesName = app.full_name
      ?.toLowerCase()
      .includes(searchName.toLowerCase());
    const matchesTitle = app.title
      ?.toLowerCase()
      .includes(searchTitle.toLowerCase());
    const matchesCompany = app.company
      ?.toLowerCase()
      .includes(searchCompany.toLowerCase());
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    return matchesName && matchesTitle && matchesCompany && matchesStatus;
  });

  return (
    <div className={styles.appliedJobs}>
      <div className={styles.header}>
        <h1>All Applied Jobs</h1>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Search by name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by job title"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by company"
            value={searchCompany}
            onChange={(e) => setSearchCompany(e.target.value)}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.statusFilter}
          >
            <option value="All">All Status</option>
            <option value="Pending">Applied</option>
            <option value="On-Hold">Under Review</option>
            <option value="Shortlisted">Interview Scheduled</option>
            <option value="Rejected">Rejected</option>
            <option value="Hired">Hired</option>
          </select>
          <button onClick={handleClearFilters} className={styles.clearButton}>
            Clear Filters
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Job Seeker</th>
              <th>Email</th>
              <th>Job Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Applied Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((application) => (
              <tr key={application.id}>
                <td>{application.full_name || "N/A"}</td>
                <td>{application.user_email || "N/A"}</td>
                <td>{application.title || "N/A"}</td>
                <td>{application.company || "N/A"}</td>
                <td>{application.location || "N/A"}</td>
                <td>{application.applied_date || "N/A"}</td>
                <td className={styles.status}>{application.status || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppliedJobs;

// import { useState } from "react";
// import { FiEdit2, FiEye } from "react-icons/fi";
// import styles from "./AppliedJobs.module.css";

// const AppliedJobs = () => {
//   const [applications, setApplications] = useState([
//     {
//       id: 1,
//       jobTitle: "Senior React Developer",
//       company: "Tech Corp",
//       applicantName: "John Smith",
//       email: "john@example.com",
//       appliedDate: "2024-03-10",
//       status: "Pending",
//     },
//     {
//       id: 2,
//       jobTitle: "UI/UX Designer",
//       company: "Design Studio",
//       applicantName: "Sarah Johnson",
//       email: "sarah@example.com",
//       appliedDate: "2024-03-12",
//       status: "On-Hold",
//     },
//   ]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [showModal, setShowModal] = useState(false);
//   const [selectedApplication, setSelectedApplication] = useState(null);

//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const filteredApplications = applications.filter((app) => {
//     const matchesSearch =
//       app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       app.applicantName.toLowerCase().includes(searchQuery.toLowerCase());

//     const matchesStatus = statusFilter === "All" || app.status === statusFilter;

//     return matchesSearch && matchesStatus;
//   });

//   const handleStatusChange = (id, newStatus) => {
//     setApplications(
//       applications.map((app) =>
//         app.id === id ? { ...app, status: newStatus } : app
//       )
//     );
//   };

//   const handleViewDetails = (application) => {
//     setSelectedApplication(application);
//     setShowModal(true);
//   };

//   return (
//     <div className={styles.appliedJobs}>
//       <div className={styles.header}>
//         <h1>Applied Jobs</h1>
//         <div className={styles.filters}>
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className={styles.statusFilter}
//           >
//             <option value="All">All Status</option>
//             <option value="Pending">Pending</option>
//             <option value="On-Hold">On-Hold</option>
//             <option value="Shortlisted">Shortlisted</option>
//             <option value="Rejected">Rejected</option>
//             <option value="Hired">Hired</option>
//           </select>
//         </div>
//       </div>

//       <div className={styles.searchBar}>
//         <input
//           type="text"
//           placeholder="Search applications..."
//           value={searchQuery}
//           onChange={handleSearch}
//         />
//       </div>

//       <div className={styles.tableContainer}>
//         <table className={styles.table}>
//           <thead>
//             <tr>
//               <th>Job Title</th>
//               <th>Company</th>
//               <th>Applicant Name</th>
//               <th>Email</th>
//               <th>Applied Date</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredApplications.map((application) => (
//               <tr key={application.id}>
//                 <td>{application.jobTitle}</td>
//                 <td>{application.company}</td>
//                 <td>{application.applicantName}</td>
//                 <td>{application.email}</td>
//                 <td>{application.appliedDate}</td>
//                 <td>
//                   <select
//                     value={application.status}
//                     onChange={(e) =>
//                       handleStatusChange(application.id, e.target.value)
//                     }
//                     className={`${styles.statusSelect} ${
//                       styles[application.status.toLowerCase()]
//                     }`}
//                   >
//                     <option value="Pending">Pending</option>
//                     <option value="On-Hold">On-Hold</option>
//                     <option value="Shortlisted">Shortlisted</option>
//                     <option value="Rejected">Rejected</option>
//                     <option value="Hired">Hired</option>
//                   </select>
//                 </td>
//                 <td className={styles.actions}>
//                   <button
//                     onClick={() => handleViewDetails(application)}
//                     className={styles.viewButton}
//                   >
//                     <FiEye />
//                   </button>
//                   <button
//                     onClick={() =>
//                       handleStatusChange(application.id, application.status)
//                     }
//                     className={styles.editButton}
//                   >
//                     <FiEdit2 />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {showModal && selectedApplication && (
//         <div className={styles.modal}>
//           <div className={styles.modalContent}>
//             <h2>Application Details</h2>
//             <div className={styles.applicationDetails}>
//               <div className={styles.detailGroup}>
//                 <label>Job Title:</label>
//                 <p>{selectedApplication.jobTitle}</p>
//               </div>
//               <div className={styles.detailGroup}>
//                 <label>Company:</label>
//                 <p>{selectedApplication.company}</p>
//               </div>
//               <div className={styles.detailGroup}>
//                 <label>Applicant Name:</label>
//                 <p>{selectedApplication.applicantName}</p>
//               </div>
//               <div className={styles.detailGroup}>
//                 <label>Email:</label>
//                 <p>{selectedApplication.email}</p>
//               </div>
//               <div className={styles.detailGroup}>
//                 <label>Applied Date:</label>
//                 <p>{selectedApplication.appliedDate}</p>
//               </div>
//               <div className={styles.detailGroup}>
//                 <label>Status:</label>
//                 <p
//                   className={`${styles.status} ${
//                     styles[selectedApplication.status.toLowerCase()]
//                   }`}
//                 >
//                   {selectedApplication.status}
//                 </p>
//               </div>
//             </div>
//             <div className={styles.modalActions}>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className={styles.closeButton}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AppliedJobs;
