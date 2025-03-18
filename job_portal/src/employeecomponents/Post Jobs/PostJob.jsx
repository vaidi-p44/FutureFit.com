import React, { useState, useEffect } from "react";
import styles from "./PostJob.module.css";

const PostJob = () => {
  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    type: "full-time",
    category: "",
    experience: "",
    salary: "",
    description: "",
    requirements: "",
    benefits: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [activePlan, setActivePlan] = useState(null);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (userId) {
      checkActivePlan();
    }
  }, [userId]);

  const checkActivePlan = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/get-purchased-plans?employee_id=${userId}`
      );

      const data = await response.json();
      console.log("Fetched Plans:", data);

      if (!Array.isArray(data)) {
        console.error("Unexpected response format for plans:", data);
        setHasActivePlan(false);
        return;
      }

      const currentDate = new Date();
      const validPlans = ["Standard", "Classified", "Hot Vacancy"];

      const activePlan = data.find(
        (plan) =>
          validPlans.includes(plan.plan_type.trim()) &&
          new Date(plan.expires_at) > currentDate
      );

      if (activePlan) {
        console.log("Active Plan Found:", activePlan);
        setActivePlan(activePlan);
        setHasActivePlan(true);

        // Check if a job has already been posted using this plan
        checkPostedJobs(activePlan.id);
      } else {
        console.log("No Active Plan Found");
        setActivePlan(null);
        setHasActivePlan(false);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      setHasActivePlan(false);
    }
  };

  const checkPostedJobs = async (planId) => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/check-posted-jobs?employee_id=${userId}&plan_id=${planId}`
      );

      const result = await response.json();
      console.log("Posted Job Check Response:", result);

      if (result.hasPostedJob) {
        setHasActivePlan(false);
        setErrorMessage("You have already used your plan to post a job.");
      }
    } catch (error) {
      console.error("Error checking posted jobs:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setErrorMessage("User ID is required.");
      return;
    }

    if (!hasActivePlan) {
      setErrorMessage("You need to purchase a job posting plan to post jobs.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...jobData,
          user_id: userId,
          plan_type: activePlan.plan_type,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(result.message);
        setJobData({
          title: "",
          company: "",
          location: "",
          type: "full-time",
          category: "",
          experience: "",
          salary: "",
          description: "",
          requirements: "",
          benefits: "",
        });
        checkActivePlan(); // Recheck plan after posting
      } else {
        throw new Error(result.message || "Error posting job.");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className={styles.postJob}>
      <div className={styles.container}>
        <h1>Post a New Job</h1>
        {!hasActivePlan && (
          <p className={styles.errorMessage}>
            You need to <a href="/EmployeeDashboard">purchase a plan</a> before
            posting jobs.
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Job Title</label>
            <input
              type="text"
              name="title"
              value={jobData.title}
              onChange={handleInputChange}
              required
              placeholder="e.g., Senior React Developer"
              disabled={!hasActivePlan}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Company Name</label>
            <input
              type="text"
              name="company"
              value={jobData.company}
              onChange={handleInputChange}
              required
              placeholder="Your company name"
              disabled={!hasActivePlan}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={jobData.location}
                onChange={handleInputChange}
                required
                placeholder="e.g., New York, NY"
                disabled={!hasActivePlan}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Job Type</label>
              <select
                name="type"
                value={jobData.type}
                onChange={handleInputChange}
                required
                disabled={!hasActivePlan}
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Category</label>
              <select
                name="category"
                value={jobData.category}
                onChange={handleInputChange}
                required
                disabled={!hasActivePlan}
              >
                <option value="">Select Category</option>
                <option value="software">Software Development</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="customer-service">Customer Service</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Experience Level</label>
              <input
                type="text"
                name="experience"
                value={jobData.experience}
                onChange={handleInputChange}
                required
                placeholder="e.g., 3-5 years"
                disabled={!hasActivePlan}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Salary Range</label>
            <input
              type="text"
              name="salary"
              value={jobData.salary}
              onChange={handleInputChange}
              required
              placeholder="e.g., $80,000 - $100,000"
              disabled={!hasActivePlan}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Job Description</label>
            <textarea
              name="description"
              value={jobData.description}
              onChange={handleInputChange}
              required
              placeholder="Detailed description of the job role and responsibilities"
              rows="5"
              disabled={!hasActivePlan}
            ></textarea>
          </div>

          <div className={styles.formGroup}>
            <label>Requirements</label>
            <textarea
              name="requirements"
              value={jobData.requirements}
              onChange={handleInputChange}
              required
              placeholder="List the key requirements and qualifications"
              rows="4"
              disabled={!hasActivePlan}
            ></textarea>
          </div>

          <div className={styles.formGroup}>
            <label>Benefits</label>
            <textarea
              name="benefits"
              value={jobData.benefits}
              onChange={handleInputChange}
              required
              placeholder="List the benefits and perks offered"
              rows="3"
              disabled={!hasActivePlan}
            ></textarea>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!hasActivePlan}
          >
            Post Job
          </button>
        </form>
        {successMessage && (
          <p className={styles.successMessage}>{successMessage}</p>
        )}
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default PostJob;

// import React, { useState } from "react";
// import styles from "./PostJob.module.css";

// const PostJob = () => {
//   const [jobData, setJobData] = useState({
//     title: "",
//     company: "",
//     location: "",
//     type: "full-time",
//     category: "",
//     experience: "",
//     salary: "",
//     description: "",
//     requirements: "",
//     benefits: "",
//   });
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setJobData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const userId = localStorage.getItem("user_id");

//     if (!userId) {
//       setErrorMessage("User ID is required.");
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:8081/api/jobs", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           ...jobData,
//           user_id: userId, // Include user_id in the request body
//         }),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         setSuccessMessage(result.message);
//         setJobData({
//           title: "",
//           company: "",
//           location: "",
//           type: "full-time",
//           category: "",
//           experience: "",
//           salary: "",
//           description: "",
//           requirements: "",
//           benefits: "",
//         });
//       } else {
//         throw new Error("Failed to post job");
//       }
//     } catch (error) {
//       setErrorMessage("Error posting job. Please try again.");
//     }
//   };

//   return (
//     <div className={styles.postJob}>
//       <div className={styles.container}>
//         <h1>Post a New Job</h1>
//         <form onSubmit={handleSubmit}>
//           <div className={styles.formGroup}>
//             <label>Job Title</label>
//             <input
//               type="text"
//               name="title"
//               value={jobData.title}
//               onChange={handleInputChange}
//               required
//               placeholder="e.g., Senior React Developer"
//             />
//           </div>

//           <div className={styles.formGroup}>
//             <label>Company Name</label>
//             <input
//               type="text"
//               name="company"
//               value={jobData.company}
//               onChange={handleInputChange}
//               required
//               placeholder="Your company name"
//             />
//           </div>

//           <div className={styles.formRow}>
//             <div className={styles.formGroup}>
//               <label>Location</label>
//               <input
//                 type="text"
//                 name="location"
//                 value={jobData.location}
//                 onChange={handleInputChange}
//                 required
//                 placeholder="e.g., New York, NY"
//               />
//             </div>

//             <div className={styles.formGroup}>
//               <label>Job Type</label>
//               <select
//                 name="type"
//                 value={jobData.type}
//                 onChange={handleInputChange}
//                 required
//               >
//                 <option value="full-time">Full-time</option>
//                 <option value="part-time">Part-time</option>
//                 <option value="contract">Contract</option>
//                 <option value="internship">Internship</option>
//               </select>
//             </div>
//           </div>

//           <div className={styles.formRow}>
//             <div className={styles.formGroup}>
//               <label>Category</label>
//               <select
//                 name="category"
//                 value={jobData.category}
//                 onChange={handleInputChange}
//                 required
//               >
//                 <option value="">Select Category</option>
//                 <option value="software">Software Development</option>
//                 <option value="design">Design</option>
//                 <option value="marketing">Marketing</option>
//                 <option value="sales">Sales</option>
//                 <option value="customer-service">Customer Service</option>
//               </select>
//             </div>

//             <div className={styles.formGroup}>
//               <label>Experience Level</label>
//               <input
//                 type="text"
//                 name="experience"
//                 value={jobData.experience}
//                 onChange={handleInputChange}
//                 required
//                 placeholder="e.g., 3-5 years"
//               />
//             </div>
//           </div>

//           <div className={styles.formGroup}>
//             <label>Salary Range</label>
//             <input
//               type="text"
//               name="salary"
//               value={jobData.salary}
//               onChange={handleInputChange}
//               required
//               placeholder="e.g., $80,000 - $100,000"
//             />
//           </div>

//           <div className={styles.formGroup}>
//             <label>Job Description</label>
//             <textarea
//               name="description"
//               value={jobData.description}
//               onChange={handleInputChange}
//               required
//               placeholder="Detailed description of the job role and responsibilities"
//               rows="5"
//             ></textarea>
//           </div>

//           <div className={styles.formGroup}>
//             <label>Requirements</label>
//             <textarea
//               name="requirements"
//               value={jobData.requirements}
//               onChange={handleInputChange}
//               required
//               placeholder="List the key requirements and qualifications"
//               rows="4"
//             ></textarea>
//           </div>

//           <div className={styles.formGroup}>
//             <label>Benefits</label>
//             <textarea
//               name="benefits"
//               value={jobData.benefits}
//               onChange={handleInputChange}
//               required
//               placeholder="List the benefits and perks offered"
//               rows="3"
//             ></textarea>
//           </div>

//           <button type="submit" className={styles.submitBtn}>
//             Post Job
//           </button>
//         </form>
//         {successMessage && (
//           <p className={styles.successMessage}>{successMessage}</p>
//         )}
//         {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
//       </div>
//     </div>
//   );
// };

// export default PostJob;
