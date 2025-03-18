import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ProfileSection.module.css";
import CareerPreferences from "../CareerPreferences/CareerPreferences";
import { IoMdClose } from "react-icons/io";
import EducationForm from "../Education/EducationForm";
import Skills from "../other info/Skills";
import Language from "../other info/Language";
import Resume from "../Resume/Resume";
import ProfileIcon from "../../assets/profileicon.png";
import Aboutyou from "../About_you/Aboutyou";
import { MdOutlineModeEdit } from "react-icons/md";
import { GiBackup } from "react-icons/gi";

const ProfileSection = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [showAboutYouForm, setShowAboutYouForm] = useState(false);
  const [userData, setUserData] = useState(null);
  const [eData, seteData] = useState([]);
  const [cData, setcData] = useState({});
  const [skillsData, setSkillsData] = useState([]);
  const [langData, setlangData] = useState([]);
  const [resumeData, setResumeData] = useState(null);
  const [forceRender, setForceRender] = useState(false);
  const [isResumeVisible, setIsResumeVisible] = useState(false);
  const [error, setError] = useState(null);

  const [activeEducationType, setActiveEducationType] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user_id = localStorage.getItem("user_id");
      console.log("Fetched user_id:", user_id); // Debugging

      if (!user_id) {
        console.error("User ID not found in local storage.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8081/api/Aboutyou/${user_id}`
        );
        console.log("API Response:", response.data); // Debugging
        if (response.data?.data) {
          setUserData(response.data.data); // Adjust if API wraps data
        } else {
          setUserData(response.data); // Directly set data
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    const fetchCareerPreferencesData = async () => {
      const user_id = localStorage.getItem("user_id");

      if (!user_id) {
        console.error("User ID not found in local storage.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8081/api/CareerPreferences/${user_id}`
        );
        console.log(
          "Fetched Career Preferences:",
          response.data?.data || response.data
        );
        // setcData(careerPreferencesResponse.data.data[0] || {});
        setcData(response.data.data[0] || {});
      } catch (error) {
        console.error("Failed to fetch career preferences data:", error);
      }
    };

    const fetcheducationData = async () => {
      const user_id = localStorage.getItem("user_id");

      if (!user_id) {
        console.error("User ID not found in local storage.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8081/api/EducationForm/${user_id}`
        );
        console.log("API Response:", response.data);
        seteData(response.data?.data || []); // Ensure skills exist in data
      } catch (error) {
        console.error("Failed to fetch education data:", error.message);
      }
    };
    const fetchSkillsData = async () => {
      const user_id = localStorage.getItem("user_id");

      if (!user_id) {
        console.error("User ID is missing. Please log in.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8081/api/skill_or_languages/${user_id}?type=skill`
        );
        if (response.data.status === "success") {
          // Extract and flatten skill_or_language arrays from API response
          const skillsArray = response.data.data
            .map((item) => item.skill_or_language)
            .flat();
          setSkillsData(skillsArray || []);
        } else {
          console.error("Failed to fetch skills:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching skills data:", error);
      }
    };

    const fetchlanguageData = async () => {
      const user_id = localStorage.getItem("user_id");

      if (!user_id) {
        console.error("User ID is missing. Please log in.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8081/api/skill_or_languages/${user_id}?type=language`
        );
        if (response.data.status === "success") {
          // Extract and flatten skill_or_language arrays from API response
          const langArray = response.data.data
            .map((item) => item.skill_or_language)
            .flat();
          setlangData(langArray || []);
        } else {
          console.error("Failed to fetch languages:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching language data:", error);
      }
    };
    const fetchResumeData = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        setError("User ID not found.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8081/api/Resume/${userId}`
        );
        console.log("Resume Data:", response.data);
        if (response.status === 200) {
          setResumeData(response.data);
        } else {
          setError("Resume not found for this user.");
        }
      } catch (err) {
        setError("Failed to fetch resume.");
        console.error(err);
      }
    };

    fetchUserData();
    fetchCareerPreferencesData();
    fetcheducationData();
    fetchSkillsData();
    fetchlanguageData();
    fetchResumeData();
  }, []);

  useEffect(() => {
    console.log("Updated career preferences data:", cData);
    setForceRender((prev) => !prev); // Force re-render on data change
  }, [cData]);

  const toggleForm = (index) => {
    console.log("Form toggled for index:", index);
    setActiveForm(activeForm === index ? null : index); // Toggle the form
  };

  const toggleResume = () => {
    console.log("Resume toggled");
    setIsResumeVisible(!isResumeVisible); // Toggle resume photo visibility
  };

  const renderEducationDetails = (educationData) => {
    if (!educationData || educationData.length === 0) return null;

    const educationTypes = [
      { type: "post_graduation", title: "Post Graduation" },
      { type: "graduation", title: "Graduation" },
      { type: "class12", title: "Class XII" },
      { type: "class10", title: "Class X" },
    ];

    return educationTypes.map((eduType) => {
      const edu = educationData.find((e) => e.education_type === eduType.type);
      if (!edu) return null;

      return (
        <div key={eduType.type} className={styles.edetails}>
          <div className={styles.ceducation}>
            <h4>{eduType.title}</h4>
            <h5>
              {edu.course_name || "Not Provided"},{" "}
              {edu.college_name || "Not Provided"}
              <MdOutlineModeEdit
                className={styles.editIcon}
                onClick={() => {
                  setActiveEducationType(eduType.type);
                  toggleForm(1);
                }}
              />
            </h5>
            {eduType.type !== "class12" && eduType.type !== "class10" && (
              <p>
                graduating in {edu.ending_year || ""},
                {edu.course_type || "Not Provided"}
              </p>
            )}
            {eduType.type !== "graduation" &&
              eduType.type !== "post_graduation" && (
                <>
                  <p>
                    scored {edu.percentage || ""}%, passed out in{" "}
                    {edu.ending_year || ""}
                  </p>
                </>
              )}
          </div>
        </div>
      );
    });
  };
  const sections = [
    {
      title: "Your career preferences",
      description:
        cData && Object.keys(cData).length > 0
          ? null
          : "Add your career preferences details",
      button:
        cData && Object.keys(cData).length > 0 ? "Edit details" : "Add details",
      form: <CareerPreferences cData={cData} />, // Ensure this is receiving data properly
      details:
        cData && Object.keys(cData).length > 0 ? (
          <>
            <div className={styles.careerData}>
              <div>
                <h5>Looking For: </h5>
                <h6>{cData.looking_for || "Not Provided"} </h6>
                <h5>Available Time: </h5>
                <h6>{cData.available_time || "Not Provided"}</h6>
              </div>
              <div>
                <h5>Preferred Location:</h5>
                <h6>{cData.preferred_location || "Not Provided"}</h6>
              </div>
              <MdOutlineModeEdit
                className={styles.editIcon}
                onClick={() => toggleForm(0)} // Open form for editing
              />
            </div>
          </>
        ) : null,
    },
    {
      title: "Education",
      description:
        eData && eData.length > 0 ? null : "Add your education details",
      button: eData && eData.length > 0 ? "Edit details" : "Add details",
      form: <EducationForm eData={eData} educationType={activeEducationType} />,
      details:
        eData && eData.length > 0 ? (
          <>
            {renderEducationDetails(eData)}
            {!eData.find((e) => e.education_type === "post_graduation") && (
              <div className={styles.edetails}>
                <div>
                  <button
                    className={styles.ebutton}
                    onClick={() => {
                      setActiveEducationType("post_graduation");
                      toggleForm(1);
                    }}
                  >
                    Add Post Graduation Details
                  </button>
                  <p>Add your post graduation education details</p>
                </div>
              </div>
            )}
            {!eData.find((e) => e.education_type === "graduation") && (
              <div className={styles.edetails}>
                <div>
                  <button
                    className={styles.ebutton}
                    onClick={() => {
                      setActiveEducationType("graduation");
                      toggleForm(1);
                    }}
                  >
                    Add Graduation Details
                  </button>
                  <p>Add your graduation education details</p>
                </div>
              </div>
            )}
            {!eData.find((e) => e.education_type === "class12") && (
              <div className={styles.edetails}>
                <div>
                  <button
                    className={styles.ebutton}
                    onClick={() => {
                      setActiveEducationType("class12");
                      toggleForm(1);
                    }}
                  >
                    Add Class XII Details
                  </button>
                  <p>Add your higher secondary education details</p>
                </div>
              </div>
            )}
            {!eData.find((e) => e.education_type === "class10") && (
              <div className={styles.edetails}>
                <div>
                  <button
                    className={styles.ebutton}
                    onClick={() => {
                      setActiveEducationType("class10");
                      toggleForm(1);
                    }}
                  >
                    Add Class X Details
                  </button>
                  <p>Add your secondary education details</p>
                </div>
              </div>
            )}
          </>
        ) : null,
    },
    {
      title:
        skillsData.length === 0 ? (
          "Skills"
        ) : (
          <span>
            Your Skills
            <MdOutlineModeEdit
              className={styles.editIcon}
              onClick={() => toggleForm(2)} // Open form for editing
            />
          </span>
        ),
      description: skillsData.length > 0 ? null : "Add your skills",
      button: skillsData.length > 0 ? "Edit details" : "Add details",
      form: <Skills skillsData={skillsData} onSave={setSkillsData} />,
      details:
        skillsData.length > 0 ? (
          <div className={styles.skillContainer}>
            {skillsData.map((skill, index) => (
              <div key={index} className={styles.skillItem}>
                <span>{skill}</span>
              </div>
            ))}
          </div>
        ) : null,
    },
    {
      title:
        langData.length === 0 ? (
          "Languages"
        ) : (
          <span>
            Your Languages
            <MdOutlineModeEdit
              className={styles.editIcon}
              onClick={() => toggleForm(3)} // Open form for editing
            />
          </span>
        ),
      description: langData.length > 0 ? null : "Add languages you speak",
      button: langData.length > 0 ? "Edit details" : "Add details",
      form: <Language language={langData} onSave={setlangData} />,
      details:
        langData.length > 0 ? (
          <div className={styles.skillContainer}>
            {langData.map((language, index) => (
              <div key={index} className={styles.skillItem}>
                <span>{language}</span>
              </div>
            ))}
          </div>
        ) : null,
    },

    {
      title: "Resume",
      description: resumeData?.resume_url ? null : "No resume uploaded",
      button: resumeData?.resume_url ? "Show Resume" : "Upload Resume",
      form: <Resume resumeData={resumeData} />,
      details: resumeData?.resume_url ? (
        <>
          {/* Toggle Button */}
          <button className={styles.showResumeButton} onClick={toggleResume}>
            {isResumeVisible ? "Hide Resume" : "Show Resume"}
          </button>

          {/* Toggled Resume Section */}
          <div
            className={
              styles.resumeContainer +
              (isResumeVisible ? ` ${styles.active}` : "")
            }
          >
            {/* Resume Photo */}
            <div className={styles.resumePhoto}>
              <img
                src={resumeData?.resume_url || "default_resume_url"} // Default image URL if not available
                alt="Resume Thumbnail"
                onClick={() => toggleForm(4)}
              />
            </div>

            {/* Action Buttons for Edit and Download */}
          </div>
        </>
      ) : null,
    },
  ];

  useEffect(() => {
    const html = document.documentElement;
    if (activeForm !== null) {
      document.body.style.overflow = "hidden";
      html.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      html.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      html.style.overflow = "";
    };
  }, [activeForm]);

  return (
    <>
      <div className={styles.container}>
        <div
          className={styles.profilecard}
          onClick={() => setShowAboutYouForm(!showAboutYouForm)}
        >
          <div className={styles.profileIcon}>
            <img
              src={userData?.profile_photo || ProfileIcon}
              alt="Profile"
              className={styles.profileImg}
            />
          </div>

          <div className={styles.details}>
            <div>
              <h2>{userData?.full_name || "Your Name"}</h2>
            </div>

            <p className={styles.separator}></p>
            <div className={styles.otherdetails}>
              <div>
                <h4>{userData?.city || "City"}</h4>
                <h4>
                  {userData?.dob
                    ? new Date(userData.dob).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Birthdate"}
                </h4>
                <h4>{userData?.gender || "Gender"}</h4>
              </div>
              <p className={styles.separator2}></p>
              <div>
                <h4>
                  {userData?.user_email ||
                    "No email provided. Please complete your profile."}
                </h4>
                <h4>{userData?.user_mobile || "No mobile number provided."}</h4>
              </div>
            </div>
          </div>

          <MdOutlineModeEdit
            className={styles.editButton}
            onClick={() => setShowAboutYouForm(!showAboutYouForm)}
          />
        </div>
        {showAboutYouForm && (
          <>
            <div className={styles.overlay}></div>
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <IoMdClose
                  className={styles.closeButton}
                  onClick={() => setShowAboutYouForm(null)} // Close modal on button click
                />
              </div>
              <div className={styles.modalContent}>
                <Aboutyou userData={userData} />
              </div>
            </div>
          </>
        )}
      </div>
      <div className={styles.container}>
        {sections.map((section, index) => (
          <div
            className={`${styles.card} ${section.details ? styles.empty : ""}`}
            key={index}
          >
            <div className={styles.header}>
              <span className={styles.title}>{section.title}</span>
              <p className={styles.description}>{section.description}</p>
            </div>

            <div>
              {section.details ? (
                section.details
              ) : (
                <button
                  className={styles.button}
                  onClick={() => toggleForm(index)}
                >
                  {section.button}
                </button>
              )}
            </div>
          </div>
        ))}

        {activeForm === 0 && userData && <Aboutyou userData={userData} />}

        {/* Modal for active form */}
        {activeForm !== null && (
          <>
            <div className={styles.overlay}></div>
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <IoMdClose
                  className={styles.closeButton}
                  onClick={() => setActiveForm(null)} // Close modal on button click
                />
              </div>
              <div className={styles.modalContent}>
                {sections[activeForm].form}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProfileSection;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import styles from "./ProfileSection.module.css";
// import CareerPreferences from "../CareerPreferences/CareerPreferences";
// import { IoMdClose } from "react-icons/io";
// import EducationForm from "../Education/EducationForm";
// import Language from "../other info/Language";
// import Resume from "../Resume/Resume";
// import ProfileIcon from "../../assets/profile.jpg";
// import Aboutyou from "../About_you/Aboutyou";
// import { MdOutlineModeEdit } from "react-icons/md";
// import { IoSchoolSharp } from "react-icons/io5";
// import { FaBook } from "react-icons/fa";
// import { MdOutlinePercent } from "react-icons/md";
// import { RxCross2 } from "react-icons/rx";
// import { GiSkills } from "react-icons/gi";

// const ProfileSection = () => {
//   const [activeForm, setActiveForm] = useState(null);
//   const [showAboutYouForm, setShowAboutYouForm] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const [eData, seteData] = useState(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const user_id = localStorage.getItem("user_id");
//       console.log("Fetched user_id:", user_id); // Debugging

//       if (!user_id) {
//         console.error("User ID not found in local storage.");
//         return;
//       }

//       try {
//         const response = await axios.get(
//           `http://localhost:8081/api/Aboutyou/${user_id}`
//         );
//         console.log("API Response:", response.data); // Debugging
//         if (response.data?.data) {
//           setUserData(response.data.data); // Adjust if API wraps data
//         } else {
//           setUserData(response.data); // Directly set data
//         }
//       } catch (error) {
//         console.error("Failed to fetch user data:", error);
//       }
//     };

//     const fetcheducationData = async () => {
//       const user_id = localStorage.getItem("user_id");

//       if (!user_id) {
//         console.error("User ID not found in local storage.");
//         return;
//       }

//       try {
//         const response = await axios.get(
//           `http://localhost:8081/api/EducationForm/${user_id}`
//         );
//         console.log("API Response:", response.data);
//         seteData(response.data?.data || {}); // Ensure skills exist in data
//       } catch (error) {
//         console.error("Failed to fetch education data:", error.message);
//       }
//     };
//     fetchUserData();
//     fetcheducationData();
//   }, []);
//   const toggleForm = (index) => {
//     setActiveForm(activeForm === index ? null : index); // Toggle the form
//   };
//   const sections = [
//     {
//       title: "Your career preferences",
//       description: "Add your career preferences details",
//       button: "Add details",
//       form: <CareerPreferences />,
//       details: "",
//     },
//     {
//       title: "Education",
//       description: eData ? null : "Add your education details",
//       button: eData ? "Edit details" : "Add details",
//       form: <EducationForm eData={eData} />,
//       details: eData ? (
//         <>
//           <div className={styles.edetails}>
//             <div className={styles.ceducation}>
//               <h4>
//                 {eData.course_name || "Not Provided"},
//                 {eData.college_name || "Not Provided"}
//                 <MdOutlineModeEdit
//                   className={styles.editIcon}
//                   onClick={() => toggleForm(1)} // Open the EducationForm modal
//                 />
//               </h4>

//               <p> {eData.course_type || "Not Provided"},</p>

//               {/* <p>
//               Skills:{" "}
//               {eData.skills
//                 ? JSON.parse(eData.skills).join(", ")
//                 : "Not Provided"}
//             </p> */}
//             </div>
//             {/* <div>
//               <button className={styles.button} onClick={() => toggleForm(1)}>
//                 Edit
//               </button>
//             </div> */}
//           </div>
//           <div className={styles.edetails}>
//             <div>
//               <button className={styles.ebutton} onClick={() => toggleForm(1)}>
//                 Add Class XII Details
//               </button>
//               <p>Scored Percentage, Passed out in Passing Year</p>
//             </div>
//           </div>
//           <div className={styles.edetails}>
//             <div>
//               <button className={styles.ebutton} onClick={() => toggleForm(1)}>
//                 Add Class X Details
//               </button>
//               <p>Scored Percentage, Passed out in Passing Year</p>
//             </div>
//           </div>
//         </>
//       ) : null,
//     },
//     {
//       title: "Language",
//       description: "Talk about the languages you know",
//       button: "Add",
//       form: <Language />,
//       details: "",
//     },
//     {
//       title: "Resume",
//       description: "Upload your resume",
//       button: "Add Resume",
//       form: <Resume />,
//       details: "",
//     },
//   ];

//   useEffect(() => {
//     const html = document.documentElement;
//     if (activeForm !== null) {
//       document.body.style.overflow = "hidden";
//       html.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//       html.style.overflow = "";
//     }

//     return () => {
//       document.body.style.overflow = "";
//       html.style.overflow = "";
//     };
//   }, [activeForm]);

//   return (
//     <>
//       <div className={styles.container}>
//         <div
//           className={styles.profilecard}
//           onClick={() => setShowAboutYouForm(!showAboutYouForm)}
//         >
//           <div className={styles.profileIcon}>
//             <img
//               src={userData?.profile_photo || ProfileIcon}
//               alt="Profile"
//               className={styles.profileImg}
//             />
//           </div>

//           <div className={styles.details}>
//             <div>
//               <h2>{userData?.full_name || "Your Name"}</h2>
//             </div>

//             <p className={styles.separator}></p>
//             <div className={styles.otherdetails}>
//               <div>
//                 <h4>{userData?.city || "City"}</h4>
//                 <h4>
//                   {userData?.dob
//                     ? new Date(userData.dob).toLocaleDateString("en-US", {
//                         year: "numeric",
//                         month: "long",
//                         day: "numeric",
//                       })
//                     : "Birthdate"}
//                 </h4>
//                 <h4>{userData?.gender || "Gender"}</h4>
//               </div>
//               <p className={styles.separator2}></p>
//               <div>
//                 <h4>
//                   {userData?.user_email ||
//                     "No email provided. Please complete your profile."}
//                 </h4>
//                 <h4>{userData?.user_mobile || "No mobile number provided."}</h4>
//               </div>
//             </div>
//           </div>

//           <MdOutlineModeEdit
//             className={styles.editButton}
//             onClick={() => setShowAboutYouForm(!showAboutYouForm)}
//           />
//         </div>
//         {showAboutYouForm && (
//           <>
//             <div className={styles.overlay}></div>
//             <div className={styles.modal}>
//               <div className={styles.modalHeader}>
//                 <IoMdClose
//                   className={styles.closeButton}
//                   onClick={() => setShowAboutYouForm(null)} // Close modal on button click
//                 />
//               </div>
//               <div className={styles.modalContent}>
//                 <Aboutyou userData={userData} />
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//       <div className={styles.container}>
//         {sections.map((section, index) => (
//           <div
//             className={`${styles.card} ${section.details ? styles.empty : ""}`}
//             key={index}
//           >
//             <div className={styles.header}>
//               <span className={styles.title}>{section.title}</span>
//               <p className={styles.description}>{section.description}</p>
//             </div>

//             <div>
//               {/* Render details for Education if available, or show button */}
//               {section.details || (
//                 <button
//                   className={styles.button}
//                   onClick={() => toggleForm(index)}
//                 >
//                   {section.button}
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}
//         {activeForm === 0 && userData && <Aboutyou userData={userData} />}

//         {/* Modal for active form */}
//         {activeForm !== null && (
//           <>
//             <div className={styles.overlay}></div>
//             <div className={styles.modal}>
//               <div className={styles.modalHeader}>
//                 <IoMdClose
//                   className={styles.closeButton}
//                   onClick={() => setActiveForm(null)} // Close modal on button click
//                 />
//               </div>
//               <div className={styles.modalContent}>
//                 {sections[activeForm].form}
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </>
//   );
// };

// export default ProfileSection;

//just for GiBackup

// useEffect(() => {
//   const fetchUserData = async () => {
//     const user_id = localStorage.getItem("user_id");
//     console.log("Fetched user_id:", user_id); // Debugging

//     if (!user_id) {
//       console.error("User ID not found in local storage.");
//       return;
//     }

//     try {
//       const response = await axios.get(
//         `http://localhost:8081/api/Aboutyou/${user_id}`
//       );
//       console.log("API Response:", response.data); // Debugging
//       if (response.data?.data) {
//         setUserData(response.data.data); // Adjust if API wraps data
//       } else {
//         setUserData(response.data); // Directly set data
//       }
//     } catch (error) {
//       console.error("Failed to fetch user data:", error);
//     }
//   };

//   const fetchCareerPreferencesData = async () => {
//     const user_id = localStorage.getItem("user_id");

//     if (!user_id) {
//       console.error("User ID not found in local storage.");
//       return;
//     }

//     try {
//       const response = await axios.get(
//         `http://localhost:8081/api/CareerPreferences/${user_id}`
//       );
//       console.log(
//         "Fetched Career Preferences:",
//         response.data?.data || response.data
//       );
//       setcData(response.data?.data || {});
//     } catch (error) {
//       console.error("Failed to fetch career preferences data:", error);
//     }
//   };

//   const fetcheducationData = async () => {
//     const user_id = localStorage.getItem("user_id");

//     if (!user_id) {
//       console.error("User ID not found in local storage.");
//       return;
//     }

//     try {
//       const response = await axios.get(
//         `http://localhost:8081/api/EducationForm/${user_id}`
//       );
//       console.log("API Response:", response.data);
//       seteData(response.data?.data || []); // Ensure skills exist in data
//     } catch (error) {
//       console.error("Failed to fetch education data:", error.message);
//     }
//   };
//   const fetchSkillsData = async () => {
//     const user_id = localStorage.getItem("user_id");

//     if (!user_id) {
//       console.error("User ID is missing. Please log in.");
//       return;
//     }

//     try {
//       const response = await axios.get(
//         `http://localhost:8081/api/skill_or_languages/${user_id}?type=skill`
//       );
//       if (response.data.status === "success") {
//         // Extract and flatten skill_or_language arrays from API response
//         const skillsArray = response.data.data
//           .map((item) => item.skill_or_language)
//           .flat();
//         setSkillsData(skillsArray || []);
//       } else {
//         console.error("Failed to fetch skills:", response.data.message);
//       }
//     } catch (error) {
//       console.error("Error fetching skills data:", error);
//     }
//   };

//   const fetchlanguageData = async () => {
//     const user_id = localStorage.getItem("user_id");

//     if (!user_id) {
//       console.error("User ID is missing. Please log in.");
//       return;
//     }

//     try {
//       const response = await axios.get(
//         `http://localhost:8081/api/skill_or_languages/${user_id}?type=language`
//       );
//       if (response.data.status === "success") {
//         // Extract and flatten skill_or_language arrays from API response
//         const langArray = response.data.data
//           .map((item) => item.skill_or_language)
//           .flat();
//         setlangData(langArray || []);
//       } else {
//         console.error("Failed to fetch languages:", response.data.message);
//       }
//     } catch (error) {
//       console.error("Error fetching language data:", error);
//     }
//   };
//   const fetchResumeData = async () => {
//     const userId = localStorage.getItem("user_id");
//     if (!userId) {
//       setError("User ID not found.");
//       return;
//     }

//     try {
//       const response = await axios.get(
//         `http://localhost:8081/api/Resume/${userId}`
//       );
//       console.log("Resume Data:", response.data);
//       if (response.status === 200) {
//         setResumeData(response.data);
//       } else {
//         setError("Resume not found for this user.");
//       }
//     } catch (err) {
//       setError("Failed to fetch resume.");
//       console.error(err);
//     }
//   };

//   fetchUserData();
//   fetchCareerPreferencesData();
//   fetcheducationData();
//   fetchSkillsData();
//   fetchlanguageData();
//   fetchResumeData();
// }, []);
