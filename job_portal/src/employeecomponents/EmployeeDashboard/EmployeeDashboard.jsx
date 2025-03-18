import { useState } from "react";
import styles from "./EmployeeDashboard.module.css";
import { Users, Briefcase, FileText, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState("jobs");
  const navigate = useNavigate();

  const jobPackages = [
    {
      type: "Hot vacancy",
      price: "1650",
      features: [
        "Detailed job description",
        "3 job locations",
        "Unlimited applies",
        "Applies expiry 90 days",
        "Jobseeker contact details are visible",
        "Boost on Job Search Page",
        "Job Branding",
      ],
      validity: "30 days",
      discount: "Flat 10% OFF on 5 Job Postings or more",
    },
    {
      type: "Classified",
      price: "850",
      features: [
        "Up to 250 character job description",
        "3 job locations",
        "Unlimited applies",
        "Applies expiry 90 days",
        "Jobseeker contact details are visible",
        "Boost on Job Search Page",
        "Job Branding",
      ],
      validity: "30 days",
      discount: "Flat 10% OFF on 5 Job Postings or more",
    },
    {
      type: "Standard",
      price: "400",
      features: [
        "Up to 250 character job description",
        "1 job location",
        "200 applies",
        "Applies expiry 30 days",
        "Jobseeker contact details are visible",
        "Boost on Job Search Page",
        "Job Branding",
      ],
      validity: "15 days",
      discount: "Flat 10% OFF on 5 Job Postings or more",
    },
  ];

  const handleBuyPlan = async (plan) => {
    try {
      const employee_id = localStorage.getItem("user_id");

      if (!employee_id) {
        alert("Error: Employee ID is missing. Please log in again.");
        return;
      }

      console.log("Employee ID being sent:", employee_id); // Debugging line

      const response = await axios.post(
        "http://localhost:8081/api/create-job-plan-order",
        {
          amount: plan.price,
          employee_id, // Ensure this is not null
          plan_type: plan.type,
        }
      );

      const { order_id } = response.data;
      console.log("Order ID:", order_id);

      const options = {
        key: "rzp_test_Zth6TBEqyhnUN9",
        amount: plan.price * 100,
        currency: "INR",
        name: "Job Portal",
        description: `Purchase ${plan.type} Plan`,
        order_id,
        handler: async (response) => {
          try {
            console.log("Verifying Payment with Employee ID:", employee_id); // Debugging line

            await axios.post(
              "http://localhost:8081/api/verify-job-plan-payment",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                employee_id, // Ensure this is sent correctly
                plan_type: plan.type,
                amount: plan.price,
              }
            );

            alert("Payment Successful! Plan Activated.");
            navigate("/post-jobs"); // Redirect after successful purchase
          } catch (error) {
            console.error("Payment verification failed", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error creating Razorpay order", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      {/* <aside className={styles.sidebar}>
        <button onClick={() => setActiveTab("jobs")}>
          <Briefcase /> Job Postings
        </button>
        <button onClick={() => setActiveTab("candidates")}>
          <Users /> Candidates
        </button>
        <button onClick={() => setActiveTab("resumes")}>
          <FileText /> Resume Database
        </button>
        <button onClick={() => setActiveTab("settings")}>
          <Settings /> Settings
        </button>
      </aside> */}

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            {activeTab === "jobs" && "Job Postings"}
            {activeTab === "candidates" && "Candidates"}
            {activeTab === "resumes" && "Resume Database"}
            {activeTab === "settings" && "Settings"}
          </h1>
          <div className={styles.headerActions}>
            {activeTab === "jobs" && (
              <button
                className={styles.primaryButton}
                onClick={() => navigate("/post-jobs")}
              >
                Post New Job
              </button>
            )}
          </div>
        </header>

        <div className={styles.content}>
          {activeTab === "jobs" && (
            <div className={styles.jobsGrid}>
              {jobPackages.map((pkg, index) => (
                <div key={index} className={styles.pricingCard}>
                  <h3>{pkg.type}</h3>
                  <p className={styles.price}>₹{pkg.price}</p>
                  <ul>
                    {pkg.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                  <p className={styles.validity}>Validity: {pkg.validity}</p>
                  <p className={styles.discount}>{pkg.discount}</p>
                  <button
                    className={styles.buyButton}
                    onClick={() => handleBuyPlan(pkg)}
                  >
                    Buy Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;

// import { useState } from "react";
// import styles from "./EmployeeDashboard.module.css";
// import { Users, Briefcase, FileText, Settings } from "lucide-react";
// // import JobPostingCard from "./JobPostingCard";
// import PricingCard from "../PricingCard/PricingCard";
// import { useNavigate } from "react-router-dom";
// const EmployeeDashboard = () => {
//   const [activeTab, setActiveTab] = useState("jobs");
//   const navigate = useNavigate();
//   const jobPackages = [
//     {
//       type: "Hot vacancy",
//       price: "1,650",
//       features: [
//         "Detailed job description",
//         "3 job locations",
//         "Unlimited applies",
//         "Applies expiry 90 days",
//         "Jobseeker contact details are visible",
//         "Boost on Job Search Page",
//         "Job Branding",
//       ],
//       validity: "30 days",
//       discount: "Flat 10% OFF on 5 Job Postings or more",
//     },
//     {
//       type: "Classified",
//       price: "850",
//       features: [
//         "Upto 250 character job description",
//         "3 job locations",
//         "Unlimited applies",
//         "Applies expiry 90 days",
//         "Jobseeker contact details are visible",
//         "Boost on Job Search Page",
//         "Job Branding",
//       ],
//       validity: "30 days",
//       discount: "Flat 10% OFF on 5 Job Postings or more",
//     },
//     {
//       type: "Standard",
//       price: "400",
//       features: [
//         "Upto 250 character job description",
//         "1 job location",
//         "200 applies",
//         "Applies expiry 30 days",
//         "Jobseeker contact details are visible",
//         "Boost on Job Search Page",
//         "Job Branding",
//       ],
//       validity: "15 days",
//       discount: "Flat 10% OFF on 5 Job Postings or more",
//     },
//   ];

//   return (
//     <div className={styles.container}>
//       <main className={styles.main}>
//         <header className={styles.header}>
//           <h1 className={styles.title}>
//             {activeTab === "jobs" && "Job Postings"}
//             {activeTab === "candidates" && "Candidates"}
//             {activeTab === "resumes" && "Resume Database"}
//             {activeTab === "settings" && "Settings"}
//           </h1>
//           <div className={styles.headerActions}>
//             <button
//               className={styles.primaryButton}
//               onClick={() => navigate("/post-jobs")}
//             >
//               {activeTab === "jobs" && "Post New Job"}
//             </button>
//           </div>
//         </header>

//         <div className={styles.content}>
//           {activeTab === "jobs" && (
//             <div className={styles.jobsGrid}>
//               {jobPackages.map((pkg, index) => (
//                 <PricingCard key={index} {...pkg} />
//               ))}
//             </div>
//           )}

//           {activeTab === "candidates" && (
//             <div className={styles.candidatesSection}>
//               <h2>Recent Applications</h2>
//               {/* Add candidate list component here */}
//             </div>
//           )}

//           {activeTab === "resumes" && (
//             <div className={styles.resumeSection}>
//               <h2>Resume Database Access</h2>
//               {/* Add resume search component here */}
//             </div>
//           )}

//           {activeTab === "settings" && (
//             <div className={styles.settingsSection}>
//               <h2>Account Settings</h2>
//               {/* Add settings form component here */}
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };
// export default EmployeeDashboard;
