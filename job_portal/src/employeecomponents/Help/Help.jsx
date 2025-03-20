import React, { useState } from "react";
import { Search, MessageCircle, Phone, LifeBuoy } from "lucide-react";
import styles from "./Help.module.css";

const faqs = [
  {
    question: "How do I reset my password?",
    answer:
      "Go to the 'Change Password' page in your account settings. Follow the instructions to update your password securely.",
  },
  {
    question: "How do I verify my email?",
    answer:
      "During registration, you will receive an OTP. Enter the OTP in the verification popup to complete the process. You can also verify via the email link sent to your inbox.",
  },
  {
    question: "How can I apply for a job?",
    answer:
      "Go to the 'Jobs' section, find a suitable job, and click 'Apply'. Ensure your resume is updated for better chances.",
  },
  {
    question: "How do I post a job?",
    answer:
      "In your Employee Dashboard, click 'Post a Job'. Choose a plan (Standard, Classified, or Hot Vacancy) and complete the payment via Razorpay.",
  },
  {
    question: "How can I request job seeker details?",
    answer:
      "In 'Find Talent', refine your search, select candidates, and proceed with payment to unlock their details.",
  },
  {
    question: "What should I do if my payment fails?",
    answer:
      "If your Razorpay payment fails, check your internet connection and try again. If the issue persists, contact support.",
  },
];

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter FAQs based on search input
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1>Help Center</h1>

      {/* Search Bar */}
      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <Search size={20} />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* FAQs */}
      <section className={styles.faqSection}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <details key={index} className={styles.faqItem}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))
          ) : (
            <p className={styles.noResults}>No results found.</p>
          )}
        </div>
      </section>

      {/* Support Section */}
      <section className={styles.contactSection}>
        <h2>Need More Help?</h2>
        <p>Our support team is available 24/7 to assist you.</p>
        <div className={styles.contactButtons}>
          <button className={styles.primaryButton}>
            <MessageCircle size={20} /> Start Chat
          </button>
          <button className={styles.secondaryButton}>
            <Phone size={20} /> Schedule Call
          </button>
          <button className={styles.secondaryButton}>
            <LifeBuoy size={20} /> Submit Ticket
          </button>
        </div>
      </section>
    </div>
  );
};

export default HelpPage;

// import React from "react";
// import { Search, Book, MessageCircle, Phone } from "lucide-react";
// import styles from "./Help.module.css";

// const Help = () => {
//   const faqs = [
//     {
//       question: "How do I reset my password?",
//       answer:
//         "To reset your password, go to the Change Password page from your account settings. You'll need to enter your current password and choose a new one.",
//     },
//     {
//       question: "How can I manage user permissions?",
//       answer:
//         "User permissions can be managed from the Manage Users page. Select a user and click the edit button to modify their role and access levels.",
//     },
//     {
//       question: "What are the quota limits?",
//       answer:
//         "Quota limits vary by subscription plan. You can view your current usage and limits on the Manage Quota page.",
//     },
//   ];

//   return (
//     <div className={styles.container}>
//       <h1>Help Center</h1>

//       <div className={styles.searchSection}>
//         <div className={styles.searchBar}>
//           <Search size={20} />
//           <input type="text" placeholder="Search for help..." />
//         </div>
//       </div>

//       <div className={styles.grid}>
//         <div className={styles.card}>
//           <Book size={24} />
//           <h2>Documentation</h2>
//           <p>Browse our comprehensive guides and documentation</p>
//           <button className={styles.cardButton}>View Docs</button>
//         </div>

//         <div className={styles.card}>
//           <MessageCircle size={24} />
//           <h2>Community</h2>
//           <p>Connect with other users and share experiences</p>
//           <button className={styles.cardButton}>Join Community</button>
//         </div>

//         <div className={styles.card}>
//           <Phone size={24} />
//           <h2>Support</h2>
//           <p>Get in touch with our support team</p>
//           <button className={styles.cardButton}>Contact Support</button>
//         </div>
//       </div>

//       <section className={styles.faqSection}>
//         <h2>Frequently Asked Questions</h2>
//         <div className={styles.faqList}>
//           {faqs.map((faq, index) => (
//             <details key={index} className={styles.faqItem}>
//               <summary>{faq.question}</summary>
//               <p>{faq.answer}</p>
//             </details>
//           ))}
//         </div>
//       </section>

//       <section className={styles.contactSection}>
//         <h2>Still Need Help?</h2>
//         <p>
//           Our support team is available 24/7 to assist you with any questions or
//           concerns.
//         </p>
//         <div className={styles.contactButtons}>
//           <button className={styles.primaryButton}>
//             <MessageCircle size={20} />
//             Start Chat
//           </button>
//           <button className={styles.secondaryButton}>
//             <Phone size={20} />
//             Schedule Call
//           </button>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Help;
