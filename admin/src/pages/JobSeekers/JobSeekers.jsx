import { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import styles from "./JobSeekers.module.css";

const JobSeekers = () => {
  const [jobSeekers, setJobSeekers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editData, setEditData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8081/api/candidates")
      .then((res) => res.json())
      .then((data) => setJobSeekers(data.data))
      .catch((error) => console.error("Error fetching job seekers:", error));
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = async (user_id) => {
    if (!user_id) return;
    try {
      await fetch(`http://localhost:8081/api/job_seekers/${user_id}`, {
        method: "DELETE",
      });
      setJobSeekers((prev) =>
        prev.filter((seeker) => seeker.user_id !== user_id)
      );
    } catch (error) {
      console.error("Error deleting job seeker:", error);
    }
  };

  const handleEdit = (seeker) => {
    setEditData({ ...seeker });
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editData) return;
    try {
      const response = await fetch(
        `http://localhost:8081/api/job_seekers/${editData.user_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editData),
        }
      );
      if (response.ok) {
        setJobSeekers((prev) =>
          prev.map((seeker) =>
            seeker.user_id === editData.user_id ? editData : seeker
          )
        );
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating job seeker:", error);
    }
  };

  const filteredJobSeekers = jobSeekers.filter((seeker) =>
    seeker.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.jobSeekers}>
      <div className={styles.header}>
        <h1>Job Seekers</h1>
        <button className={styles.addButton}>
          <FiPlus /> Add Job Seeker
        </button>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search job seekers..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Profile</th>
              <th>Full Name</th>
              <th>Nickname</th>
              <th>Gender</th>
              <th>DOB</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>City</th>
              <th>State</th>
              <th>Work Status</th>
              <th>Experience</th>
              <th>Salary</th>
              <th>Current Post</th>
              <th>Looking For</th>
              <th>Preferred Location</th>
              <th>Education</th>
              <th>Skill</th>
              <th>Languages</th>
              <th>Resume</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobSeekers.map((seeker) => (
              <tr key={seeker.user_id}>
                <td>
                  {seeker.profile_photo ? (
                    <img
                      src={seeker.profile_photo}
                      alt="Profile"
                      width="50"
                      height="50"
                      className={styles.profilePhoto}
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>{seeker.full_name || "N/A"}</td>
                <td>{seeker.nick_name || "N/A"}</td>
                <td>{seeker.gender || "N/A"}</td>
                <td>{seeker.dob || "N/A"}</td>
                <td>{seeker.user_email || "N/A"}</td>
                <td>{seeker.user_mobile || "N/A"}</td>
                <td>{seeker.city || "N/A"}</td>
                <td>{seeker.state || "N/A"}</td>
                <td>{seeker.work_status || "N/A"}</td>
                <td>{seeker.total_experience || "N/A"}</td>
                <td>{seeker.current_salary || "N/A"}</td>
                <td>{seeker.current_post || "N/A"}</td>
                <td>{seeker.looking_for || "N/A"}</td>
                <td>{seeker.preferred_location || "N/A"}</td>
                <td>{seeker.education_details?.join(", ") || "N/A"}</td>
                <td>{seeker.skills?.join(", ") || "N/A"}</td>
                <td>{seeker.languages?.join(", ") || "N/A"}</td>
                <td>
                  {seeker.resume_url ? (
                    <a
                      href={seeker.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Resume
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleEdit(seeker)}
                    className={styles.editButton}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(seeker.user_id)}
                    className={styles.deleteButton}
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Edit Job Seeker</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className={styles.closeButton}
              >
                <FiX />
              </button>
            </div>
            <div className={styles.modalContent}>
              {Object.entries(editData).map(([key, value]) => (
                <div key={key} className={styles.inputGroup}>
                  <label>{key.replace(/_/g, " ").toUpperCase()}</label>
                  <input
                    type="text"
                    value={value || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, [key]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>
            <div className={styles.modalActions}>
              <button onClick={handleUpdate} className={styles.saveButton}>
                Save Changes
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSeekers;

// import { useState, useEffect } from "react";
// import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
// import styles from "./JobSeekers.module.css";

// const JobSeekers = () => {
//   const [jobSeekers, setJobSeekers] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     fetch("http://localhost:8081/api/candidates")
//       .then((res) => res.json())
//       .then((data) => setJobSeekers(data.data))
//       .catch((error) => console.error("Error fetching job seekers:", error));
//   }, []);

//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleDelete = async (user_id) => {
//     if (!user_id) return;
//     try {
//       await fetch(`http://localhost:8081/api/job_seekers/${user_id}`, {
//         method: "DELETE",
//       });
//       setJobSeekers((prev) =>
//         prev.filter((seeker) => seeker.user_id !== user_id)
//       );
//     } catch (error) {
//       console.error("Error deleting job seeker:", error);
//     }
//   };

//   const filteredJobSeekers = jobSeekers.filter((seeker) =>
//     seeker.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className={styles.jobSeekers}>
//       <div className={styles.header}>
//         <h1>Job Seekers</h1>
//         <button className={styles.addButton}>
//           <FiPlus /> Add Job Seeker
//         </button>
//       </div>

//       <div className={styles.searchBar}>
//         <input
//           type="text"
//           placeholder="Search job seekers..."
//           value={searchQuery}
//           onChange={handleSearch}
//         />
//       </div>

//       <div className={styles.tableContainer}>
//         <table className={styles.table}>
//           <thead>
//             <tr>
//               <th>Profile</th>
//               <th>Full Name</th>
//               <th>Nickname</th>
//               <th>Gender</th>
//               <th>DOB</th>
//               <th>Email</th>
//               <th>Mobile</th>
//               <th>City</th>
//               <th>State</th>
//               <th>Work Status</th>
//               <th>Experience</th>
//               <th>Salary</th>
//               <th>Current Post</th>
//               <th>Looking For</th>
//               <th>Preferred Location</th>
//               <th>Education</th>
//               <th>Skill</th>
//               <th>Languages</th>
//               <th>Resume</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredJobSeekers.map((seeker) => (
//               <tr key={seeker.user_id}>
//                 <td>
//                   {seeker.profile_photo ? (
//                     <img
//                       src={seeker.profile_photo}
//                       alt="Profile"
//                       width="50"
//                       height="50"
//                       className={styles.profilePhoto}
//                     />
//                   ) : (
//                     "N/A"
//                   )}
//                 </td>
//                 <td>{seeker.full_name || "N/A"}</td>
//                 <td>{seeker.nick_name || "N/A"}</td>
//                 <td>{seeker.gender || "N/A"}</td>
//                 <td>
//                   {seeker.dob
//                     ? new Date(seeker.dob).toLocaleDateString("en-US", {
//                         year: "numeric",
//                         month: "short",
//                         day: "2-digit",
//                       })
//                     : "N/A"}
//                 </td>
//                 <td>{seeker.user_email || "N/A"}</td>
//                 <td>{seeker.user_mobile || "N/A"}</td>
//                 <td>{seeker.city || "N/A"}</td>
//                 <td>{seeker.state || "N/A"}</td>
//                 <td>{seeker.work_status || "N/A"}</td>
//                 <td>{seeker.total_experience || "N/A"}</td>
//                 <td>{seeker.current_salary || "N/A"}</td>
//                 <td>{seeker.current_post || "N/A"}</td>
//                 <td>{seeker.looking_for || "N/A"}</td>
//                 <td>{seeker.preferred_location || "N/A"}</td>
//                 <td>
//                   {seeker.education_details?.map((edu, index) => (
//                     <div key={index}>{edu}</div>
//                   )) || "N/A"}
//                 </td>
//                 <td>
//                   {Array.isArray(seeker.skills) && seeker.skills.length > 0 ? (
//                     <ul>
//                       {seeker.skills.map((skill, index) => (
//                         <li key={index}>{skill}</li>
//                       ))}
//                     </ul>
//                   ) : (
//                     "N/A"
//                   )}
//                 </td>
//                 <td>
//                   {Array.isArray(seeker.languages) &&
//                   seeker.languages.length > 0 ? (
//                     <ul>
//                       {seeker.languages.map((lang, index) => (
//                         <li key={index}>{lang}</li>
//                       ))}
//                     </ul>
//                   ) : (
//                     "N/A"
//                   )}
//                 </td>
//                 <td>
//                   {seeker.resume_url ? (
//                     <a
//                       href={seeker.resume_url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       View Resume
//                     </a>
//                   ) : (
//                     "N/A"
//                   )}
//                 </td>
//                 <td>
//                   <button
//                     onClick={() => console.log("Edit", seeker)}
//                     className={styles.editButton}
//                   >
//                     <FiEdit2 />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(seeker.user_id)}
//                     className={styles.deleteButton}
//                   >
//                     <FiTrash2 />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default JobSeekers;
