import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./JobPlansPage.module.css"; // Import CSS

const JobPlansPage = () => {
  const [jobPlans, setJobPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobPlans();
  }, []);

  const fetchJobPlans = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/get-all-job-plans"
      );
      setJobPlans(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching job plans:", error);
      setLoading(false);
    }
  };

  const handleCancelPlan = async (planId) => {
    if (!window.confirm("Are you sure you want to cancel this plan?")) return;

    try {
      const response = await axios.post(
        "http://localhost:8081/api/cancel-job-plan",
        {
          planId,
        }
      );

      if (response.data.status === "success") {
        alert("Plan cancelled successfully!");
        fetchJobPlans(); // Refresh the list after deletion
      }
    } catch (error) {
      console.error("Error cancelling job plan:", error);
      alert("Failed to cancel the plan.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>All Employees' Job Plans</h2>
      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Plan Type</th>
              <th>Amount (₹)</th>
              <th>Purchased At</th>
              <th>Expires At</th>
              <th>Job Title</th>
              <th>Company</th>
              <th>Job Status</th>
            </tr>
          </thead>
          <tbody>
            {jobPlans.length > 0 ? (
              jobPlans.map((plan, index) => (
                <tr key={index}>
                  <td>{plan.employee_id}</td>
                  <td>{plan.plan_type}</td>
                  <td>₹{plan.amount}</td>
                  <td>{new Date(plan.purchased_at).toLocaleDateString()}</td>
                  <td>{new Date(plan.expires_at).toLocaleDateString()}</td>
                  <td>{plan.title || "N/A"}</td>
                  <td>{plan.company || "N/A"}</td>
                  <td>{plan.job_status || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className={styles.noData}>
                  No job plans found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default JobPlansPage;
