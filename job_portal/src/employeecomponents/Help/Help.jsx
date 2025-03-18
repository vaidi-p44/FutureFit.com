import React from "react";
import { Search, Book, MessageCircle, Phone } from "lucide-react";
import styles from "./Help.module.css";

const Help = () => {
  const faqs = [
    {
      question: "How do I reset my password?",
      answer:
        "To reset your password, go to the Change Password page from your account settings. You'll need to enter your current password and choose a new one.",
    },
    {
      question: "How can I manage user permissions?",
      answer:
        "User permissions can be managed from the Manage Users page. Select a user and click the edit button to modify their role and access levels.",
    },
    {
      question: "What are the quota limits?",
      answer:
        "Quota limits vary by subscription plan. You can view your current usage and limits on the Manage Quota page.",
    },
  ];

  return (
    <div className={styles.container}>
      <h1>Help Center</h1>

      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <Search size={20} />
          <input type="text" placeholder="Search for help..." />
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <Book size={24} />
          <h2>Documentation</h2>
          <p>Browse our comprehensive guides and documentation</p>
          <button className={styles.cardButton}>View Docs</button>
        </div>

        <div className={styles.card}>
          <MessageCircle size={24} />
          <h2>Community</h2>
          <p>Connect with other users and share experiences</p>
          <button className={styles.cardButton}>Join Community</button>
        </div>

        <div className={styles.card}>
          <Phone size={24} />
          <h2>Support</h2>
          <p>Get in touch with our support team</p>
          <button className={styles.cardButton}>Contact Support</button>
        </div>
      </div>

      <section className={styles.faqSection}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <details key={index} className={styles.faqItem}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.contactSection}>
        <h2>Still Need Help?</h2>
        <p>
          Our support team is available 24/7 to assist you with any questions or
          concerns.
        </p>
        <div className={styles.contactButtons}>
          <button className={styles.primaryButton}>
            <MessageCircle size={20} />
            Start Chat
          </button>
          <button className={styles.secondaryButton}>
            <Phone size={20} />
            Schedule Call
          </button>
        </div>
      </section>
    </div>
  );
};

export default Help;
