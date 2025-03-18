import React, { useEffect, useState } from "react";
import styles from "./Employeerequest.module.css";
import axios from "axios";

const Employeerequest = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/get-all-requests"
      );
      console.log("🔹 Fetching Requests:", response.data.data);
      setRequests(response.data.data);
      setFilteredRequests(response.data.data); // Initialize filteredRequests with all data
      setLoading(false);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError("Failed to load requests");
      setLoading(false);
    }
  };

  // 🔹 Search Filter Logic
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredRequests(requests); // Reset if search is empty
    } else {
      const filtered = requests.filter(
        (request) =>
          request.company_name?.toLowerCase().includes(term) ||
          request.work_status?.toLowerCase().includes(term) ||
          request.current_post?.toLowerCase().includes(term) ||
          request.skills?.toLowerCase().includes(term) ||
          request.payment_status?.toLowerCase().includes(term) ||
          request.status?.toLowerCase().includes(term)
      );
      setFilteredRequests(filtered);
    }
  };

  // 🔹 Clear Filter
  const clearFilter = () => {
    setSearchTerm("");
    setFilteredRequests(requests);
  };
  const acceptRequest = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:8081/api/accept-request/${id}`
      );

      if (response.data.status === "success") {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === id ? { ...req, status: "Active" } : req
          )
        );
        setFilteredRequests((prev) =>
          prev.map((req) =>
            req.id === id ? { ...req, status: "Active" } : req
          )
        );
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      alert("Failed to accept request. Please try again.");
    }
  };

  // 🔹 Cancel Request (Admin Action)
  const cancelRequest = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:8081/api/cancel-request/${id}`
      );

      if (response.data.message === "Request cancelled successfully.") {
        console.log("🔹 Cancelled Request:", response.data.data); // Check updated status
        fetchRequests(); // Refresh data immediately
      }
    } catch (error) {
      console.error("Error cancelling request:", error);
      alert("Failed to cancel request. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Employee Requests</h2>

      {/* 🔹 Search Input */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search requests..."
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchInput}
        />
        <button onClick={clearFilter} className={styles.clearButton}>
          Clear Filter
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Company Name</th>
              <th>Work Status</th>
              <th>Current Post</th>
              <th>Skills</th>
              <th>Requested At</th>
              <th>Payment Status</th>
              <th>Request Status</th>
              <th>Action</th> {/* New Action Column */}
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.user_id}</td>
                  <td>{request.company_name || "N/A"}</td>
                  <td>{request.work_status}</td>
                  <td>{request.current_post}</td>
                  <td>{request.skills}</td>
                  <td>{new Date(request.created_at).toLocaleString()}</td>
                  <td>
                    {request.payment_status === "success" ? "Paid" : "Not Paid"}
                  </td>
                  <td
                    style={{
                      color:
                        request.status === "Cancelled"
                          ? "red"
                          : request.status === "Active"
                          ? "green"
                          : "gray",
                      fontWeight: "bold",
                    }}
                  >
                    {request.status}
                  </td>
                  <td>
                    {request.status === "Cancelled" ? (
                      <button
                        className={styles.acceptButton}
                        onClick={() => acceptRequest(request.id)}
                      >
                        Accept Request
                      </button>
                    ) : request.status === "Active" ? (
                      <button
                        className={styles.cancelButton}
                        onClick={() => cancelRequest(request.id)}
                      >
                        Cancel Request
                      </button>
                    ) : (
                      <button
                        className={styles.acceptButton}
                        onClick={() => acceptRequest(request.id)}
                      >
                        Accept Request
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  style={{ textAlign: "center", fontWeight: "bold" }}
                >
                  No matching requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Employeerequest;
