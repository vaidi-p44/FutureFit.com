import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Aboutyou.module.css";
import { FaUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCity } from "react-icons/fa";
import { MdRealEstateAgent } from "react-icons/md";
import { FaAddressCard } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { MdWork } from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";
import { IoBagCheck } from "react-icons/io5";

const Aboutyou = ({ userData }) => {
  const navigate = useNavigate();
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(
    userData?.profile_photo || null
  );
  const [values, setValues] = useState({
    Full_name: userData?.full_name || "",
    nick_name: userData?.nick_name || "",
    gender: userData?.gender || "",
    Dob: userData?.dob
      ? new Date(userData.dob).toISOString().split("T")[0]
      : "",
    City: userData?.city || "",
    State: userData?.state || "",
    address: userData?.address || "",
    workStatus: userData?.work_status || "fresher",
    totalExperience: userData?.total_experience || "", // Ensure it gets a default value
    currentSalary: userData?.current_salary || "",
    currentPost: userData?.current_post || "",
  });

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userData) {
      setProfilePhotoUrl(userData.profile_photo);
      setValues({
        Full_name: userData.full_name || "",
        nick_name: userData.nick_name || "",
        gender: userData.gender || "",
        Dob: userData.dob
          ? new Date(userData.dob).toISOString().split("T")[0]
          : "",
        City: userData.city || "",
        State: userData.state || "",
        address: userData.address || "",
        workStatus: userData.work_status || "fresher",
        totalExperience: userData.total_experience || "",
        currentSalary: userData.current_salary || "",
        currentPost: userData.current_post || "",
      });
    }
  }, [userData]);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      if (["image/jpeg", "image/png"].includes(uploadedFile.type)) {
        setFile(uploadedFile);
        setError("");
      } else {
        setFile(null);
        setError("Please upload a valid image file (JPG or PNG only).");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "totalExperience") {
      setValues({ ...values, [name]: value }); // Keep full value like "1 year"
    } else {
      setValues({ ...values, [name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("user_id", localStorage.getItem("user_id"));
    formData.append("full_name", values.Full_name);
    formData.append("nick_name", values.nick_name);
    formData.append("gender", values.gender);
    formData.append("dob", values.Dob);
    formData.append("city", values.City);
    formData.append("state", values.State);
    formData.append("address", values.address);
    formData.append("work_status", values.workStatus);
    if (values.workStatus === "experienced") {
      formData.append("total_experience", values.totalExperience);
      formData.append("current_salary", values.currentSalary);
      formData.append("current_post", values.currentPost);
    }
    if (file) {
      formData.append("profile_Photo", file);
    }

    try {
      const response = await axios.post(
        "http://localhost:8081/api/Aboutyou",
        formData,
        {
          timeout: 60000,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message || "Profile saved successfully!");
        setTimeout(() => {
          navigate("/EducationForm");
          location.reload();
        }, 2000);
      } else {
        toast.error(response.data.message || "Error saving profile");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to save profile. Please try again."
      );
    }
  };

  return (
    <div className={styles.registerContainer}>
      <ToastContainer />

      <form className={styles.registerForm} onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>About You</h2>
        {profilePhotoUrl && (
          <div className={styles.profileIcon}>
            <img
              src={profilePhotoUrl}
              alt="Profile"
              className={styles.profileImg}
            />
          </div>
        )}

        <div>
          <label>Enter Full Name</label>
          <div className={styles.input}>
            <input
              type="text"
              name="Full_name"
              value={values.Full_name}
              placeholder="Enter your full name"
              className={styles.inputField}
              onChange={handleChange}
              required
              autoComplete="off"
            />
            <FaUser className={styles.icon} />
          </div>
        </div>
        <div>
          <label>Enter nick Name</label>
          <div className={styles.input}>
            <input
              type="text"
              name="nick_name"
              value={values.nick_name}
              placeholder="Enter your nick name"
              className={styles.inputField}
              onChange={handleChange}
              required
              autoComplete="off"
            />
            <FaUser className={styles.icon} />
          </div>
        </div>
        <label>Gender:</label>
        <div className={styles.input_gender}>
          <div>
            <label htmlFor="Male" className={styles.radios}>
              Male
              <input
                className={styles.radiobtn}
                type="radio"
                name="gender"
                value="Male"
                id="Male"
                checked={values.gender === "Male"} // Ensures the correct radio button is checked
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label htmlFor="Female" className={styles.radios}>
              Female
              <input
                className={styles.radiobtn}
                type="radio"
                name="gender"
                value="Female"
                id="Female"
                checked={values.gender === "Female"} // Ensures the correct radio button is checked
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label htmlFor="Other" className={styles.radios}>
              Other
              <input
                className={styles.radiobtn}
                type="radio"
                name="gender"
                value="Other"
                id="Other"
                checked={values.gender === "Other"} // Ensures the correct radio button is checked
                onChange={handleChange}
              />
            </label>
          </div>
        </div>
        <div className={styles.dob}>
          <label htmlFor="Dob">Birth Date </label>
          <div className={styles.input}>
            <input
              type="date"
              name="Dob"
              placeholder="Enter Birth Date"
              id="Dob"
              value={values.Dob} // Bind DOB to the state value
              className={styles.inputField}
              onChange={handleChange}
              required
              autoComplete="off"
            />
            <MdDateRange className={styles.icon} />
          </div>
        </div>
        <div>
          <label htmlFor="City">City </label>
          <div className={styles.input}>
            <input
              type="text"
              name="City"
              placeholder="Enter your City"
              id="City"
              value={values.City}
              className={styles.inputField}
              onChange={handleChange}
              required
              autoComplete="off"
            />
            <FaCity className={styles.icon} />
          </div>
        </div>
        <div>
          <label htmlFor="State">State </label>
          <div className={styles.input}>
            <input
              type="text"
              name="State"
              placeholder="Enter your State"
              id="State"
              value={values.State}
              className={styles.inputField}
              onChange={handleChange}
              required
              autoComplete="off"
            />
            <MdRealEstateAgent className={styles.icon} />
          </div>
        </div>
        <div>
          <label htmlFor="address">Address</label>
          <div className={styles.input}>
            <input
              type="text"
              name="address"
              placeholder="Enter your Address"
              id="Address"
              value={values.address}
              className={styles.inputField}
              onChange={handleChange}
              required
              autoComplete="off"
            />
            <FaAddressCard className={styles.icon} />
          </div>
        </div>

        <div>
          <label>Work Status</label>
          <div className={styles.input_gender}>
            <label htmlFor="fresher" className={styles.radios}>
              Fresher
              <input
                className={styles.radiobtn}
                type="radio"
                name="workStatus"
                value="fresher"
                checked={values.workStatus === "fresher"}
                onChange={handleChange}
              />
            </label>
            <label htmlFor="experienced" className={styles.radios}>
              Experienced
              <input
                className={styles.radiobtn}
                type="radio"
                name="workStatus"
                value="experienced"
                checked={values.workStatus === "experienced"}
                onChange={handleChange}
              />
            </label>
          </div>
        </div>

        {values.workStatus === "experienced" && (
          <>
            <div>
              <label htmlFor="totalExperience">Total Experience (years)</label>
              <select
                name="totalExperience"
                id="totalExperience"
                value={values.totalExperience}
                onChange={handleChange}
                className={styles.dropdown}
                required
              >
                <option value="">Enter Experience year</option>
                <option value="1 year">1 year</option>
                <option value="2 year">2 years</option>
                <option value="3 year">3 years</option>
                <option value="4 year">4 years</option>
                <option value="5 year">5 years</option>
                <option value="10 year">10 years</option>
                <option value="10+ year">10+ years</option>
              </select>
            </div>
            <div>
              <label htmlFor="currentPost">Current Post </label>
              <div className={styles.input}>
                <input
                  type="text"
                  name="currentPost"
                  id="currentPost"
                  value={values.currentPost}
                  className={styles.inputField}
                  onChange={handleChange}
                  required
                />
                <IoBagCheck className={styles.icon} />
              </div>
            </div>
            <div>
              <label htmlFor="currentSalary">Current Salary (₹/year)</label>
              <div className={styles.input}>
                <input
                  type="text"
                  name="currentSalary"
                  id="currentSalary"
                  value={values.currentSalary}
                  className={styles.inputField}
                  onChange={handleChange}
                  required
                />
                <FaRupeeSign className={styles.icon} />
              </div>
            </div>
          </>
        )}
        <div className={styles.input}>
          <input
            type="file"
            className={`${styles.fileInput} ${error ? styles.invalid : ""}`}
            onChange={handleFileChange}
            aria-label="Choose a profile photo (JPG or PNG)"
            accept="image/jpg, image/png"
          />
          {error && <div className={styles.errorFeedback}>{error}</div>}
        </div>
        {/* {file && (
            <div className={styles.fileName}>Selected file: {file.name}</div>
          )}
          <button type="submit" className={styles.submitButton}>
            Upload
          </button> */}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancel}
            onClick={() => navigate("/ProfileSection")} // Replace with your desired route
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
export default Aboutyou;
