import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Resume.module.css"; // Adjust path as needed
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Resume = ({ resumeData }) => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");

  // Fetch userId from localStorage when component mounts
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      // Update file validation for PDF and Word files
      if (["image/jpeg", "image/png"].includes(uploadedFile.type)) {
        setFile(uploadedFile);
        setError("");
      } else {
        setFile(null);
        setError("Please upload a valid resume file (PDF, DOC, DOCX only).");
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file && userId) {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("user_id", userId);

      try {
        const response = await fetch("http://localhost:8081/api/uploadResume", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (result.status === "success") {
          toast.success(result.message || "Resume uploaded successfully!");
          // Optionally navigate to another page or reload the component
          setTimeout(() => {
            navigate("/ProfileSection");
          }, 2000);
        } else {
          setError(result.message || "Error uploading resume.");
        }
      } catch (error) {
        setError("Error uploading resume.");
      }
    } else {
      setError("Please upload a file before submitting.");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.formTitle}>Upload Your Resume</h2>
        <div className={styles.input}>
          <input
            type="file"
            className={`${styles.fileInput} ${error ? styles.invalid : ""}`}
            onChange={handleFileChange}
            aria-label="file example"
            required
          />
          {error && <div className={styles.errorFeedback}>{error}</div>}
        </div>
        {file && (
          <div className={styles.fileName}>Selected file: {file.name}</div>
        )}
        <button type="submit" className={styles.submitButton}>
          Upload
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Resume;

// import { useState, useEffect } from "react";
// import axios from "axios";
// import styles from "./Resume.module.css"; // Adjust path as needed
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";

// const Resume = ({ resumeData }) => {
//   const navigate = useNavigate();
//   const [file, setFile] = useState(null);
//   const [error, setError] = useState("");
//   const [userId, setUserId] = useState("");

//   // Fetch userId from localStorage when component mounts
//   useEffect(() => {
//     const storedUserId = localStorage.getItem("user_id");
//     if (storedUserId) {
//       setUserId(storedUserId);
//     }
//   }, []);

//   // Handle file selection
//   const handleFileChange = (e) => {
//     const uploadedFile = e.target.files[0];
//     if (uploadedFile) {
//       if (["image/jpeg", "image/png"].includes(uploadedFile.type)) {
//         setFile(uploadedFile);
//         setError("");
//       } else {
//         setFile(null);
//         setError("Please upload a valid image file (JPG or PNG only).");
//       }
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (file && userId) {
//       const formData = new FormData();
//       formData.append("resume", file);
//       formData.append("user_id", userId);

//       try {
//         const response = await fetch("http://localhost:8081/api/uploadResume", {
//           method: "POST",
//           body: formData,
//         });

//         const result = await response.json();
//         if (result.status === "success") {
//           toast.success(result.message || "Resume uploaded successfully!");
//           // Optionally navigate to another page or reload the component
//           setTimeout(() => {
//             // Do something after upload (e.g., navigate)
//             navigate("/ProfileSection");
//           }, 2000);
//         } else {
//           setError(result.message || "Error uploading resume.");
//         }
//       } catch (error) {
//         setError("Error uploading resume.");
//       }
//     } else {
//       setError("Please upload a file before submitting.");
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <form onSubmit={handleSubmit} className={styles.form}>
//         <h2 className={styles.formTitle}>Upload Your Resume</h2>
//         <div className={styles.input}>
//           <input
//             type="file"
//             className={`${styles.fileInput} ${error ? styles.invalid : ""}`}
//             onChange={handleFileChange}
//             aria-label="file example"
//             required
//           />
//           {error && <div className={styles.errorFeedback}>{error}</div>}
//         </div>
//         {file && (
//           <div className={styles.fileName}>Selected file: {file.name}</div>
//         )}
//         <button type="submit" className={styles.submitButton}>
//           Upload
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Resume;

// // import React, { useState } from "react";
// // import styles from "./Resume.module.css";

// // const Resume = () => {
// //   const [file, setFile] = useState(null);
// //   const [error, setError] = useState("");

// //   const handleFileChange = (e) => {
// //     const uploadedFile = e.target.files[0];
// //     if (uploadedFile) {
// //       if (
// //         uploadedFile.type === "application/pdf" ||
// //         uploadedFile.type.includes("word")
// //       ) {
// //         setFile(uploadedFile);
// //         setError("");
// //       } else {
// //         setFile(null);
// //         setError("Please upload a valid PDF or Word document.");
// //       }
// //     }
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     if (file) {
// //       console.log("File uploaded:", file.name);
// //       // Handle file upload logic
// //     } else {
// //       setError("Please upload a file before submitting.");
// //     }
// //   };

// //   return (
// //     <div className={styles.container}>
// //       <form onSubmit={handleSubmit} className={styles.form}>
// //         <h2 className={styles.formTitle}>Upload Your Resume</h2>
// //         <div className={styles.input}>
// //           <input
// //             type="file"
// //             className={`${styles.fileInput} ${error ? styles.invalid : ""}`}
// //             onChange={handleFileChange}
// //             aria-label="file example"
// //             required
// //           />
// //           {error && <div className={styles.errorFeedback}>{error}</div>}
// //         </div>
// //         {file && (
// //           <div className={styles.fileName}>Selected file: {file.name}</div>
// //         )}
// //         <button type="submit" className={styles.submitButton}>
// //           Upload
// //         </button>
// //         <div className={styles.actions}>
// //           <button type="button" className={styles.cancel}>
// //             Cancel
// //           </button>
// //           <button type="button" className={styles.save}>
// //             Save
// //           </button>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // };

// // export default Resume;
