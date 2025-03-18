import React, { useState, useEffect } from "react";
import styles from "./CareerPreferences.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const CareerPreferences = ({ cData }) => {
  const [lookingFor, setLookingFor] = useState("Internships");
  const [availability, setAvailability] = useState("Immediately");
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState("");

  const [values, setValues] = useState({
    looking_for: cData?.looking_for || "Internships",
    available_time: cData?.available_time || "Immediatelys",
    preferred_location: cData?.preferred_location || "",
  });
  useEffect(() => {
    if (cData && Object.keys(cData).length > 0) {
      setValues({
        looking_for: cData.looking_for || "Internships",
        available_time: cData.available_time || "Immediately",
        preferred_location: cData.preferred_location || "",
      });
    }
  }, [cData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleLookingForChange = (option) => {
    const validOptions = ["Internships", "Jobs"];
    if (validOptions.includes(option)) {
      setValues((prevValues) => ({ ...prevValues, looking_for: option }));
      setLookingFor(option);
    } else {
      console.error("Invalid option for looking_for:", option);
    }
  };

  const handleAvailabilityChange = (duration) => {
    const validDurations = [
      "Immediately",
      "1 Month",
      "2 Months",
      "3 Months",
      "More than 3 Months",
    ];

    if (validDurations.includes(duration)) {
      setValues((prevValues) => ({
        ...prevValues,
        available_time: duration,
      }));
    } else {
      console.error("Invalid duration:", duration);
    }
  };

  const handleAddLocation = () => {
    if (newLocation && !locations.includes(newLocation)) {
      setLocations([...locations, newLocation]);
      setValues((prevValues) => ({
        ...prevValues,
        preferred_location: [...locations, newLocation].join(", "),
      }));
      setNewLocation("");
    }
  };

  const handleRemoveLocation = (location) => {
    const updatedLocations = locations.filter((loc) => loc !== location);
    setLocations(updatedLocations);
    setValues((prevValues) => ({
      ...prevValues,
      preferred_location: updatedLocations.join(", "),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    console.log("Final submitted values:", values); // Ensure it's not empty

    if (
      !values.looking_for ||
      !values.available_time ||
      !values.preferred_location
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    const user_id = localStorage.getItem("user_id");
    console.log("Retrieved user_id from localStorage:", user_id);

    if (!user_id) {
      toast.error("User ID is missing. Please log in again.");
      return;
    }

    const careerData = {
      user_id,
      ...values,
    };

    try {
      const response = await axios.post(
        "http://localhost:8081/api/careerpreferences",
        careerData
      );

      if (response.status === 200 || response.status === 201) {
        toast.success(
          response.data.message || "Career details saved successfully!"
        );
      } else {
        toast.error(response.data.message || "Failed to save career details.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while saving career details."
      );
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <h2 className={styles.formTitle}>Career Preferences</h2>

        <div className={styles.field}>
          <label>Looking for</label>
          <div className={styles.options}>
            <button
              type="button"
              className={`${styles.optionButton} ${values.looking_for === "Internships" ? styles.active : ""}`}
              onClick={() => handleLookingForChange("Internships")}
            >
              Internships
            </button>

            <button
              type="button"
              className={`${styles.optionButton} ${values.looking_for === "Jobs" ? styles.active : ""}`}
              onClick={() => handleLookingForChange("Jobs")}
            >
              Jobs
            </button>
          </div>
        </div>

        <div className={styles.field}>
          <label>Availability to work</label>
          <div className={styles.options}>
            {[
              "Immediately",
              "1 Month",
              "2 Months",
              "3 Months",
              "More than 3 Months",
            ].map((duration) => (
              <button
                type="button"
                key={duration}
                className={`${styles.optionButton} ${values.available_time === duration ? styles.active : ""}`}
                onClick={() => handleAvailabilityChange(duration)}
              >
                {duration}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label>Preferred work location(s)</label>
          <div className={styles.locations}>
            {locations.length > 0 ? (
              locations.map((location) => (
                <span key={location} className={styles.location}>
                  {location}
                  <button
                    type="button"
                    name="preferred_location"
                    value={values.preferred_location}
                    onClick={() => handleRemoveLocation(location)}
                  >
                    ×
                  </button>
                </span>
              ))
            ) : (
              <p>No preferred locations provided.</p>
            )}
          </div>
          <div className={styles.addLocation}>
            <input
              type="text"
              placeholder="Select from the list"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
            />
            <button type="button" onClick={handleAddLocation}>
              Add
            </button>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.cancel}>
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className={styles.saveButton}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CareerPreferences;
