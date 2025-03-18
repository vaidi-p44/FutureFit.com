import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, MapPin, User } from "lucide-react";
import styles from "./FindTalent.module.css";

const FindTalent = () => {
  const [filters, setFilters] = useState({
    location: "",
    role: "",
    experience: "",
  });
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/candidates"
        );
        setCandidates(response.data.data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching with term:", searchTerm);
    console.log("Filters:", filters);
  };

  return (
    <div className={styles.findTalent}>
      <div className={styles.searchSection}>
        <form onSubmit={handleSearch} className={styles.searchBar}>
          <div className={styles.input}>
            <Search className={styles.icon} />
            <input
              className={styles.inputField}
              type="text"
              placeholder="Search candidates by skills or title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Search</button>
          </div>
        </form>

        <div className={styles.filters}>
          <select
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
          >
            <option value="">All Locations</option>
            <option value="new-york">New York</option>
            <option value="san-francisco">San Francisco</option>
            <option value="remote">Remote</option>
          </select>

          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          >
            <option value="">All Roles</option>
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
            <option value="manager">Manager</option>
          </select>

          <select
            value={filters.experience}
            onChange={(e) =>
              setFilters({ ...filters, experience: e.target.value })
            }
          >
            <option value="">Any Experience</option>
            <option value="entry">Entry Level (0-2 years)</option>
            <option value="mid">Mid Level (3-5 years)</option>
            <option value="senior">Senior Level (5+ years)</option>
          </select>
        </div>
      </div>

      <div className={styles.candidatesList}>
        {candidates.length > 0 ? (
          candidates.map((candidate) => (
            <div key={candidate.user_id} className={styles.candidateCard}>
              <div className={styles.header}>
                <div className={styles.avatar}>
                  {candidate.profile_photo ? (
                    <img
                      src={candidate.profile_photo}
                      alt={candidate.full_name}
                      className={styles.profileImg}
                    />
                  ) : (
                    <User size={32} />
                  )}
                </div>
                <div className={styles.mainInfo}>
                  <h3>{candidate.full_name}</h3>
                  <p className={styles.title}>{candidate.work_status}</p>
                </div>
              </div>

              <div className={styles.details}>
                <span>
                  <MapPin size={16} /> {candidate.city}, {candidate.state}
                </span>
              </div>

              <div className={styles.skills}>
                {candidate.skills ? (
                  candidate.skills.split(",").map((skill, index) => (
                    <span key={index} className={styles.skill}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <p>No skills listed</p>
                )}
              </div>

              <div className={styles.availability}>
                <p>Available: {candidate.available_time || "Not specified"}</p>
              </div>

              <button className={styles.contactBtn}>Contact Candidate</button>
            </div>
          ))
        ) : (
          <p>No candidates found.</p>
        )}
      </div>
    </div>
  );
};

export default FindTalent;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Search, MapPin, Briefcase, User } from "lucide-react";
// import styles from "./FindTalent.module.css";

// const FindTalent = () => {
//   const [filters, setFilters] = useState({
//     location: "",
//     role: "",
//     experience: "",
//   });
//   const [cData, setcData] = useState({});
//   const [forceRender, setForceRender] = useState(false);
//   const [candidates, setCandidates] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     const fetchCareerPreferencesData = async () => {
//       const user_id = localStorage.getItem("user_id");

//       if (!user_id) {
//         console.error("User ID not found in local storage.");
//         return;
//       }

//       try {
//         const response = await axios.get(
//           `http://localhost:8081/api/CareerPreferences/${user_id}`
//         );
//         console.log(
//           "Fetched Career Preferences:",
//           response.data?.data || response.data
//         );
//         // setcData(careerPreferencesResponse.data.data[0] || {});
//         setcData(response.data.data[0] || {});
//       } catch (error) {
//         console.error("Failed to fetch career preferences data:", error);
//       }
//     };

//     const fetchCandidates = async () => {
//       const user_id = localStorage.getItem("user_id");
//       console.log("Fetched user_id:", user_id); // Debugging

//       if (!user_id) {
//         console.error("User ID not found in local storage.");
//         return;
//       }

//       try {
//         // Fetch data from aboutyou table
//         const aboutYouRes = await axios.get(
//           `http://localhost:8081/api/aboutyou/${user_id}`
//         );
//         console.log("Fetched AboutYou Data:", aboutYouRes.data);

//         // Fetch skills from skill_or_languages table
//         const skillsRes = await axios.get(
//           `http://localhost:8081/api/skill_or_languages/${user_id}?type=skill`
//         );
//         console.log("Fetched Skills Data:", skillsRes.data);

//         // Fetch availability from careerpreferences table
//         // const careerRes = await axios.get(
//         //   `http://localhost:8081/api/careerpreferences/${user_id}`
//         // );
//         // console.log("Fetched Career Preferences:", careerRes.data);

//         if (aboutYouRes.data && skillsRes.data) {
//           const candidate = {
//             id: user_id,
//             full_name: aboutYouRes.data.data?.full_name || "N/A",
//             profile_photo: aboutYouRes.data.data?.profile_photo || "",
//             state: aboutYouRes.data.data?.state || "Unknown",
//             city: aboutYouRes.data.data?.city || "Unknown",
//             workstatus: aboutYouRes.data.data?.work_status || "Not specified",
//             skills: skillsRes.data.data
//               ? skillsRes.data.data.map((item) => item.skill_or_language).flat()
//               : [],
//             // availability:
//             //   careerRes.data.data?.available_time || "Not specified",
//           };

//           setCandidates([candidate]); // Store the fetched candidate data
//         }
//       } catch (error) {
//         console.error("Error fetching candidates:", error);
//       }
//     };
//     fetchCareerPreferencesData();
//     fetchCandidates();
//   }, []);
//   useEffect(() => {
//     console.log("Updated career preferences data:", cData);
//     setForceRender((prev) => !prev); // Force re-render on data change
//   }, [cData]);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     console.log("Searching with term:", searchTerm);
//     console.log("Filters:", filters);
//   };

//   return (
//     <div className={styles.findTalent}>
//       <div className={styles.searchSection}>
//         <form onSubmit={handleSearch} className={styles.searchBar}>
//           <div className={styles.input}>
//             <Search className={styles.icon} />
//             <input
//               className={styles.inputField}
//               type="text"
//               placeholder="Search candidates by skills or title"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <button type="submit">Search</button>
//           </div>
//         </form>

//         <div className={styles.filters}>
//           <select
//             value={filters.location}
//             onChange={(e) =>
//               setFilters({ ...filters, location: e.target.value })
//             }
//           >
//             <option value="">All Locations</option>
//             <option value="new-york">New York</option>
//             <option value="san-francisco">San Francisco</option>
//             <option value="remote">Remote</option>
//           </select>

//           <select
//             value={filters.role}
//             onChange={(e) => setFilters({ ...filters, role: e.target.value })}
//           >
//             <option value="">All Roles</option>
//             <option value="developer">Developer</option>
//             <option value="designer">Designer</option>
//             <option value="manager">Manager</option>
//           </select>

//           <select
//             value={filters.experience}
//             onChange={(e) =>
//               setFilters({ ...filters, experience: e.target.value })
//             }
//           >
//             <option value="">Any Experience</option>
//             <option value="entry">Entry Level (0-2 years)</option>
//             <option value="mid">Mid Level (3-5 years)</option>
//             <option value="senior">Senior Level (5+ years)</option>
//           </select>
//         </div>
//       </div>

//       <div className={styles.candidatesList}>
//         {candidates.length > 0 ? (
//           candidates.map((candidate) => (
//             <div key={candidate.id} className={styles.candidateCard}>
//               <div className={styles.header}>
//                 <div className={styles.avatar}>
//                   {candidate.profile_photo ? (
//                     <img
//                       src={candidate.profile_photo}
//                       alt={candidate.full_name}
//                       className={styles.profileImg}
//                     />
//                   ) : (
//                     <User size={32} />
//                   )}
//                 </div>
//                 <div className={styles.mainInfo}>
//                   <h3>{candidate.full_name}</h3>
//                   <p className={styles.title}>{candidate.workstatus}</p>
//                 </div>
//               </div>

//               <div className={styles.details}>
//                 <span>
//                   <MapPin size={16} /> {candidate.city}, {candidate.state}
//                 </span>
//               </div>

//               <div className={styles.skills}>
//                 {candidate.skills.length > 0 ? (
//                   candidate.skills.map((skill, index) => (
//                     <span key={index} className={styles.skill}>
//                       {skill}
//                     </span>
//                   ))
//                 ) : (
//                   <p>No skills listed</p>
//                 )}
//               </div>
//               {cData && Object.keys(cData).length > 0 ? (
//                 <div className={styles.availability}>
//                   <p>Available: {cData.available_time || "Not Provided"}</p>
//                 </div>
//               ) : (
//                 <p></p>
//               )}
//               <button className={styles.contactBtn}>Contact Candidate</button>
//             </div>
//           ))
//         ) : (
//           <p>No candidates found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FindTalent;

// // import React, { useState, useEffect } from "react";
// // import { Search, MapPin, Briefcase, User } from "lucide-react";
// // import styles from "./FindTalent.module.css";

// // const MOCK_CANDIDATES = [
// //   {
// //     id: 1,
// //     name: "John Doe",
// //     title: "Senior React Developer",
// //     location: "New York, NY",
// //     experience: "8 years",
// //     skills: ["React", "TypeScript", "Node.js", "AWS"],
// //     summary:
// //       "Experienced full-stack developer with a focus on React and modern JavaScript.",
// //     availability: "Immediately",
// //     preferredRole: "Full-time",
// //   },
// //   {
// //     id: 2,
// //     name: "Jane Smith",
// //     title: "UX/UI Designer",
// //     location: "San Francisco, CA",
// //     experience: "5 years",
// //     skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
// //     summary:
// //       "Creative designer with a strong focus on user-centered design principles.",
// //     availability: "2 weeks",
// //     preferredRole: "Full-time",
// //   },
// // ];

// // const FindTalent = () => {
// //   const [filters, setFilters] = useState({
// //     location: "",
// //     role: "",
// //     experience: "",
// //   });
// //   const [userData, setUserData] = useState(null);
// //   const [eData, seteData] = useState([]);
// //   const [cData, setcData] = useState({});
// //   const [skillsData, setSkillsData] = useState([]);
// //   const [langData, setlangData] = useState([]);
// //   const [resumeData, setResumeData] = useState(null);

// //   useEffect(() => {
// //     const fetchUserData = async () => {
// //       const user_id = localStorage.getItem("user_id");
// //       console.log("Fetched user_id:", user_id); // Debugging

// //       if (!user_id) {
// //         console.error("User ID not found in local storage.");
// //         return;
// //       }

// //       try {
// //         const response = await axios.get(
// //           `http://localhost:8081/api/Aboutyou/${user_id}`
// //         );
// //         console.log("API Response:", response.data); // Debugging
// //         if (response.data?.data) {
// //           setUserData(response.data.data); // Adjust if API wraps data
// //         } else {
// //           setUserData(response.data); // Directly set data
// //         }
// //       } catch (error) {
// //         console.error("Failed to fetch user data:", error);
// //       }
// //     };

// //     const fetchCareerPreferencesData = async () => {
// //       const user_id = localStorage.getItem("user_id");

// //       if (!user_id) {
// //         console.error("User ID not found in local storage.");
// //         return;
// //       }

// //       try {
// //         const response = await axios.get(
// //           `http://localhost:8081/api/CareerPreferences/${user_id}`
// //         );
// //         console.log(
// //           "Fetched Career Preferences:",
// //           response.data?.data || response.data
// //         );
// //         // setcData(careerPreferencesResponse.data.data[0] || {});
// //         setcData(response.data.data[0] || {});
// //       } catch (error) {
// //         console.error("Failed to fetch career preferences data:", error);
// //       }
// //     };

// //     const fetcheducationData = async () => {
// //       const user_id = localStorage.getItem("user_id");

// //       if (!user_id) {
// //         console.error("User ID not found in local storage.");
// //         return;
// //       }

// //       try {
// //         const response = await axios.get(
// //           `http://localhost:8081/api/EducationForm/${user_id}`
// //         );
// //         console.log("API Response:", response.data);
// //         seteData(response.data?.data || []); // Ensure skills exist in data
// //       } catch (error) {
// //         console.error("Failed to fetch education data:", error.message);
// //       }
// //     };
// //     const fetchSkillsData = async () => {
// //       const user_id = localStorage.getItem("user_id");

// //       if (!user_id) {
// //         console.error("User ID is missing. Please log in.");
// //         return;
// //       }

// //       try {
// //         const response = await axios.get(
// //           `http://localhost:8081/api/skill_or_languages/${user_id}?type=skill`
// //         );
// //         if (response.data.status === "success") {
// //           // Extract and flatten skill_or_language arrays from API response
// //           const skillsArray = response.data.data
// //             .map((item) => item.skill_or_language)
// //             .flat();
// //           setSkillsData(skillsArray || []);
// //         } else {
// //           console.error("Failed to fetch skills:", response.data.message);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching skills data:", error);
// //       }
// //     };

// //     const fetchlanguageData = async () => {
// //       const user_id = localStorage.getItem("user_id");

// //       if (!user_id) {
// //         console.error("User ID is missing. Please log in.");
// //         return;
// //       }

// //       try {
// //         const response = await axios.get(
// //           `http://localhost:8081/api/skill_or_languages/${user_id}?type=language`
// //         );
// //         if (response.data.status === "success") {
// //           // Extract and flatten skill_or_language arrays from API response
// //           const langArray = response.data.data
// //             .map((item) => item.skill_or_language)
// //             .flat();
// //           setlangData(langArray || []);
// //         } else {
// //           console.error("Failed to fetch languages:", response.data.message);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching language data:", error);
// //       }
// //     };
// //     const fetchResumeData = async () => {
// //       const userId = localStorage.getItem("user_id");
// //       if (!userId) {
// //         setError("User ID not found.");
// //         return;
// //       }

// //       try {
// //         const response = await axios.get(
// //           `http://localhost:8081/api/Resume/${userId}`
// //         );
// //         console.log("Resume Data:", response.data);
// //         if (response.status === 200) {
// //           setResumeData(response.data);
// //         } else {
// //           setError("Resume not found for this user.");
// //         }
// //       } catch (err) {
// //         setError("Failed to fetch resume.");
// //         console.error(err);
// //       }
// //     };

// //     fetchUserData();
// //     fetchCareerPreferencesData();
// //     fetcheducationData();
// //     fetchSkillsData();
// //     fetchlanguageData();
// //     fetchResumeData();
// //   }, []);

// //   const [searchTerm, setSearchTerm] = useState("");

// //   const handleSearch = (e) => {
// //     e.preventDefault();
// //     console.log("Searching with term:", searchTerm);
// //     console.log("Filters:", filters);
// //   };

// //   return (
// //     <div className={styles.findTalent}>
// //       <div className={styles.searchSection}>
// //         <form onSubmit={handleSearch} className={styles.searchBar}>
// //           <div className={styles.input}>
// //             <Search className={styles.icon} />
// //             <input
// //               className={styles.inputField}
// //               type="text"
// //               placeholder="Search candidates by skills or title"
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //             />
// //             <button type="submit">Search</button>
// //           </div>
// //         </form>

// //         <div className={styles.filters}>
// //           <select
// //             value={filters.location}
// //             onChange={(e) =>
// //               setFilters({ ...filters, location: e.target.value })
// //             }
// //           >
// //             <option value="">All Locations</option>
// //             <option value="new-york">New York</option>
// //             <option value="san-francisco">San Francisco</option>
// //             <option value="remote">Remote</option>
// //           </select>

// //           <select
// //             value={filters.role}
// //             onChange={(e) => setFilters({ ...filters, role: e.target.value })}
// //           >
// //             <option value="">All Roles</option>
// //             <option value="developer">Developer</option>
// //             <option value="designer">Designer</option>
// //             <option value="manager">Manager</option>
// //           </select>

// //           <select
// //             value={filters.experience}
// //             onChange={(e) =>
// //               setFilters({ ...filters, experience: e.target.value })
// //             }
// //           >
// //             <option value="">Any Experience</option>
// //             <option value="entry">Entry Level (0-2 years)</option>
// //             <option value="mid">Mid Level (3-5 years)</option>
// //             <option value="senior">Senior Level (5+ years)</option>
// //           </select>
// //         </div>
// //       </div>

// //       <div className={styles.candidatesList}>
// //         {MOCK_CANDIDATES.map((candidate) => (
// //           <div key={candidate.id} className={styles.candidateCard}>
// //             <div className={styles.header}>
// //               <div className={styles.avatar}>
// //                 <User size={32} />
// //               </div>
// //               <div className={styles.mainInfo}>
// //                 <h3>{candidate.name}</h3>
// //                 <p className={styles.title}>{candidate.title}</p>
// //               </div>
// //             </div>

// //             <div className={styles.details}>
// //               <span>
// //                 <MapPin size={16} /> {candidate.location}
// //               </span>
// //               <span>
// //                 <Briefcase size={16} /> {candidate.experience}
// //               </span>
// //             </div>

// //             <p className={styles.summary}>{candidate.summary}</p>

// //             <div className={styles.skills}>
// //               {candidate.skills.map((skill, index) => (
// //                 <span key={index} className={styles.skill}>
// //                   {skill}
// //                 </span>
// //               ))}
// //             </div>

// //             <div className={styles.availability}>
// //               <p>Available: {candidate.availability}</p>
// //               <p>Preferred Role: {candidate.preferredRole}</p>
// //             </div>

// //             <button className={styles.contactBtn}>Contact Candidate</button>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default FindTalent;
