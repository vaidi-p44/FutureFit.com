import React, { useState, useEffect } from "react";
import { Star, Send } from "lucide-react";
import axios from "axios";
import styles from "./Feedback.module.css";

function Feedback() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [category, setCategory] = useState("general");
  const [userType, setUserType] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const storedUserType = localStorage.getItem("role"); // Use "role" instead of "userType"
    const storedUserId = localStorage.getItem("user_id"); // Use "user_id" instead of "userId"

    console.log(
      "Retrieved from localStorage -> role:",
      storedUserType,
      "user_id:",
      storedUserId
    );

    if (storedUserType && storedUserId) {
      setUserType(storedUserType);
      setUserId(storedUserId);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !userType) {
      alert("User not logged in!");
      return;
    }

    const feedbackData = {
      userType,
      userId,
      rating,
      message: feedback,
      category,
    };

    try {
      const response = await axios.post(
        "http://localhost:8081/api/submit",
        feedbackData
      );
      alert(response.data.message);
      setRating(0);
      setFeedback("");
      setCategory("general");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Give Feedback</h1>
        <p className={styles.description}>
          Your feedback helps us improve our services. Please share your
          thoughts with us.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="general">General Feedback</option>
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="improvement">Improvement Suggestion</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Rating</label>
            <div className={styles.starRating}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={styles.starButton}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    size={24}
                    fill={
                      (hoveredRating || rating) >= star ? "#eab308" : "none"
                    }
                    color={
                      (hoveredRating || rating) >= star ? "#eab308" : "#d1d5db"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Your Feedback</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Please share your detailed feedback..."
              rows={5}
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            <Send size={20} />
            Submit Feedback
          </button>
        </form>

        <div className={styles.feedbackTips}>
          <h3>Tips for Great Feedback:</h3>
          <ul>
            <li>Be specific about what you liked or didn't like</li>
            <li>Provide examples if possible</li>
            <li>Suggest improvements</li>
            <li>Keep it constructive and respectful</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Feedback;

// import React, { useState } from 'react';
// import { Star, Send } from 'lucide-react';
// import styles from './Feedback.module.css';

// function Feedback() {
//   const [rating, setRating] = useState(0);
//   const [hoveredRating, setHoveredRating] = useState(0);
//   const [feedback, setFeedback] = useState('');
//   const [category, setCategory] = useState('general');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Add feedback submission logic here
//     console.log({ rating, feedback, category });
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.card}>
//         <h1>Give Feedback</h1>
//         <p className={styles.description}>
//           Your feedback helps us improve our services. Please share your thoughts with us.
//         </p>

//         <form onSubmit={handleSubmit} className={styles.form}>
//           <div className={styles.formGroup}>
//             <label>Category</label>
//             <select
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//             >
//               <option value="general">General Feedback</option>
//               <option value="bug">Bug Report</option>
//               <option value="feature">Feature Request</option>
//               <option value="improvement">Improvement Suggestion</option>
//             </select>
//           </div>

//           <div className={styles.formGroup}>
//             <label>Rating</label>
//             <div className={styles.starRating}>
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <button
//                   key={star}
//                   type="button"
//                   className={styles.starButton}
//                   onMouseEnter={() => setHoveredRating(star)}
//                   onMouseLeave={() => setHoveredRating(0)}
//                   onClick={() => setRating(star)}
//                 >
//                   <Star
//                     size={24}
//                     fill={(hoveredRating || rating) >= star ? '#eab308' : 'none'}
//                     color={(hoveredRating || rating) >= star ? '#eab308' : '#d1d5db'}
//                   />
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className={styles.formGroup}>
//             <label>Your Feedback</label>
//             <textarea
//               value={feedback}
//               onChange={(e) => setFeedback(e.target.value)}
//               placeholder="Please share your detailed feedback..."
//               rows={5}
//             />
//           </div>

//           <button type="submit" className={styles.submitButton}>
//             <Send size={20} />
//             Submit Feedback
//           </button>
//         </form>

//         <div className={styles.feedbackTips}>
//           <h3>Tips for Great Feedback:</h3>
//           <ul>
//             <li>Be specific about what you liked or didn't like</li>
//             <li>Provide examples if possible</li>
//             <li>Suggest improvements</li>
//             <li>Keep it constructive and respectful</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Feedback;
