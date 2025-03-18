import { useState } from "react";
import styles from "./EmployeeRegistration.module.css";
import { Building2 } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const EmployeeRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hiringFor: "company",
    companyName: "",
    industry: "",
    employeeCount: "",
    designation: "",
    pincode: "",
    address: "",
    companyLogo: null, // Add company logo
  });

  const [companyLogo, setCompanyLogo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Handle file change
  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      companyLogo: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user_id = localStorage.getItem("user_id");

    if (!user_id) {
      toast.error("User ID is missing. Please log in again.");
      return;
    }
    setLoading(true);

    try {
      const data = new FormData();
      data.append("user_id", user_id);
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });

      // Debugging: Check if file is attached correctly
      for (let [key, value] of data.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axios.post(
        "http://localhost:8081/api/register-employee",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message || "Profile saved successfully!");
        setTimeout(() => {
          navigate("/EmployeeDashboard");
          location.reload();
        }, 2000);
      } else {
        toast.error(response.data.message || "Error saving profile");
      }

      console.log("Form submitted successfully:", response.data);
    } catch (error) {
      console.error("Error response:", error.response?.data || error.message);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.iconSection}>
          <Building2 className={styles.icon} size={32} />
          <p className={styles.description}>
            We use this information to know about the company you're hiring for
            and to generate an invoice
          </p>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Hiring for :</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="hiringFor"
                value="company"
                checked={formData.hiringFor === "company"}
                onChange={handleInputChange}
                className={styles.radioInput}
              />
              Your company
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="hiringFor"
                value="consultancy"
                checked={formData.hiringFor === "consultancy"}
                onChange={handleInputChange}
                className={styles.radioInput}
              />
              A consultancy
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="companyName" className={styles.label}>
            Company <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Enter company name"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="industry" className={styles.label}>
            Select Industry <span className={styles.required}>*</span>
          </label>
          <select
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleInputChange}
            className={styles.select}
            required
          >
            <option value="">Select industry</option>
            <option value="technology">Technology</option>
            <option value="healthcare">Healthcare</option>
            <option value="finance">Finance</option>
            <option value="education">Education</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="employeeCount" className={styles.label}>
            Number of Employees
          </label>
          <select
            id="employeeCount"
            name="employeeCount"
            value={formData.employeeCount}
            onChange={handleInputChange}
            className={styles.select}
          >
            <option value="">Select range</option>
            <option value="1-10">1-10</option>
            <option value="11-50">11-50</option>
            <option value="51-200">51-200</option>
            <option value="201-500">201-500</option>
            <option value="500+">500+</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="designation" className={styles.label}>
            Your Designation <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Enter designation"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="pincode" className={styles.label}>
            Pin Code <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Enter company pincode"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="address" className={styles.label}>
            Company Address <span className={styles.required}>*</span>
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className={styles.textarea}
            placeholder="Enter company address"
            rows={4}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="companyLogo" className={styles.label}>
            Company Logo <span className={styles.required}>*</span>
          </label>
          <input
            type="file"
            id="companyLogo"
            name="companyLogo"
            accept="image/*"
            onChange={handleFileChange}
            className={styles.input}
            required
          />
        </div>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Submitting..." : "Continue"}
        </button>
      </form>
    </div>
  );
};

export default EmployeeRegistration;

// import { useState } from "react";
// import styles from "./EmployeeRegistration.module.css";
// import { Building2 } from "lucide-react";

// const EmployeeRegistration = () => {
//   const [formData, setFormData] = useState({
//     hiringFor: "company",
//     companyName: "",
//     industry: "",
//     employeeCount: "",
//     designation: "",
//     pincode: "",
//     address: "",
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form submitted:", formData);
//     // Handle form submission
//   };

//   return (
//     <div className={styles.container}>
//       <form onSubmit={handleSubmit} className={styles.form}>
//         <div className={styles.iconSection}>
//           <Building2 className={styles.icon} size={32} />
//           <p className={styles.description}>
//             We use this information to know about the company you're hiring for
//             and to generate an invoice
//           </p>
//         </div>

//         <div className={styles.formGroup}>
//           <label className={styles.label}>Hiring for :</label>
//           <div className={styles.radioGroup}>
//             <label className={styles.radioLabel}>
//               <input
//                 type="radio"
//                 name="hiringFor"
//                 value="company"
//                 checked={formData.hiringFor === "company"}
//                 onChange={handleInputChange}
//                 className={styles.radioInput}
//               />
//               your company
//             </label>
//             <label className={styles.radioLabel}>
//               <input
//                 type="radio"
//                 name="hiringFor"
//                 value="consultancy"
//                 checked={formData.hiringFor === "consultancy"}
//                 onChange={handleInputChange}
//                 className={styles.radioInput}
//               />
//               a consultancy
//             </label>
//           </div>
//         </div>

//         <div className={styles.formGroup}>
//           <label htmlFor="companyName" className={styles.label}>
//             Company
//           </label>
//           <input
//             type="text"
//             id="companyName"
//             name="companyName"
//             value={formData.companyName}
//             onChange={handleInputChange}
//             className={styles.input}
//             placeholder="Enter company name"
//           />
//         </div>

//         <div className={styles.formGroup}>
//           <label htmlFor="industry" className={styles.label}>
//             Select industry
//           </label>
//           <select
//             id="industry"
//             name="industry"
//             value={formData.industry}
//             onChange={handleInputChange}
//             className={styles.select}
//           >
//             <option value="">Select industry</option>
//             <option value="technology">Technology</option>
//             <option value="healthcare">Healthcare</option>
//             <option value="finance">Finance</option>
//             <option value="education">Education</option>
//             <option value="other">Other</option>
//           </select>
//         </div>

//         <div className={styles.formGroup}>
//           <label htmlFor="employeeCount" className={styles.label}>
//             Number of employees
//           </label>
//           <select
//             id="employeeCount"
//             name="employeeCount"
//             value={formData.employeeCount}
//             onChange={handleInputChange}
//             className={styles.select}
//           >
//             <option value="">Select range</option>
//             <option value="1-10">1-10</option>
//             <option value="11-50">11-50</option>
//             <option value="51-200">51-200</option>
//             <option value="201-500">201-500</option>
//             <option value="500+">500+</option>
//           </select>
//         </div>

//         <div className={styles.formGroup}>
//           <label htmlFor="designation" className={styles.label}>
//             Your designation
//           </label>
//           <input
//             type="text"
//             id="designation"
//             name="designation"
//             value={formData.designation}
//             onChange={handleInputChange}
//             className={styles.input}
//             placeholder="Enter designation"
//           />
//         </div>

//         <div className={styles.formGroup}>
//           <label htmlFor="pincode" className={styles.label}>
//             Pin code
//           </label>
//           <input
//             type="text"
//             id="pincode"
//             name="pincode"
//             value={formData.pincode}
//             onChange={handleInputChange}
//             className={styles.input}
//             placeholder="Enter company pincode"
//           />
//         </div>

//         <div className={styles.formGroup}>
//           <label htmlFor="address" className={styles.label}>
//             Company address
//           </label>
//           <textarea
//             id="address"
//             name="address"
//             value={formData.address}
//             onChange={handleInputChange}
//             className={styles.textarea}
//             placeholder="Enter company address"
//             rows={4}
//           />
//         </div>

//         <button type="submit" className={styles.button}>
//           Continue
//         </button>
//       </form>
//     </div>
//   );
// };
// export default EmployeeRegistration;
