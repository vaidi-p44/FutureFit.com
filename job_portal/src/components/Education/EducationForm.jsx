import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./EducationForm.module.css";
import { IoSchoolSharp } from "react-icons/io5";
import { FaBook } from "react-icons/fa";
import { MdOutlinePercent } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { GiSkills } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EducationForm = ({ eData, educationType: propsEducationType }) => {
  const navigate = useNavigate();
  // const [skills, setSkills] = useState([]);
  const [input, setInput] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [educationType, setEducationType] = useState(
    propsEducationType || "graduation"
  );

  const defaultValues = {
    course_name: "",
    college_name: "",
    percentage: "",
    starting_year: "",
    ending_year: "",
    course_type: "",
    education_type: educationType,
  };

  const [values, setValues] = useState(defaultValues);

  useEffect(() => {
    if (eData) {
      const relevantData = Array.isArray(eData)
        ? eData.find((ed) => ed.education_type === educationType)
        : eData.education_type === educationType
          ? eData
          : null;

      if (relevantData) {
        setValues({
          course_name: relevantData.course_name || "",
          college_name: relevantData.college_name || "",
          percentage: relevantData.percentage || "",
          starting_year: relevantData.starting_year || "",
          ending_year: relevantData.ending_year || "",
          course_type: relevantData.course_type || "",
          education_type: educationType,
        });
        // setSkills(relevantData.skills || []);
      }
    }
  }, [eData, educationType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user_id = localStorage.getItem("user_id");

    if (!user_id) {
      toast.error("User ID is missing. Please log in again.");
      return;
    }

    if (values.percentage < 0 || values.percentage > 100) {
      toast.error("Percentage must be between 0 and 100.");
      return;
    }

    if (
      values.starting_year >= values.ending_year &&
      values.starting_year !== "" &&
      values.ending_year !== ""
    ) {
      toast.error("Starting year must be earlier than ending year.");
      return;
    }

    const educationData = {
      user_id,
      ...values,
      // skills,
      education_type: educationType,
    };

    try {
      const response = await axios.post(
        "http://localhost:8081/api/EducationForm",
        educationData
      );

      if (response.status === 200 || response.status === 201) {
        toast.success(
          response.data.message || "Education details saved successfully!"
        );
        setTimeout(() => {
          navigate("/ProfileSection");
          location.reload();
        }, 2000);
        setIsSubmitted(true);
      } else {
        toast.error(
          response.data.message || "Failed to save education details."
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while saving education details."
      );
    }
  };

  const getEducationTitle = (type) => {
    switch (type) {
      case "graduation":
        return "Graduation Details";
      case "post_graduation":
        return "Post Graduation Details";
      case "class12":
        return "Class XII Details";
      case "class10":
        return "Class X Details";
      default:
        return "Education Details";
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1989 }, (_, i) => 1990 + i);

  return (
    <div className={styles.container}>
      <ToastContainer />

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.type}>
          <label htmlFor="education_type" className={styles.typelabel}>
            Education Type
          </label>
          <select
            name="education_type"
            id="education_type"
            value={educationType}
            onChange={(e) => setEducationType(e.target.value)}
            className={styles.dropdowntype}
            required
          >
            <option value="graduation">Graduation</option>
            <option value="post_graduation">Post Graduation</option>
            <option value="class12">Class XII</option>
            <option value="class10">Class X</option>
          </select>
        </div>
        <h2 className={styles.formTitle}>{getEducationTitle(educationType)}</h2>

        <div>
          <label htmlFor="course_name">
            {educationType === "class12" || educationType === "class10"
              ? "Board Name*"
              : "Course Name*"}
          </label>
          <div className={styles.input}>
            <input
              type="text"
              name="course_name"
              id="course_name"
              value={values.course_name}
              onChange={handleInputChange}
              placeholder={`Enter ${educationType === "class12" || educationType === "class10" ? "Board" : "Course"} Name`}
              className={styles.inputField}
              required
            />
            <FaBook className={styles.icon} />
          </div>
        </div>

        <div>
          <label htmlFor="college_name">
            {educationType === "class12" || educationType === "class10"
              ? "School Name"
              : "College/University Name"}
          </label>
          <div className={styles.input}>
            <input
              type="text"
              name="college_name"
              id="college_name"
              value={values.college_name}
              onChange={handleInputChange}
              placeholder={`Enter ${educationType === "class12" || educationType === "class10" ? "School" : "College/University"} Name`}
              className={styles.inputField}
            />
            <IoSchoolSharp className={styles.icon} />
          </div>
        </div>

        <div>
          <label htmlFor="percentage">Percentage/CGPA</label>
          <div className={styles.input}>
            <input
              type="number"
              name="percentage"
              id="percentage"
              value={values.percentage}
              onChange={handleInputChange}
              placeholder="Enter Percentage/CGPA"
              className={styles.inputField}
              step="0.01"
              min="0"
              max="100"
            />
            <MdOutlinePercent className={styles.icon} />
          </div>
        </div>

        <div>
          <label>
            {educationType === "class12" || educationType === "class10"
              ? "Year of Passing*"
              : "Course Duration*"}
          </label>
          <div className={styles.year}>
            {educationType === "class12" || educationType === "class10" ? (
              <div>
                <label htmlFor="ending_year">Passing Year</label>
                <select
                  name="ending_year"
                  id="ending_year"
                  value={values.ending_year}
                  onChange={handleInputChange}
                  className={styles.dropdown}
                  required
                >
                  <option value="">Select Passing Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <>
                <div>
                  <label htmlFor="starting_year">Start Year</label>
                  <select
                    name="starting_year"
                    id="starting_year"
                    value={values.starting_year}
                    onChange={handleInputChange}
                    className={styles.dropdown}
                    required
                  >
                    <option value="">Select Starting Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <span>to</span>
                <div>
                  <label htmlFor="ending_year">End Year</label>
                  <select
                    name="ending_year"
                    id="ending_year"
                    value={values.ending_year}
                    onChange={handleInputChange}
                    className={styles.dropdown}
                    required
                  >
                    <option value="">Select Ending Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {(educationType === "graduation" ||
          educationType === "post_graduation") && (
          <div>
            <label>Course Type</label>
            <div className={styles.input_type}>
              {["PartTime", "FullTime", "Distance"].map((type) => (
                <label key={type} className={styles.radios}>
                  {type}
                  <input
                    className={styles.radiobtn}
                    type="radio"
                    name="course_type"
                    value={type}
                    checked={values.course_type === type}
                    onChange={handleInputChange}
                  />
                </label>
              ))}
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => navigate("/ProfileSection")}
            className={styles.cancel}
          >
            Cancel
          </button>
          <button type="submit" className={styles.save}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EducationForm;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import styles from "./EducationForm.module.css";
// import { IoSchoolSharp } from "react-icons/io5";
// import { FaBook } from "react-icons/fa";
// import { MdOutlinePercent } from "react-icons/md";
// import { RxCross2 } from "react-icons/rx";
// import { GiSkills } from "react-icons/gi";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const EducationForm = ({ eData }) => {
//   const navigate = useNavigate();

//   const [skills, setSkills] = useState([]);

//   const [input, setInput] = useState("");
//   const [errMessage, setErrMessage] = useState("");
//   const [values, setValues] = useState({
//     course_name: eData?.course_name || "",
//     college_name: eData?.college_name || "",
//     percentage: eData?.percentage || "",
//     starting_year: eData?.starting_year || "",
//     ending_year: eData?.ending_year || "",
//     course_type: eData?.course_type || "",
//   });

//   useEffect(() => {
//     if (eData && Array.isArray(eData.skills)) {
//       setSkills(eData.skills);
//       setValues({
//         course_name: eData.course_name || "",
//         college_name: eData.college_name || "",
//         percentage: eData.percentage || "",
//         starting_year: eData.starting_year || "",
//         ending_year: eData.ending_year || "",
//         course_type: eData.course_type || "",
//       });
//     }
//   }, [eData]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setValues({ ...values, [name]: value });
//   };

//   const addSkill = () => {
//     if (input.trim() !== "") {
//       setSkills((prev) => [...prev, input.trim()]);
//       setInput("");
//       setErrMessage("");
//     } else {
//       setErrMessage("Enter a skill");
//     }
//   };

//   const deleteSkill = (index) => {
//     setSkills(skills.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const user_id = localStorage.getItem("user_id");

//     if (!user_id) {
//       toast.error("User ID is missing. Please log in again.");
//       return;
//     }

//     // Validate percentage
//     if (values.percentage < 0 || values.percentage > 100) {
//       toast.error("Percentage must be between 0 and 100.");
//       return;
//     }

//     // Validate years
//     if (values.starting_year >= values.ending_year) {
//       toast.error("Starting year must be earlier than ending year.");
//       return;
//     }
//     const educationData = {
//       user_id,
//       ...values,
//       skills,
//     };

//     try {
//       const response = await axios.post(
//         "http://localhost:8081/api/EducationForm",
//         educationData
//       );
//       if (response.status === 200 || response.status === 201) {
//         toast.success(
//           response.data.message || "Education details saved successfully!"
//         );
//         navigate("/ProfileSection");
//       } else {
//         toast.error(
//           response.data.message || "Failed to save education details."
//         );
//       }
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "An error occurred while saving education details."
//       );
//     }
//   };

//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: currentYear - 1989 }, (_, i) => 1990 + i);

//   return (
//     <div className={styles.container}>
//       <ToastContainer />
//       <form className={styles.form} onSubmit={handleSubmit}>
//         <h2 className={styles.formTitle}>Education</h2>

//         <div>
//           <label htmlFor="course_name">Course Name*</label>
//           <div className={styles.input}>
//             <input
//               type="text"
//               name="course_name"
//               id="course_name"
//               value={values.course_name}
//               onChange={handleInputChange}
//               placeholder="Enter Course Name"
//               className={styles.inputField}
//               required
//             />
//             <FaBook className={styles.icon} />
//           </div>
//         </div>

//         <div>
//           <label htmlFor="college_name">College Name</label>
//           <div className={styles.input}>
//             <input
//               type="text"
//               name="college_name"
//               id="college_name"
//               value={values.college_name}
//               onChange={handleInputChange}
//               placeholder="Enter College Name"
//               className={styles.inputField}
//             />
//             <IoSchoolSharp className={styles.icon} />
//           </div>
//         </div>

//         <div>
//           <label htmlFor="percentage">Percentage (out of 100)</label>
//           <div className={styles.input}>
//             <input
//               type="number"
//               name="percentage"
//               id="percentage"
//               value={values.percentage}
//               onChange={handleInputChange}
//               placeholder="Enter Percentage"
//               className={styles.inputField}
//             />
//             <MdOutlinePercent className={styles.icon} />
//           </div>
//         </div>

//         <div>
//           <label>Course Duration*</label>
//           <div className={styles.year}>
//             <div>
//               <label htmlFor="starting_year">Start Year</label>
//               <select
//                 name="starting_year"
//                 id="starting_year"
//                 value={values.starting_year}
//                 onChange={handleInputChange}
//                 className={styles.dropdown}
//                 required
//               >
//                 <option value="">Select Starting Year</option>
//                 {years.map((year) => (
//                   <option key={year} value={year}>
//                     {year}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <span>to</span>
//             <div>
//               <label htmlFor="ending_year">End Year</label>
//               <select
//                 name="ending_year"
//                 id="ending_year"
//                 value={values.ending_year}
//                 onChange={handleInputChange}
//                 className={styles.dropdown}
//                 required
//               >
//                 <option value="">Select Ending Year</option>
//                 {years.map((year) => (
//                   <option key={year} value={year}>
//                     {year}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         <div>
//           <label>Course Type</label>
//           <div className={styles.input_type}>
//             {["PartTime", "FullTime", "Online"].map((type) => (
//               <label key={type} className={styles.radios}>
//                 {type}
//                 <input
//                   className={styles.radiobtn}
//                   type="radio"
//                   name="course_type"
//                   value={type}
//                   checked={values.course_type === type}
//                   onChange={handleInputChange}
//                 />
//               </label>
//             ))}
//           </div>
//         </div>

//         <div>
//           <label>Skills</label>
//           <div className={styles.input_skill}>
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Add a skill"
//               className={styles.inputField_skill}
//             />
//             <GiSkills className={styles.icon} />
//             <button type="button" onClick={addSkill} className={styles.add}>
//               Add Skill
//             </button>
//           </div>
//           {errMessage && <p className={styles.errorMsg}>{errMessage}</p>}
//           <div className={styles.skillcard}>
//             {skills.map((skill, index) => (
//               <div key={index} className={styles.skilldiv}>
//                 <span className={styles.skillText}>{skill}</span>
//                 <RxCross2 onClick={() => deleteSkill(index)} />
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className={styles.actions}>
//           <button
//             type="button"
//             onClick={() => navigate("/ProfileSection")}
//             className={styles.cancel}
//           >
//             Cancel
//           </button>
//           <button type="submit" className={styles.save}>
//             Save
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EducationForm;
