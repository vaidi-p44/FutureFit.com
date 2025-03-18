import { useState, useEffect } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import styles from "./PostedJobs.module.css";

const PostedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [searchCompany, setSearchCompany] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    category: "",
    experience: "",
    salary: "",
    description: "",
    requirements: "",
    benefits: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/alljobs"); // Update with backend API
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }
      const data = await response.json();
      setJobs(data.jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const handleEditClick = (job) => {
    setFormData(job);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8081/api/jobs/${formData.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update job");
      }

      setJobs(jobs.map((job) => (job.id === formData.id ? formData : job)));
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const response = await fetch(`http://localhost:8081/api/jobs/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete job");
      }
      setJobs(jobs.filter((job) => job.id !== id));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  // Function to clear all filters
  const handleClearFilters = () => {
    setSearchTitle("");
    setSearchCompany("");
    setSearchLocation("");
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
      job.company.toLowerCase().includes(searchCompany.toLowerCase()) &&
      job.location.toLowerCase().includes(searchLocation.toLowerCase())
  );

  return (
    <div className={styles.postedJobs}>
      <div className={styles.header}>
        <h1>Posted Jobs</h1>
      </div>

      {/* <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div> */}
      {/* Search Inputs */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search by Title..."
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Company..."
          value={searchCompany}
          onChange={(e) => setSearchCompany(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Location..."
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />
        <button onClick={handleClearFilters} className={styles.clearButton}>
          Clear Filters
        </button>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Type</th>
              <th>Category</th>
              <th>Experience</th>
              <th>Salary</th>
              <th>Posted By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.company}</td>
                <td>{job.location}</td>
                <td>{job.type}</td>
                <td>{job.category}</td>
                <td>{job.experience}</td>
                <td>{job.salary}</td>
                <td>{job.companyName || "N/A"}</td>{" "}
                {/* Use fetched company name */}
                <td className={styles.actions}>
                  <button
                    onClick={() => handleViewDetails(job)}
                    className={styles.detailsButton}
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleEditClick(job)}
                    className={styles.editButton}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className={styles.deleteButton}
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Job Details Modal */}
      {showDetails && selectedJob && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Job Details</h2>
            <p>
              <strong>Title:</strong> {selectedJob.title}
            </p>
            <p>
              <strong>Company:</strong> {selectedJob.company}
            </p>
            <p>
              <strong>Location:</strong> {selectedJob.location}
            </p>
            <p>
              <strong>Type:</strong> {selectedJob.type}
            </p>
            <p>
              <strong>Category:</strong> {selectedJob.category}
            </p>
            <p>
              <strong>Experience:</strong> {selectedJob.experience}
            </p>
            <p>
              <strong>Salary:</strong> {selectedJob.salary}
            </p>
            <p>
              <strong>Description:</strong> {selectedJob.description}
            </p>
            <p>
              <strong>Requirements:</strong> {selectedJob.requirements}
            </p>
            <p>
              <strong>Benefits:</strong> {selectedJob.benefits}
            </p>
            <button onClick={handleCloseDetails} className={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {showEditModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Edit Job</h2>
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleEditChange}
                required
              />
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleEditChange}
                required
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleEditChange}
                required
              />
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleEditChange}
                required
              />
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleEditChange}
                required
              />
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleEditChange}
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleEditChange}
                required
              />
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleEditChange}
                required
              />
              <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleEditChange}
                required
              />
              <button type="submit">Update Job</button>
              <button onClick={() => setShowEditModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostedJobs;
