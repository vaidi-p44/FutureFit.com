import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./FindTalentPage.module.css";
import page from "../assets/page.jpg";

const normalizeString = (str) => {
  return str?.toLowerCase().replace(/[^a-z0-9]/g, "");
};
const FindTalentPage = () => {
  const [jobSeekers, setJobSeekers] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [allRequests, setAllRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [previousRequest, setPreviousRequest] = useState(null); // Stores fetched request
  const [allCandidates, setAllCandidates] = useState([]); // Store all candidates
  const [filteredCandidates, setFilteredCandidates] = useState([]); // Store filtered results

  const [filters, setFilters] = useState({
    workStatus: "",
    currentPost: "",
    skills: "",
    location: "",
    languages: "",
    education: "",
    jobType: "",
  });

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    fetchAllRequests();
    fetchPreviousRequest();
  }, []);

  const fetchAllRequests = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/get-requests/${userId}`
      );
      const data = await response.json();

      if (data.status === "success") {
        // ✅ Filter out cancelled requests
        const activeRequests = data.data.filter(
          (request) => request.status !== "Cancelled"
        );
        setAllRequests(activeRequests);
      } else {
        toast.info("No previous requests found.");
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to load request details.");
    }
  };

  const fetchPreviousRequest = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/get-request/${userId}`
      );
      const data = await response.json();

      if (data.status === "success") {
        setPreviousRequest(data.data);
      } else {
        toast.info("No previous request found.");
      }
    } catch (error) {
      console.error("Error fetching previous request:", error);
      toast.error("Failed to load request details.");
    }
  };

  useEffect(() => {
    if (previousRequest) {
      fetchFilteredCandidates();
    }
  }, [previousRequest]); // ✅ Fetch candidates when `previousRequest` is available

  const fetchFilteredCandidates = async () => {
    if (!previousRequest) {
      toast.error("Please submit a request first.");
      return;
    }

    console.log("Previous Request:", previousRequest); // Debugging

    try {
      let allCandidates = [];

      // Ensure skills are formatted properly
      let skillsQuery = Array.isArray(previousRequest.skills)
        ? previousRequest.skills
            .map((skill) => skill.trim().replace(/\s+/g, ""))
            .join(",")
        : previousRequest.skills?.trim().replace(/\s+/g, "");

      console.log("Formatted Skills Query:", skillsQuery); // Debugging

      if (!skillsQuery) {
        toast.error("Please specify at least one skill.");
        return;
      }

      // Fetch candidates matching requested work status
      const apiUrl = `http://localhost:8081/api/candidates?workStatus=${previousRequest.work_status}&currentPost=${previousRequest.current_post}&skills=${skillsQuery}`;

      console.log("Fetching API:", apiUrl); // Debugging

      let response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`API error: ${response.statusText}`);

      let data = await response.json();
      console.log("API Response - First Fetch:", data);

      if (data?.data?.length > 0) {
        allCandidates = [...data.data];
      }

      // Fetch opposite work status candidates
      let oppositeWorkStatus =
        previousRequest.work_status === "Fresher" ? "Experienced" : "Fresher";
      const oppositeApiUrl = `http://localhost:8081/api/candidates?workStatus=${oppositeWorkStatus}&skills=${skillsQuery}`;

      console.log("Fetching Opposite Work Status API:", oppositeApiUrl); // Debugging

      response = await fetch(oppositeApiUrl);
      if (!response.ok) throw new Error(`API error: ${response.statusText}`);

      data = await response.json();
      console.log("API Response - Second Fetch:", data);

      if (data?.data?.length > 0) {
        const remainingCandidates = data.data.filter(
          (candidate) =>
            !allCandidates.some((c) => c.user_id === candidate.user_id)
        );
        allCandidates = [...allCandidates, ...remainingCandidates];
      }

      if (allCandidates.length > 0) {
        allCandidates.sort((a, b) =>
          a.work_status === previousRequest.work_status ? -1 : 1
        );

        setAllCandidates(allCandidates);
        setJobSeekers(allCandidates);
        setShowResults(true);
        toast.success("Candidates fetched successfully!");
      } else {
        setAllCandidates([]);
        setJobSeekers([]);
        setShowResults(true);
        toast.info("No job seekers found.");
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value, // ✅ Update filter values dynamically
    }));
  };

  // 🔹 Automatically filter candidates when `filters` change
  useEffect(() => {
    applyFilters();
  }, [filters]); // ✅ Filters apply dynamically

  const applyFilters = () => {
    let filtered = allCandidates.filter((candidate) => {
      return (
        (!filters.workStatus || candidate.work_status === filters.workStatus) &&
        (!filters.currentPost ||
          candidate.current_post
            ?.toLowerCase()
            .includes(filters.currentPost.toLowerCase())) &&
        (!filters.skills ||
          (Array.isArray(candidate.skills)
            ? candidate.skills.some((skill) =>
                normalizeString(skill).includes(normalizeString(filters.skills))
              )
            : normalizeString(candidate.skills).includes(
                normalizeString(filters.skills)
              ))) &&
        (!filters.location ||
          (candidate.city?.toLowerCase() || "").includes(
            filters.location.toLowerCase()
          )) &&
        (!filters.languages ||
          candidate.languages?.some((lang) =>
            lang.toLowerCase().includes(filters.languages.toLowerCase())
          )) &&
        (!filters.education ||
          candidate.education_details?.some((edu) =>
            edu.toLowerCase().includes(filters.education.toLowerCase())
          )) &&
        (!filters.jobType ||
          candidate.jobType?.toLowerCase() === filters.jobType.toLowerCase())
      );
    });

    console.log("Filtered Candidates:", filtered); // Debugging
    setJobSeekers(filtered);
  };

  const handleClearFilters = () => {
    setFilters({
      location: "",
      languages: "",
      education: "",
      jobType: "",
    });

    setJobSeekers(allCandidates); // ✅ Restore full candidate list
  };

  const handleViewProfile = (candidate) => {
    console.log("Selected Candidate:", candidate); // Debugging
    setSelectedCandidate(candidate);
  };

  return (
    <>
      <div className={styles.findTalentPage}>
        <h1>Find Talent</h1>

        {/* 🔹 Filter Section */}
        <div className={styles.filterSection}>
          {allRequests.length > 0 ? (
            <div className={styles.requestDropdown}>
              <select
                onChange={(e) => {
                  const selected = allRequests.find(
                    (req) => req.id === parseInt(e.target.value)
                  );
                  setPreviousRequest(selected || null);
                }}
              >
                <option value="">-- Select Previous Request --</option>
                {allRequests.map((req) => (
                  <option key={req.id} value={req.id}>
                    {req.current_post} - {req.skills} ({req.work_status})
                  </option>
                ))}
              </select>
              <button
                className={styles.newRequestButton}
                onClick={() => (window.location.href = "/resdex")}
              >
                Make New Request
              </button>
            </div>
          ) : (
            <p className={styles.noRequestsMessage}>
              No previous requests available.
            </p>
          )}

          {previousRequest ? (
            <>
              <input type="text" value={previousRequest.work_status} readOnly />

              <input
                type="text"
                value={previousRequest.current_post}
                readOnly
              />

              <input type="text" value={previousRequest.skills} readOnly />
            </>
          ) : (
            <p>No previous request found.</p>
          )}
          <input
            type="number"
            name="experience"
            placeholder="Experience (Years)"
            value={filters.experience} // ✅ Controlled input
            onChange={handleFilterChange}
            disabled={filters.workStatus === "Fresher"}
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={filters.location} // ✅ Controlled input
            onChange={handleFilterChange}
          />

          <input
            type="text"
            name="languages"
            placeholder="Languages"
            value={filters.languages} // ✅ Controlled input
            onChange={handleFilterChange}
          />

          <input
            type="text"
            name="education"
            placeholder="Education"
            value={filters.education} // ✅ Controlled input
            onChange={handleFilterChange}
          />

          <select
            name="jobType"
            value={filters.jobType}
            onChange={handleFilterChange}
          >
            <option value="">Select Job Type</option>
            <option value="Internships">Internships</option>
            <option value="Job">Job</option>
          </select>

          <button onClick={handleClearFilters}>Clear Filters</button>
        </div>

        {!showResults && (
          <>
            <div className={styles.find}>
              <div className={styles.font_container}>
                <div className={styles.font}>
                  Find <span className={styles.text}>perfact</span> Talent{" "}
                  <span className={styles.text}>Fit</span> for you
                </div>
              </div>
              <div className={styles.pageimg}>
                <img src={page} alt="Future Fit" />
              </div>
            </div>
          </>
        )}
        {/* 🔹 Show Results Only After Clicking Button */}
        {showResults && (
          <div className={styles.resultsContainer}>
            {jobSeekers.length === 0 ? (
              <p>No job seekers found.</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Profile</th>
                    <th>Full Name</th>
                    <th>work status</th>
                    <th>Current Post</th>
                    <th>Experience</th>
                    <th>Skills</th>
                    <th>Location</th>
                    <th>Languages</th>
                    <th>Education</th>
                    <th>Resume</th>
                    <th>View Profile</th>
                  </tr>
                </thead>
                <tbody>
                  {jobSeekers.map((seeker) => (
                    <tr key={seeker.user_id}>
                      <td>
                        {seeker.profile_photo ? (
                          <img
                            src={seeker.profile_photo}
                            alt="Profile"
                            className={styles.profilePhoto}
                          />
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>{seeker.full_name || "N/A"}</td>
                      <td>{seeker.work_status || "N/A"}</td>
                      <td>
                        {seeker.work_status === "Fresher"
                          ? "N/A"
                          : seeker.current_post || "N/A"}
                      </td>

                      <td>
                        {seeker.work_status === "Fresher"
                          ? "N/A"
                          : seeker.total_experience || "N/A"}{" "}
                        years
                      </td>
                      <td>
                        {seeker.skills.length > 0
                          ? seeker.skills.join(", ")
                          : "N/A"}
                      </td>
                      <td>{seeker.city || "N/A"}</td>

                      <td>
                        {Array.isArray(seeker.languages) &&
                        seeker.languages.length > 0 ? (
                          <ul>
                            {seeker.languages.map((lang, index) => (
                              <li key={index}>{lang}</li>
                            ))}
                          </ul>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>
                        {seeker.education_details.length > 0
                          ? seeker.education_details.map((edu, index) => (
                              <div key={index}>{edu}</div>
                            ))
                          : "N/A"}
                      </td>
                      <td>
                        {seeker.resume_url ? (
                          <a
                            href={seeker.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Resume
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>
                        <button
                          className={styles.viewProfileButton}
                          onClick={() => handleViewProfile(seeker)}
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* 🔹 Profile Modal */}
        {selectedCandidate && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
              <button
                className={styles.closeButton}
                onClick={() => setSelectedCandidate(null)}
              >
                &times;
              </button>

              {/* Profile Header */}
              <div className={styles.profileHeader}>
                <div className={styles.profileImageContainer}>
                  {selectedCandidate.profile_photo ? (
                    <img
                      src={selectedCandidate.profile_photo}
                      alt="Profile"
                      className={styles.profileImage}
                    />
                  ) : (
                    <div className={styles.placeholderImage}>No Image</div>
                  )}
                </div>
                <div className={styles.profileInfo}>
                  <h2>{selectedCandidate.full_name}</h2>
                  <p className={styles.workStatus}>
                    {selectedCandidate.work_status}
                  </p>
                  {selectedCandidate.work_status?.toLowerCase() !==
                    "fresher" && (
                    <p>
                      <strong>Current Post:</strong>{" "}
                      {selectedCandidate.current_post || "N/A"}
                    </p>
                  )}
                </div>
              </div>

              {/* Profile Details */}
              <div className={styles.profileDetails}>
                <div className={styles.detailItem}>
                  <span>Email:</span> {selectedCandidate.user_email || "N/A"}
                </div>
                <div className={styles.detailItem}>
                  <span>Mobile:</span> {selectedCandidate.user_mobile || "N/A"}
                </div>
                {selectedCandidate.work_status?.toLowerCase() !== "fresher" && (
                  <div className={styles.detailItem}>
                    <span>Experience:</span>{" "}
                    {selectedCandidate.total_experience
                      ? `${selectedCandidate.total_experience} years`
                      : "N/A"}
                  </div>
                )}
                <div className={styles.detailItem}>
                  <span>Skills:</span>{" "}
                  {selectedCandidate.skills
                    ? JSON.parse(selectedCandidate.skills).join(", ")
                    : "N/A"}
                </div>
                <div className={styles.detailItem}>
                  <span>Languages:</span>{" "}
                  {selectedCandidate.languages
                    ? Array.isArray(selectedCandidate.languages)
                      ? selectedCandidate.languages.join(", ")
                      : JSON.parse(selectedCandidate.languages).join(", ")
                    : "N/A"}
                </div>

                <div className={styles.detailItem}>
                  <span>Education:</span>{" "}
                  {Array.isArray(selectedCandidate.education_details)
                    ? selectedCandidate.education_details.join(", ")
                    : selectedCandidate.education_details || "N/A"}
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.buttonContainer}>
                <button className={styles.offerButton}>
                  Send Job Offer Request
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 🔹 Toast Container */}
        <ToastContainer />
      </div>
    </>
  );
};

export default FindTalentPage;
