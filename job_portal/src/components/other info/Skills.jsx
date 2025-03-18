import React, { useState, useEffect } from "react";
import styles from "./SkillAndLanguage.module.css";
import { RxCross2 } from "react-icons/rx";
import { GiSkills } from "react-icons/gi";
import axios from "axios";

const Skills = ({ skillsData, onSave }) => {
  const [skills, setSkills] = useState(skillsData || []);
  const [input, setInput] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSkills(skillsData || []); // Update skills if skillsData prop changes
  }, [skillsData]);

  const addSkill = () => {
    if (input.trim() !== "") {
      if (!skills.includes(input.trim())) {
        setSkills((prev) => [...prev, input.trim()]);
      }
      setInput("");
      setErrMessage("");
    } else {
      setErrMessage("Enter a valid skill");
    }
  };

  const deleteSkill = (indexToDelete) => {
    setSkills(skills.filter((_, index) => index !== indexToDelete));
  };

  const saveSkills = async (e) => {
    e.preventDefault();
    const user_id = localStorage.getItem("user_id");

    if (!user_id) {
      setErrMessage("User ID is missing. Please log in again.");
      return;
    }

    if (skills.length === 0) {
      setErrMessage("Please add at least one skill before saving.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8081/api/skill_or_languages",
        {
          user_id,
          skill_or_language: skills,
          type: "skill",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      onSave(skills); // Notify parent component with the updated skills list
      if (response.data.status === "success") {
        alert("Skills saved successfully!");
      } else {
        setErrMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error saving skills:", error);
      setErrMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={saveSkills}>
        <h2 className={styles.formTitle}>Add or Edit Skills</h2>
        <label>Enter your skills</label>

        <div className={styles.input}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a skill"
            className={styles.inputField}
          />
          <GiSkills className={styles.icon} />
          <button type="button" onClick={addSkill} className={styles.add}>
            Add Skill
          </button>
        </div>

        {errMessage && <p className={styles.errMessage}>{errMessage}</p>}

        <div className={styles.skillcard}>
          {skills.map((skill, index) => (
            <div key={index} className={styles.skilldiv}>
              <p className={styles.skillText}>{skill}</p>
              <RxCross2
                className={styles.deleteImg}
                onClick={() => deleteSkill(index)}
              />
            </div>
          ))}
        </div>

        <button type="submit" className={styles.save} disabled={loading}>
          {loading ? "Saving..." : "Save Skills"}
        </button>
      </form>
    </div>
  );
};

export default Skills;

// import React, { useState, useEffect } from "react";
// import styles from "./SkillAndLanguage.module.css";
// import { RxCross2 } from "react-icons/rx";
// import { GiSkills } from "react-icons/gi";
// import axios from "axios";

// const Skills = ({ skillsData, onSave }) => {
//   const [skills, setSkills] = useState([]);
//   const [input, setInput] = useState("");
//   const [errMessage, setErrMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchSkillsData = async () => {
//       const user_id = localStorage.getItem("user_id");

//       if (!user_id) {
//         console.error("User ID is missing. Please log in.");
//         return;
//       }

//       try {
//         const response = await axios.get(
//           `http://localhost:8081/api/skill_or_languages/${user_id}?type=skill`
//         );
//         if (response.data.status === "success") {
//           setSkills(response.data.data || []);
//         } else {
//           console.error("Failed to fetch skills:", response.data.message);
//         }
//       } catch (error) {
//         console.error("Error fetching skills data:", error);
//       }
//     };

//     fetchSkillsData();
//   }, []);

//   useEffect(() => {
//     setSkills(skillsData || []); // Update skills if skillsData prop changes
//   }, [skillsData]);

//   const addSkill = () => {
//     if (input.trim() !== "") {
//       setSkills((prev) => [...prev, input.trim()]);
//       setInput("");
//       setErrMessage("");
//     } else {
//       setErrMessage("Enter a valid skill");
//     }
//   };

//   const deleteSkill = (indexToDelete) => {
//     setSkills(skills.filter((_, index) => index !== indexToDelete));
//   };

//   const saveSkills = async (e) => {
//     e.preventDefault();
//     const user_id = localStorage.getItem("user_id");
//     console.log("Saving skills:", {
//       user_id,
//       skill_or_language: skills,
//       type: "skill",
//     });
//     if (!user_id) {
//       setErrMessage("User ID is missing. Please log in again.");
//       return;
//     }

//     if (skills.length === 0) {
//       setErrMessage("Please add at least one skill before saving.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axios.post(
//         "http://localhost:8081/api/skill_or_languages",
//         {
//           user_id,
//           skill_or_language: skills,
//           type: "skill",
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       onSave(skills);
//       if (response.data.status === "success") {
//         alert("Skills saved successfully!");
//       } else {
//         setErrMessage(response.data.message);
//       }
//     } catch (error) {
//       console.error("Error saving skills:", error);
//       setErrMessage(
//         error.response?.data?.message ||
//           "Something went wrong. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <form onSubmit={saveSkills}>
//         <h2 className={styles.formTitle}>Add Skills</h2>
//         <label>Enter your skills</label>

//         <div className={styles.input}>
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Add a skill"
//             className={styles.inputField}
//           />
//           <GiSkills className={styles.icon} />
//           <button type="button" onClick={addSkill} className={styles.add}>
//             Add Skill
//           </button>
//         </div>

//         {errMessage && <p className={styles.errMessage}>{errMessage}</p>}

//         <div className={styles.skillcard}>
//           {skills.map((skill, index) => (
//             <div key={index} className={styles.skilldiv}>
//               <p className={styles.skillText}>{skill.skill_or_language}</p>
//               <RxCross2
//                 className={styles.deleteImg}
//                 onClick={() => deleteSkill(index)}
//               />
//             </div>
//           ))}
//         </div>

//         <button type="submit" className={styles.save} disabled={loading}>
//           {loading ? "Saving..." : "Save Skills"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Skills;
