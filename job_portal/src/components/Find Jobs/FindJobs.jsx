import React, { useState, useEffect } from "react";
import { Search, MapPin, Briefcase, Building } from "lucide-react";
import styles from "./FindJobs.module.css";

const FindJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState(new Set()); // Store applied job IDs
  const [filters, setFilters] = useState({
    location: "",
    type: "",
    category: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const userId = localStorage.getItem("user_id");

  // 🔹 Fetch all jobs from the backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/jobs");
        const data = await response.json();

        if (data.status === "success") {
          setJobs(data.jobs);
        } else {
          console.error("Error fetching jobs:", data.message);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  // 🔹 Fetch applied jobs for the logged-in user
  useEffect(() => {
    if (!userId) return;

    const fetchAppliedJobs = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/api/applied-jobs/${userId}`
        );
        const data = await response.json();

        console.log("API Response:", data); // 🔍 Debugging

        if (data.status === "success") {
          if (!Array.isArray(data.appliedJobs)) {
            console.error("Invalid data format:", data.appliedJobs);
            return;
          }

          const appliedJobIds = new Set(data.appliedJobs.map((job) => job.id));
          console.log("Applied Job IDs:", appliedJobIds); // 🔍 Debugging
          setAppliedJobs(appliedJobIds);
        } else {
          console.error("Error fetching applied jobs:", data.message);
        }
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      }
    };

    fetchAppliedJobs();
  }, [userId]);

  // 🔹 Handle Apply Job
  const handleApplyJob = async (jobId) => {
    if (!userId) {
      alert("Please log in to apply for jobs.");
      return;
    }

    if (appliedJobs.has(jobId)) {
      alert("You have already applied for this job.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/api/apply-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          job_id: jobId,
          status: "Applied",
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        // ✅ Create a new Set to trigger state update properly
        setAppliedJobs((prev) => {
          const newSet = new Set(prev);
          newSet.add(jobId);
          return newSet;
        });
      } else {
        console.error("Error applying for job:", data.message);
      }
    } catch (error) {
      console.error("Error applying for job:", error);
    }
  };

  // 🔹 Filter jobs based on search and filters
  const filteredJobs = jobs.filter((job) => {
    return (
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.location ? job.location === filters.location : true) &&
      (filters.type ? job.type === filters.type : true) &&
      (filters.category ? job.category === filters.category : true)
    );
  });

  return (
    <div className={styles.findJobs}>
      <div className={styles.searchSection}>
        <form className={styles.searchBar} onSubmit={(e) => e.preventDefault()}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search jobs by title, skills, or company"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <div className={styles.filters}>
          <select
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
          >
            <option value="">All Locations</option>
            <option value="New York, NY">New York</option>
            <option value="San Francisco, CA">San Francisco</option>
            <option value="Remote">Remote</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          >
            <option value="">All Categories</option>
            <option value="Software Development">Software Development</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>
      </div>

      <div className={styles.jobsList}>
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job.id} className={styles.jobCard}>
              <h3>{job.title}</h3>
              <div className={styles.jobInfo}>
                <span>
                  <Building size={16} /> {job.company}
                </span>
                <span>
                  <MapPin size={16} /> {job.location}
                </span>
                <span>
                  <Briefcase size={16} /> {job.type}
                </span>
              </div>
              <p className={styles.description}>{job.description}</p>
              {job.requirements && job.requirements.length > 0 && (
                <div className={styles.requirements}>
                  <h4>Requirements:</h4>
                  <ul>
                    {job.requirements.split(",").map((req, index) => (
                      <li key={index}>{req.trim()}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={styles.salary}>Salary: {job.salary}</div>
              <button
                className={styles.applyBtn}
                onClick={() => handleApplyJob(job.id)}
                disabled={appliedJobs.has(job.id)}
              >
                {appliedJobs.has(job.id) ? "Applied" : "Apply Now"}
              </button>
            </div>
          ))
        ) : (
          <p>No jobs found.</p>
        )}
      </div>
    </div>
  );
};

export default FindJobs;

// import React, { useState, useEffect } from "react";
// import { Search, MapPin, Briefcase, Building } from "lucide-react";
// import styles from "./FindJobs.module.css";

// const FindJobs = () => {
//   const [jobs, setJobs] = useState([]); // State to store jobs
//   const [filters, setFilters] = useState({
//     location: "",
//     type: "",
//     category: "",
//   });
//   const [searchTerm, setSearchTerm] = useState("");

//   // Fetch jobs from the backend
//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const response = await fetch("http://localhost:8081/api/jobs");
//         // Update with your backend URL
//         const data = await response.json();

//         if (data.status === "success") {
//           setJobs(data.jobs);
//         } else {
//           console.error("Error fetching jobs:", data.message);
//         }
//       } catch (error) {
//         console.error("Error fetching jobs:", error);
//       }
//     };

//     fetchJobs();
//   }, []);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     console.log("Searching with term:", searchTerm);
//     console.log("Filters:", filters);
//   };

//   // Filter jobs based on search term and selected filters
//   const filteredJobs = jobs.filter((job) => {
//     return (
//       job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
//       (filters.location ? job.location === filters.location : true) &&
//       (filters.type ? job.type === filters.type : true) &&
//       (filters.category ? job.category === filters.category : true)
//     );
//   });

//   return (
//     <div className={styles.findJobs}>
//       <div className={styles.searchSection}>
//         <form onSubmit={handleSearch} className={styles.searchBar}>
//           <Search className={styles.searchIcon} />
//           <input
//             type="text"
//             placeholder="Search jobs by title, skills, or company"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <button type="submit">Search</button>
//         </form>

//         <div className={styles.filters}>
//           <select
//             value={filters.location}
//             onChange={(e) =>
//               setFilters({ ...filters, location: e.target.value })
//             }
//           >
//             <option value="">All Locations</option>
//             <option value="New York, NY">New York</option>
//             <option value="San Francisco, CA">San Francisco</option>
//             <option value="Remote">Remote</option>
//           </select>

//           <select
//             value={filters.type}
//             onChange={(e) => setFilters({ ...filters, type: e.target.value })}
//           >
//             <option value="">All Types</option>
//             <option value="Full-time">Full-time</option>
//             <option value="Part-time">Part-time</option>
//             <option value="Contract">Contract</option>
//           </select>

//           <select
//             value={filters.category}
//             onChange={(e) =>
//               setFilters({ ...filters, category: e.target.value })
//             }
//           >
//             <option value="">All Categories</option>
//             <option value="Software Development">Software Development</option>
//             <option value="Design">Design</option>
//             <option value="Marketing">Marketing</option>
//           </select>
//         </div>
//       </div>

//       <div className={styles.jobsList}>
//         {filteredJobs.length > 0 ? (
//           filteredJobs.map((job) => (
//             <div key={job.id} className={styles.jobCard}>
//               <h3>{job.title}</h3>
//               <div className={styles.jobInfo}>
//                 <span>
//                   <Building size={16} /> {job.company}
//                 </span>
//                 <span>
//                   <MapPin size={16} /> {job.location}
//                 </span>
//                 <span>
//                   <Briefcase size={16} /> {job.type}
//                 </span>
//               </div>
//               <p className={styles.description}>{job.description}</p>
//               {job.requirements && job.requirements.length > 0 && (
//                 <div className={styles.requirements}>
//                   <h4>Requirements:</h4>
//                   <ul>
//                     {job.requirements.split(",").map((req, index) => (
//                       <li key={index}>{req.trim()}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//               <div className={styles.salary}>{job.salary}</div>
//               <button className={styles.applyBtn}>Apply Now</button>
//             </div>
//           ))
//         ) : (
//           <p>No jobs found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FindJobs;

// // import React, { useState } from "react";
// // import { Search, MapPin, Briefcase, Building } from "lucide-react";
// // import styles from "./FindJobs.module.css";

// // const MOCK_JOBS = [
// //   {
// //     id: 1,
// //     title: "Senior React Developer",
// //     company: "Tech Corp",
// //     location: "New York, NY",
// //     type: "Full-time",
// //     category: "Software Development",
// //     salary: "$120,000 - $150,000",
// //     description:
// //       "We are looking for an experienced React developer to join our team and help build innovative web applications.",
// //     requirements: [
// //       "At least 5 years of experience with React",
// //       "Strong understanding of JavaScript and modern ES6+ features",
// //       "Experience with state management (Redux, Context API)",
// //       "Knowledge of responsive design and CSS-in-JS solutions",
// //     ],
// //   },
// //   {
// //     id: 2,
// //     title: "UX Designer",
// //     company: "Design Studio",
// //     location: "San Francisco, CA",
// //     type: "Full-time",
// //     category: "Design",
// //     salary: "$90,000 - $120,000",
// //     description:
// //       "Join our creative team as a UX Designer and help shape the future of our digital products.",
// //     requirements: [], // Added an empty requirements array to avoid undefined
// //   },
// // ];

// // const FindJobs = () => {
// //   const [filters, setFilters] = useState({
// //     location: "",
// //     type: "",
// //     category: "",
// //   });

// //   const [searchTerm, setSearchTerm] = useState("");

// //   const handleSearch = (e) => {
// //     e.preventDefault();
// //     console.log("Searching with term:", searchTerm);
// //     console.log("Filters:", filters);
// //   };

// //   return (
// //     <>
// //       <div className={styles.findJobs}>
// //         <div className={styles.searchSection}>
// //           <form onSubmit={handleSearch} className={styles.searchBar}>
// //             <Search className={styles.searchIcon} />
// //             <input
// //               type="text"
// //               placeholder="Search jobs by title, skills, or company"
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //             />
// //             <button type="submit">Search</button>
// //           </form>

// //           <div className={styles.filters}>
// //             <select
// //               value={filters.location}
// //               onChange={(e) =>
// //                 setFilters({ ...filters, location: e.target.value })
// //               }
// //             >
// //               <option value="">All Locations</option>
// //               <option value="new-york">New York</option>
// //               <option value="san-francisco">San Francisco</option>
// //               <option value="remote">Remote</option>
// //             </select>

// //             <select
// //               value={filters.type}
// //               onChange={(e) => setFilters({ ...filters, type: e.target.value })}
// //             >
// //               <option value="">All Types</option>
// //               <option value="full-time">Full-time</option>
// //               <option value="part-time">Part-time</option>
// //               <option value="contract">Contract</option>
// //             </select>

// //             <select
// //               value={filters.category}
// //               onChange={(e) =>
// //                 setFilters({ ...filters, category: e.target.value })
// //               }
// //             >
// //               <option value="">All Categories</option>
// //               <option value="software">Software Development</option>
// //               <option value="design">Design</option>
// //               <option value="marketing">Marketing</option>
// //             </select>
// //           </div>
// //         </div>

// //         <div className={styles.jobsList}>
// //           {MOCK_JOBS.map((job) => (
// //             <div key={job.id} className={styles.jobCard}>
// //               <h3>{job.title}</h3>
// //               <div className={styles.jobInfo}>
// //                 <span>
// //                   <Building size={16} /> {job.company}
// //                 </span>
// //                 <span>
// //                   <MapPin size={16} /> {job.location}
// //                 </span>
// //                 <span>
// //                   <Briefcase size={16} /> {job.type}
// //                 </span>
// //               </div>
// //               <p className={styles.description}>{job.description}</p>
// //               <div className={styles.requirements}>
// //                 <h4>Requirements:</h4>
// //                 <ul>
// //                   {(job.requirements || []).map((req, index) => (
// //                     <li key={index}>{req}</li>
// //                   ))}
// //                 </ul>
// //               </div>
// //               <div className={styles.salary}>{job.salary}</div>
// //               <button className={styles.applyBtn}>Apply Now</button>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default FindJobs;
