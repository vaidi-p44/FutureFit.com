import { useState, useEffect } from "react";
import styles from "./FeedbackPage.module.css";

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("latest");
  const [response, setResponse] = useState("");

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/all");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Full API Response:", data);

      if (!data || typeof data !== "object") {
        throw new Error("Invalid API response format");
      }

      const jobSeekerFeedback = Array.isArray(data.jobSeekerFeedback)
        ? data.jobSeekerFeedback
        : data.jobSeekerFeedback
        ? [data.jobSeekerFeedback]
        : [];
      const employeeFeedback = Array.isArray(data.employeeFeedback)
        ? data.employeeFeedback
        : data.employeeFeedback
        ? [data.employeeFeedback]
        : [];

      const combinedFeedbacks = [
        ...jobSeekerFeedback.map((fb) => ({
          ...fb,
          userType: "Job Seeker",
          displayName: fb.full_name, // Show full name for job seekers
        })),
        ...employeeFeedback.map((fb) => ({
          ...fb,
          userType: "Employee",
          displayName: fb.companyName, // Show company name for employees
        })),
      ];

      console.log("Processed feedback array:", combinedFeedbacks);
      setFeedbacks(combinedFeedbacks);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  const handleResponse = async (id) => {
    await fetch(`http://localhost:8081/api/feedback/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ response }),
    });
    setResponse("");
    fetchFeedbacks();
  };

  const handleResolve = async (id, userType) => {
    console.log("Resolving feedback:", { id, userType }); // Debug log

    await fetch(`http://localhost:8081/api/resolve/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userType }),
    });

    fetchFeedbacks(); // Refresh the feedback list
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };

  // Convert rating number into stars
  const renderStars = (rating) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  const filteredFeedbacks = feedbacks.filter((fb) =>
    filter === "all" ? true : fb.status === filter
  );

  const sortedFeedbacks = filteredFeedbacks.sort((a, b) =>
    sort === "latest"
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date)
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>User Feedback</h1>
      <div className={styles.filters}>
        <select onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>
        <select onChange={(e) => setSort(e.target.value)}>
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
      <div className={styles.feedbackGrid}>
        {sortedFeedbacks.length === 0 ? (
          <p className={styles.noFeedback}>No feedback available.</p>
        ) : (
          sortedFeedbacks.map((fb, index) => (
            <div
              key={`${fb.id ? fb.id : "fallback"}-${index}`}
              className={styles.feedbackCard}
            >
              <h3 className={styles.userType}>{fb.userType}</h3>
              <p className={styles.name}>👤 {fb.displayName || "N/A"}</p>
              <p className={styles.email}>📧 {fb.user_email}</p>
              <p className={styles.date}>🕒 {formatDate(fb.date)}</p>
              <p className={styles.rating}>{renderStars(fb.rating)}</p>
              <p className={styles.review}>📝 {fb.message}</p>
              <p className={styles.status}>Status: {fb.status}</p>
              <textarea
                className={styles.textarea}
                placeholder="Write a response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
              />
              <button
                onClick={() => handleResponse(fb.id)}
                className={styles.sendButton}
              >
                Send
              </button>
              <button
                onClick={() => handleResolve(fb.id, fb.userType)}
                className={styles.resolveButton}
              >
                Mark as Resolved
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;

// import { useState, useEffect } from "react";
// import styles from "./FeedbackPage.module.css";

// const FeedbackPage = () => {
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [filter, setFilter] = useState("all");
//   const [sort, setSort] = useState("latest");
//   const [response, setResponse] = useState("");

//   useEffect(() => {
//     fetchFeedbacks();
//   }, []);

//   const fetchFeedbacks = async () => {
//     try {
//       const response = await fetch("http://localhost:8081/api/all");
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("Full API Response:", data); // Debugging

//       if (!data || typeof data !== "object") {
//         throw new Error("Invalid API response format");
//       }

//       // Ensure jobSeekerFeedback and employeeFeedback are in array format
//       const jobSeekerFeedback = Array.isArray(data.jobSeekerFeedback)
//         ? data.jobSeekerFeedback
//         : data.jobSeekerFeedback
//         ? [data.jobSeekerFeedback] // Convert single object to array
//         : [];

//       const employeeFeedback = Array.isArray(data.employeeFeedback)
//         ? data.employeeFeedback
//         : [];

//       const combinedFeedbacks = [
//         ...jobSeekerFeedback.map((fb) => ({ ...fb, userType: "Job Seeker" })),
//         ...employeeFeedback.map((fb) => ({ ...fb, userType: "Employee" })),
//       ];

//       console.log("Processed feedback array:", combinedFeedbacks);
//       setFeedbacks(combinedFeedbacks);
//     } catch (error) {
//       console.error("Error fetching feedback:", error);
//     }
//   };

//   const handleResponse = async (id) => {
//     try {
//       await fetch(`http://localhost:8081/api/feedback/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ response }),
//       });
//       setResponse(""); // Clear input after sending response
//       fetchFeedbacks(); // Refresh feedback list
//     } catch (error) {
//       console.error("Error responding to feedback:", error);
//     }
//   };

//   const handleResolve = async (id, userType) => {
//     await fetch(`http://localhost:8081/api/feedback/resolve/${id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ userType }),
//     });
//     fetchFeedbacks();
//   };

//   const filteredFeedbacks = feedbacks.filter((fb) =>
//     filter === "all" ? true : fb.status === filter
//   );

//   const sortedFeedbacks = filteredFeedbacks.sort((a, b) =>
//     sort === "latest"
//       ? new Date(b.date) - new Date(a.date)
//       : new Date(a.date) - new Date(b.date)
//   );

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.heading}>User Feedback</h1>
//       <div className={styles.filters}>
//         <select onChange={(e) => setFilter(e.target.value)}>
//           <option value="all">All</option>
//           <option value="pending">Pending</option>
//           <option value="resolved">Resolved</option>
//         </select>
//         <select onChange={(e) => setSort(e.target.value)}>
//           <option value="latest">Latest</option>
//           <option value="oldest">Oldest</option>
//         </select>
//       </div>
//       <div className={styles.feedbackGrid}>
//         {sortedFeedbacks.length === 0 ? (
//           <p className={styles.noFeedback}>No feedback available.</p>
//         ) : (
//           sortedFeedbacks.map((fb) => (
//             <div key={fb.id} className={styles.feedbackCard}>
//               <h3 className={styles.userType}>{fb.userType}</h3>
//               <p className={styles.message}>{fb.message}</p>
//               <p className={styles.status}>Status: {fb.status}</p>
//               <textarea
//                 className={styles.textarea}
//                 placeholder="Write a response"
//                 value={response}
//                 onChange={(e) => setResponse(e.target.value)}
//               />
//               <button
//                 onClick={() => handleResponse(fb.id)}
//                 className={styles.sendButton}
//               >
//                 Send
//               </button>
//               <button
//                 onClick={() => handleResolve(fb.id, fb.userType)}
//                 className={styles.resolveButton}
//               >
//                 Mark as Resolved
//               </button>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default FeedbackPage;
