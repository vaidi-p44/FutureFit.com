import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./CompanyProfile.module.css";

const CompanyProfile = () => {
  const [profile, setProfile] = useState({
    companyName: "",
    industry: "",
    employeeCount: "",
    designation: "",
    pincode: "",
    address: "",
    companyLogo: "",
    hiringFor: "", // ✅ Added hiringFor field
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null); // Store selected file
  const user_id = localStorage.getItem("user_id");

  // Fetch company profile
  const fetchCompanyProfile = async () => {
    try {
      console.log("Fetching company profile for user_id:", user_id);
      const response = await axios.get(
        `http://localhost:8081/api/company-profile/${user_id}`
      );

      if (response.data) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error("Error fetching company profile:", error);
      toast.error("Failed to fetch company details");
    }
  };

  useEffect(() => {
    if (user_id) fetchCompanyProfile();
  }, [user_id]);

  // Handle file selection
  const handleFileChange = (e) => {
    setLogoFile(e.target.files[0]);
  };

  // Handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("user_id", user_id);
      formData.append("companyName", profile.companyName);
      formData.append("industry", profile.industry);
      formData.append("employeeCount", profile.employeeCount);
      formData.append("designation", profile.designation);
      formData.append("pincode", profile.pincode);
      formData.append("address", profile.address);
      formData.append("hiringFor", profile.hiringFor || "Not Specified"); // ✅ Ensuring a default value

      if (logoFile) {
        formData.append("companyLogo", logoFile);
      }

      const response = await axios.post(
        `http://localhost:8081/api/register-employee`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Company profile updated successfully!");
        setIsEditing(false);
        fetchCompanyProfile(); // Refresh data after update
      } else {
        toast.error("Error updating company profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Company Profile</h1>
      <ToastContainer />

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label>Company Name</label>
          <input
            type="text"
            value={profile.companyName}
            onChange={(e) =>
              setProfile({ ...profile, companyName: e.target.value })
            }
            disabled={!isEditing}
          />
        </div>

        <div className={styles.field}>
          <label>Industry</label>
          <input
            type="text"
            value={profile.industry}
            onChange={(e) =>
              setProfile({ ...profile, industry: e.target.value })
            }
            disabled={!isEditing}
          />
        </div>

        <div className={styles.field}>
          <label>Employee Count</label>
          <input
            type="text"
            value={profile.employeeCount}
            onChange={(e) =>
              setProfile({ ...profile, employeeCount: e.target.value })
            }
            disabled={!isEditing}
          />
        </div>

        <div className={styles.field}>
          <label>Designation</label>
          <input
            type="text"
            value={profile.designation}
            onChange={(e) =>
              setProfile({ ...profile, designation: e.target.value })
            }
            disabled={!isEditing}
          />
        </div>

        <div className={styles.field}>
          <label>Pincode</label>
          <input
            type="text"
            value={profile.pincode}
            onChange={(e) =>
              setProfile({ ...profile, pincode: e.target.value })
            }
            disabled={!isEditing}
          />
        </div>

        <div className={styles.field}>
          <label>Address</label>
          <textarea
            value={profile.address}
            onChange={(e) =>
              setProfile({ ...profile, address: e.target.value })
            }
            disabled={!isEditing}
          />
        </div>

        <div className={styles.field}>
          <label>Hiring For</label>
          <input
            type="text"
            value={profile.hiringFor}
            onChange={(e) =>
              setProfile({ ...profile, hiringFor: e.target.value })
            }
            disabled={!isEditing}
          />
        </div>

        <div className={styles.field}>
          <label>Company Logo</label>
          {profile.companyLogo && !isEditing && (
            <img
              src={profile.companyLogo}
              alt="Company Logo"
              className={styles.logoPreview}
            />
          )}
          {isEditing && (
            <input type="file" onChange={handleFileChange} accept="image/*" />
          )}
        </div>

        <div className={styles.actions}>
          {isEditing ? (
            <>
              <button
                type="submit"
                className={styles.saveButton}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              className={styles.editButton}
              onClick={(e) => {
                e.preventDefault(); // ✅ Prevent unintended form submission
                setIsEditing(true);
              }}
            >
              Edit Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CompanyProfile;
