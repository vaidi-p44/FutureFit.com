import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./ResdexPage.module.css";
import page from "../assets/page.jpg";

const RedexPage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const [formData, setFormData] = useState({
    work_status: "",
    current_post: "",
    skills: "",
  });

  const [existingRequests, setExistingRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [paymentRequired, setPaymentRequired] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false); // ✅ Track Payment Status

  // Fetch existing requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/get-requests/${userId}`
        );

        setExistingRequests(response.data.data);

        // 🔹 Check if backend indicates payment is required
        if (response.data.payment_required) {
          setPaymentRequired(true);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, [userId]);

  // Handle Input Change
  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "skills") {
      value = value
        .split(",") // Split by comma
        .map((skill) => skill.trim()) // Trim spaces
        .filter((skill) => skill.length > 0) // Remove empty values
        .join(","); // Join back into a string
    }

    setFormData({ ...formData, [name]: value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if required fields are filled
    if (!formData.work_status || !formData.current_post || !formData.skills) {
      setMessage("Please fill in all required fields before proceeding.");
      return;
    }

    if (paymentRequired && !paymentVerified) {
      setMessage("Payment required before submitting another request.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8081/api/send-request",
        {
          ...formData,
          user_id: userId,
        }
      );

      if (response.data.status === "success") {
        setMessage("Request sent successfully!");
        setTimeout(() => navigate("/FindTalentPage"), 2000);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Error occurred. Please try again."
      );
    }
  };

  // Razorpay Payment Function
  const handlePayment = async () => {
    try {
      const orderResponse = await axios.post(
        "http://localhost:8081/api/create-order",
        {
          amount: 500,
          user_id: userId,
        }
      );

      const { order_id } = orderResponse.data;

      const options = {
        key: "rzp_test_Zth6TBEqyhnUN9",
        amount: 500 * 100,
        currency: "INR",
        name: "Raghuveer Enterprise",
        description: "Payment for Request",
        order_id: order_id,
        handler: async function (response) {
          const verifyResponse = await axios.post(
            "http://localhost:8081/api/verify-payment",
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              user_id: userId,
              request_data: formData, // ✅ Send request data with payment verification
            }
          );

          if (verifyResponse.data.status === "success") {
            setMessage("Payment successful! Request sent.");
            setPaymentVerified(true);
            setTimeout(() => navigate("/FindTalentPage"), 2000); // ✅ Redirect after 2 seconds
          } else {
            alert("Payment verification failed. Please try again.");
          }
        },
        prefill: {
          name: "John Doe",
          email: "john@example.com",
          contact: "9876543210",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error in payment:", error);
    }
  };

  return (
    <div className={styles.find}>
      <div className={styles.font_container}>
        <div className={styles.font}>
          Find <span className={styles.text}>perfect</span> Talent{" "}
          <span className={styles.text}>Fit</span> for you
        </div>
        <div className={styles.pageimg}>
          <img src={page} alt="Future Fit" />
        </div>
      </div>

      <div className={styles.container}>
        <h2>Job Seeker Request Form</h2>
        {message && <p className={styles.message}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <label>Work Status</label>
          <select
            name="work_status"
            value={formData.work_status}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="fresher">Fresher</option>
            <option value="experienced">Experienced</option>
          </select>

          <label>Current Post</label>
          <input
            type="text"
            name="current_post"
            value={formData.current_post}
            onChange={handleChange}
            required
          />

          <label>Skills</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            required
            placeholder="Comma separated"
          />

          {existingRequests.length === 0 || paymentVerified ? (
            <button type="submit">Send Request</button>
          ) : (
            <button type="button" onClick={handlePayment}>
              Pay ₹500 to Send Another Request
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default RedexPage;

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import styles from "./ResdexPage.module.css";
// import page from "../assets/page.jpg";

// const RedexPage = () => {
//   const navigate = useNavigate();
//   const userId = localStorage.getItem("user_id");

//   const [formData, setFormData] = useState({
//     work_status: "",
//     current_post: "",
//     skills: "",
//   });

//   const [existingRequests, setExistingRequests] = useState([]);
//   const [message, setMessage] = useState("");
//   const [showPayment, setShowPayment] = useState(false);

//   // Fetch existing requests
//   useEffect(() => {
//     const fetchRequests = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8081/api/get-requests/${userId}`
//         );
//         setExistingRequests(response.data.data);
//       } catch (error) {
//         console.error("Error fetching requests:", error);
//       }
//     };

//     fetchRequests();
//   }, [userId]);

//   // Handle Input Change
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle Form Submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (existingRequests.length >= 1 && !showPayment) {
//       setShowPayment(true);
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:8081/api/send-request",
//         {
//           ...formData,
//           user_id: userId,
//         }
//       );

//       if (response.data.status === "success") {
//         setMessage("Request sent successfully!");
//         setTimeout(() => navigate("/FindTalentPage"), 2000);
//       }
//     } catch (error) {
//       setMessage(
//         error.response?.data?.message || "Error occurred. Please try again."
//       );
//     }
//   };

//   // Razorpay Payment Function
//   const handlePayment = async () => {
//     try {
//       // 🔹 Fetch Order ID from Backend
//       const orderResponse = await axios.post(
//         "http://localhost:8081/api/create-order",
//         {
//           amount: 500, // Amount in INR
//           user_id: localStorage.getItem("user_id"),
//         }
//       );

//       const { order_id } = orderResponse.data;

//       // 🔹 Razorpay Payment Options
//       const options = {
//         key: "rzp_test_Zth6TBEqyhnUN9",
//         amount: 500 * 100, // Amount in paise
//         currency: "INR",
//         name: "Raghuveer Enterprise",
//         description: "Payment for Request",
//         order_id: order_id, // Generated order ID from backend
//         handler: async function (response) {
//           // 🔹 Send Payment Details to Backend for Verification
//           const verifyResponse = await axios.post(
//             "http://localhost:8081/api/verify-payment",
//             {
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_signature: response.razorpay_signature,
//               user_id: localStorage.getItem("user_id"),
//             }
//           );

//           if (verifyResponse.data.status === "success") {
//             alert("Payment successful! You can now send another request.");
//           } else {
//             alert("Payment verification failed. Please try again.");
//           }
//         },
//         prefill: {
//           name: "John Doe",
//           email: "john@example.com",
//           contact: "9876543210",
//         },
//         theme: {
//           color: "#3399cc",
//         },
//       };

//       const rzp1 = new window.Razorpay(options);
//       rzp1.open();
//     } catch (error) {
//       console.error("Error in payment:", error);
//     }
//   };

//   return (
//     <div className={styles.find}>
//       <div className={styles.font_container}>
//         <div className={styles.font}>
//           Find <span className={styles.text}>perfect</span> Talent{" "}
//           <span className={styles.text}>Fit</span> for you
//         </div>
//         <div className={styles.pageimg}>
//           <img src={page} alt="Future Fit" />
//         </div>
//       </div>

//       <div className={styles.container}>
//         <h2>Job Seeker Request Form</h2>
//         {message && <p className={styles.message}>{message}</p>}
//         <form onSubmit={handleSubmit}>
//           <label>Work Status</label>
//           <select
//             name="work_status"
//             value={formData.work_status}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select</option>
//             <option value="fresher">Fresher</option>
//             <option value="experienced">Experienced</option>
//           </select>

//           <label>Current Post</label>
//           <input
//             type="text"
//             name="current_post"
//             value={formData.current_post}
//             onChange={handleChange}
//             required
//           />

//           <label>Skills</label>
//           <input
//             type="text"
//             name="skills"
//             value={formData.skills}
//             onChange={handleChange}
//             required
//             placeholder="Comma separated"
//           />

//           {existingRequests.length === 0 ? (
//             <button type="submit">Send Request</button>
//           ) : (
//             <button type="button" onClick={handlePayment}>
//               Pay ₹500 to Send Another Request
//             </button>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RedexPage;
