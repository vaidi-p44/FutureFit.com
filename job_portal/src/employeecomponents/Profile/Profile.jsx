import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUser,
  FaBriefcase,
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import styles from "./Profile.module.css";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [recruiterProfile, setRecruiterProfile] = useState({
    // name: "John Smith",
    // title: "Senior HR Manager",
    // company: "TechCorp Solutions",
    // email: "john.smith@techcorp.com",
    // phone: "+91 9876543210",
    // location: "Bangalore, India",
    // about:
    //   "Experienced HR professional with over 8 years in tech recruitment. Specialized in hiring for software development, data science, and DevOps roles.",
    postedJobs: [],
  });

  const [selectedJob, setSelectedJob] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleJobEdit = (job) => {
    setSelectedJob(job);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    fetchEmployeeData();
    fetchJobs();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const user_id = localStorage.getItem("user_id");
      if (!user_id) {
        toast.error("User ID not found. Please log in again.");
        return;
      }

      const response = await axios.get(
        `http://localhost:8081/api/employee/${user_id}`
      );

      if (response.data.status === "success") {
        console.log("Fetched employee data:", response.data.data);
        setRecruiterProfile((prevProfile) => ({
          ...prevProfile,
          name: response.data.data.full_name || "N/A",
          hiringFor: response.data.data.hiringFor || "N/A",
          company: response.data.data.companyName || "N/A",
          title: response.data.data.designation || "N/A",
          user_email: response.data.data.user_email || "N/A", // Ensure this field is correctly fetched
          phone: response.data.data.user_mobile || "N/A",
          location: response.data.data.address || "N/A",
          profileLogo: response.data.data.companyLogo || "/default-logo.png",
        }));
      } else {
        console.warn("Employee data not found.");
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
      toast.error("Failed to load employee data.");
    }
  };

  const fetchJobs = async () => {
    try {
      const user_id = localStorage.getItem("user_id");
      if (!user_id) {
        toast.error("User ID not found. Please log in again.");
        return;
      }
      console.log("Fetching jobs for user ID:", user_id);
      const response = await axios.get(
        `http://localhost:8081/api/jobs/user/${user_id}`
      );
      if (response.data.status === "success") {
        setRecruiterProfile((prevProfile) => ({
          ...prevProfile,
          postedJobs: response.data.jobs || [],
        }));
      } else {
        console.warn("No jobs found for this user.");
        setRecruiterProfile((prevProfile) => ({
          ...prevProfile,
          postedJobs: [],
        }));
      }
    } catch (error) {
      console.error(
        "Error fetching jobs:",
        error.response?.data || error.message
      );
      toast.error("Failed to load jobs.");
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const user_id = localStorage.getItem("user_id");
      if (!user_id) {
        toast.error("User ID is missing.");
        return;
      }

      const updatedProfile = {
        name: recruiterProfile.name,
        hiringFor: recruiterProfile.hiringFor,
        company: recruiterProfile.companyName,
        title: recruiterProfile.title,
        user_email: recruiterProfile.user_email,
        phone: recruiterProfile.phone,
        location: recruiterProfile.location,
        profileLogo: recruiterProfile.profileLogo,
      };

      const response = await fetch(
        `http://localhost:8081/api/employee/${user_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProfile),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        toast.success("Profile updated successfully!");
        setEditMode(false);
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating the profile.");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_cloudinary_preset");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/your_cloudinary_name/image/upload",
        formData
      );
      setRecruiterProfile({
        ...recruiterProfile,
        profileLogo: response.data.secure_url,
      });
      toast.success("Profile image updated!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image.");
    }
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8081/api/jobs/${selectedJob.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedJob),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Job updated successfully!");
        setIsEditModalOpen(false);
        window.location.reload(); // Refresh jobs after update
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileSection}>
        <div className={styles.profileHeader}>
          <div className={styles.profileInfo}>
            <div className={styles.profileAvatar}>
              <img src={recruiterProfile.profileLogo} alt="" />
            </div>
            <div className={styles.profileDetails}>
              {editMode ? (
                <>
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />

                  <input
                    type="text"
                    value={recruiterProfile.hiringFor}
                    onChange={(e) =>
                      setRecruiterProfile({
                        ...recruiterProfile,
                        hiringFor: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    value={recruiterProfile.title}
                    onChange={(e) =>
                      setRecruiterProfile({
                        ...recruiterProfile,
                        title: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    value={recruiterProfile.company}
                    onChange={(e) =>
                      setRecruiterProfile({
                        ...recruiterProfile,
                        company: e.target.value,
                      })
                    }
                  />
                  <input
                    type="email"
                    value={recruiterProfile.user_email}
                    onChange={(e) =>
                      setRecruiterProfile({
                        ...recruiterProfile,
                        user_email: e.target.value,
                      })
                    }
                  />

                  <input
                    type="text"
                    value={recruiterProfile.phone}
                    onChange={(e) =>
                      setRecruiterProfile({
                        ...recruiterProfile,
                        phone: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    value={recruiterProfile.location}
                    onChange={(e) =>
                      setRecruiterProfile({
                        ...recruiterProfile,
                        location: e.target.value,
                      })
                    }
                  />
                  <button
                    className={styles.saveButton}
                    onClick={handleProfileUpdate}
                  >
                    <FaSave /> Save
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={() => setEditMode(false)}
                  >
                    <FaTimes /> Cancel
                  </button>
                </>
              ) : (
                <>
                  <h2>{recruiterProfile.hiringFor}</h2>
                  <div className={styles.profileMeta}>
                    <span>
                      <FaBriefcase /> {recruiterProfile.title}
                    </span>
                    <span>
                      <FaBuilding /> {recruiterProfile.company}
                    </span>
                    <span>
                      <FaMapMarkerAlt /> {recruiterProfile.location}
                    </span>
                  </div>
                  <div className={styles.profileContact}>
                    <span>
                      <FaEnvelope /> {recruiterProfile.user_email}
                    </span>
                    <span>
                      <FaPhone /> {recruiterProfile.phone}
                    </span>
                  </div>
                  <button
                    className={styles.editButton}
                    onClick={() => setEditMode(true)}
                  >
                    <FaEdit /> Edit
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className={styles.profileBody}>
          {/* <div className={styles.aboutSection}>
            <h3>About</h3>
            <p>{recruiterProfile.about}</p>
          </div> */}

          <div className={styles.postedJobs}>
            <h3>Posted Jobs</h3>
            {recruiterProfile.postedJobs.length === 0 ? (
              <p>No jobs posted yet.</p>
            ) : (
              <div className={styles.jobsGrid}>
                {recruiterProfile.postedJobs.map((job) => (
                  <div key={job.id} className={styles.jobCard}>
                    <div className={styles.jobHeader}>
                      <h1>{job.title}</h1>
                      <button
                        className={styles.editButton}
                        onClick={() => handleJobEdit(job)}
                      >
                        <FaEdit /> Edit
                      </button>
                    </div>
                    <div className={styles.jobDetails}>
                      <p className={styles.jobDetail}>
                        <strong>Company:</strong> {job.company}
                      </p>
                      <p className={styles.jobDetail}>
                        <strong>Location:</strong> {job.location}
                      </p>
                      <p className={styles.jobDetail}>
                        <strong>Type:</strong> {job.type}
                      </p>
                      <p className={styles.jobDetail}>
                        <strong>Category:</strong> {job.category}
                      </p>
                      <p className={styles.jobDetail}>
                        <strong>Experience:</strong> {job.experience}
                      </p>
                      <p className={styles.jobDetail}>
                        <strong>Salary:</strong> {job.salary}
                      </p>
                      <p className={styles.jobDescription}>
                        <strong>Description:</strong> {job.description}
                      </p>
                      <p className={styles.jobDetail}>
                        <strong>Requirements:</strong> {job.requirements}
                      </p>
                      <p className={styles.jobDetail}>
                        <strong>Benefits:</strong> {job.benefits}
                      </p>
                      <p className={styles.jobDetail}>
                        <strong>status:</strong> {job.status}
                      </p>
                    </div>
                    <div className={styles.jobFooter}>
                      <span>
                        <strong>Posted On:</strong>{" "}
                        {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
      {isEditModalOpen && ( // Add modal here
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Edit Job</h3>
            <form onSubmit={handleUpdateJob}>
              <input
                type="text"
                placeholder="Title"
                value={selectedJob?.title || ""}
                onChange={(e) =>
                  setSelectedJob({ ...selectedJob, title: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Company"
                value={selectedJob?.company || ""}
                onChange={(e) =>
                  setSelectedJob({ ...selectedJob, company: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Location"
                value={selectedJob?.location || ""}
                onChange={(e) =>
                  setSelectedJob({ ...selectedJob, location: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Type"
                value={selectedJob?.type || ""}
                onChange={(e) =>
                  setSelectedJob({ ...selectedJob, type: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Category"
                value={selectedJob?.category || ""}
                onChange={(e) =>
                  setSelectedJob({ ...selectedJob, category: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Experience"
                value={selectedJob?.experience || ""}
                onChange={(e) =>
                  setSelectedJob({ ...selectedJob, experience: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Salary"
                value={selectedJob?.salary || ""}
                onChange={(e) =>
                  setSelectedJob({ ...selectedJob, salary: e.target.value })
                }
              />
              <textarea
                placeholder="Description"
                value={selectedJob?.description || ""}
                onChange={(e) =>
                  setSelectedJob({
                    ...selectedJob,
                    description: e.target.value,
                  })
                }
              />
              <textarea
                placeholder="Requirements"
                value={selectedJob?.requirements || ""}
                onChange={(e) =>
                  setSelectedJob({
                    ...selectedJob,
                    requirements: e.target.value,
                  })
                }
              />
              <textarea
                placeholder="Benefits"
                value={selectedJob?.benefits || ""}
                onChange={(e) =>
                  setSelectedJob({ ...selectedJob, benefits: e.target.value })
                }
              />
              <select
                value={selectedJob?.status || ""}
                onChange={(e) =>
                  setSelectedJob({ ...selectedJob, status: e.target.value })
                }
              >
                <option value="">Select Status</option>
                <option value="active">active</option>
                <option value="closed">Closed</option>
              </select>
              <div className={styles.modalButtons}>
                <button type="submit">Update Job</button>
                <button onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   FaUser,
//   FaBriefcase,
//   FaBuilding,
//   FaEnvelope,
//   FaPhone,
//   FaMapMarkerAlt,
//   FaEdit,
// } from "react-icons/fa";
// import { toast, ToastContainer } from "react-toastify";
// import styles from "./Profile.module.css";
// import "react-toastify/dist/ReactToastify.css";

// const Profile = () => {
//   const [editMode, setEditMode] = useState(false);
//   const [editingJob, setEditingJob] = useState(null);
//   const [recruiterProfile, setRecruiterProfile] = useState({
//     name: "John Smith",
//     title: "Senior HR Manager",
//     company: "TechCorp Solutions",
//     email: "john.smith@techcorp.com",
//     phone: "+91 9876543210",
//     location: "Bangalore, India",
//     about:
//       "Experienced HR professional with over 8 years in tech recruitment. Specialized in hiring for software development, data science, and DevOps roles.",
//     postedJobs: [],
//   });

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   const fetchJobs = async () => {
//     try {
//       const user_id = localStorage.getItem("user_id");

//       if (!user_id) {
//         toast.error("User ID not found. Please log in again.");
//         return;
//       }

//       console.log("Fetching jobs for user ID:", user_id);

//       const response = await axios.get(
//         `http://localhost:8081/api/jobs/user/${user_id}`
//       );

//       if (response.data.status === "success") {
//         setRecruiterProfile((prevProfile) => ({
//           ...prevProfile,
//           postedJobs: response.data.jobs || [],
//         }));
//       } else {
//         console.warn("No jobs found for this user.");
//         setRecruiterProfile((prevProfile) => ({
//           ...prevProfile,
//           postedJobs: [],
//         }));
//       }
//     } catch (error) {
//       console.error(
//         "Error fetching jobs:",
//         error.response?.data || error.message
//       );
//       toast.error("Failed to load jobs.");
//     }
//   };

//   const handleProfileEdit = () => {
//     setEditMode(true);
//   };

//   const handleProfileSave = () => {
//     setEditMode(false);
//     toast.success("Profile updated successfully!");
//   };

//   const handleJobEdit = (job) => {
//     setEditingJob({ ...job });
//   };

//   const handleJobUpdate = async () => {
//     if (!editingJob) return;

//     try {
//       const response = await axios.put(
//         `http://localhost:8081/jobs/${editingJob.id}`,
//         editingJob
//       );

//       if (response.data.status === "success") {
//         const updatedJobs = recruiterProfile.postedJobs.map((job) =>
//           job.id === editingJob.id ? editingJob : job
//         );

//         setRecruiterProfile({
//           ...recruiterProfile,
//           postedJobs: updatedJobs,
//         });

//         setEditingJob(null);
//         toast.success("Job updated successfully!");
//       } else {
//         toast.error("Failed to update job.");
//       }
//     } catch (error) {
//       console.error("Error updating job:", error);
//       toast.error("Error updating job.");
//     }
//   };

//   return (
//     <div className={styles.profilePage}>
//       <div className={styles.profileSection}>
//         <div className={styles.profileHeader}>
//           <div className={styles.profileInfo}>
//             <div className={styles.profileAvatar}>
//               <FaUser size={40} />
//             </div>
//             <div className={styles.profileDetails}>
//               {editMode ? (
//                 <div className={styles.editForm}>
//                   <input
//                     type="text"
//                     value={recruiterProfile.name}
//                     onChange={(e) =>
//                       setRecruiterProfile({
//                         ...recruiterProfile,
//                         name: e.target.value,
//                       })
//                     }
//                     className={styles.editInput}
//                   />
//                   <input
//                     type="text"
//                     value={recruiterProfile.title}
//                     onChange={(e) =>
//                       setRecruiterProfile({
//                         ...recruiterProfile,
//                         title: e.target.value,
//                       })
//                     }
//                     className={styles.editInput}
//                   />
//                 </div>
//               ) : (
//                 <>
//                   <h2>{recruiterProfile.name}</h2>
//                   <div className={styles.profileMeta}>
//                     <span>
//                       <FaBriefcase /> {recruiterProfile.title}
//                     </span>
//                     <span>
//                       <FaBuilding /> {recruiterProfile.company}
//                     </span>
//                     <span>
//                       <FaMapMarkerAlt /> {recruiterProfile.location}
//                     </span>
//                   </div>
//                 </>
//               )}
//               <div className={styles.profileContact}>
//                 <span>
//                   <FaEnvelope /> {recruiterProfile.email}
//                 </span>
//                 <span>
//                   <FaPhone /> {recruiterProfile.phone}
//                 </span>
//               </div>
//             </div>
//             <button
//               className={styles.editButton}
//               onClick={editMode ? handleProfileSave : handleProfileEdit}
//             >
//               {editMode ? "Save" : <FaEdit />}
//             </button>
//           </div>
//         </div>

//         <div className={styles.profileBody}>
//           <div className={styles.aboutSection}>
//             <h3>About</h3>
//             {editMode ? (
//               <textarea
//                 value={recruiterProfile.about}
//                 onChange={(e) =>
//                   setRecruiterProfile({
//                     ...recruiterProfile,
//                     about: e.target.value,
//                   })
//                 }
//                 className={styles.editTextarea}
//               />
//             ) : (
//               <p>{recruiterProfile.about}</p>
//             )}
//           </div>

//           <div className={styles.postedJobs}>
//             <h3>Posted Jobs</h3>
//             {recruiterProfile.postedJobs.length === 0 ? (
//               <p>No jobs posted yet.</p>
//             ) : (
//               <div className={styles.jobsGrid}>
//                 {recruiterProfile.postedJobs.map((job) => (
//                   <div key={job.id} className={styles.jobCard}>
//                     {editingJob?.id === job.id ? (
//                       <div className={styles.jobEditForm}>
//                         <input
//                           type="text"
//                           value={editingJob.title}
//                           onChange={(e) =>
//                             setEditingJob({
//                               ...editingJob,
//                               title: e.target.value,
//                             })
//                           }
//                           className={styles.editInput}
//                           placeholder="Job Title"
//                         />
//                         <input
//                           type="text"
//                           value={editingJob.location}
//                           onChange={(e) =>
//                             setEditingJob({
//                               ...editingJob,
//                               location: e.target.value,
//                             })
//                           }
//                           className={styles.editInput}
//                           placeholder="Location"
//                         />
//                         <input
//                           type="text"
//                           value={editingJob.salary}
//                           onChange={(e) =>
//                             setEditingJob({
//                               ...editingJob,
//                               salary: e.target.value,
//                             })
//                           }
//                           className={styles.editInput}
//                           placeholder="Salary"
//                         />
//                         <textarea
//                           value={editingJob.description}
//                           onChange={(e) =>
//                             setEditingJob({
//                               ...editingJob,
//                               description: e.target.value,
//                             })
//                           }
//                           className={styles.editTextarea}
//                           placeholder="Job Description"
//                         />
//                         <div className={styles.editActions}>
//                           <button
//                             onClick={handleJobUpdate}
//                             className={styles.saveBtn}
//                           >
//                             Save Changes
//                           </button>
//                           <button
//                             onClick={() => setEditingJob(null)}
//                             className={styles.cancelBtn}
//                           >
//                             Cancel
//                           </button>
//                         </div>
//                       </div>
//                     ) : (
//                       <>
//                         <div className={styles.jobHeader}>
//                           <h4>{job.title}</h4>
//                           <button
//                             className={styles.editButton}
//                             onClick={() => handleJobEdit(job)}
//                           >
//                             <FaEdit />
//                           </button>
//                         </div>
//                         <div className={styles.jobDetails}>
//                           <p>Location: {job.location}</p>
//                           <p>Salary: {job.salary}</p>
//                           <p>{job.description}</p>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default Profile;
