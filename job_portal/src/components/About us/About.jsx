import React from "react";
import { Users, Building, Globe, Award } from "lucide-react";
import styles from "./About.module.css";

const About = () => {
  return (
    <div className={styles.about}>
      <div className={styles.hero}>
        <h1>About JobPortal</h1>
        <p>Connecting talented professionals with amazing opportunities</p>
      </div>

      <div className={styles.content}>
        <section className={styles.mission}>
          <h2>Our Mission</h2>
          <p>
            At JobPortal, we're dedicated to transforming the way people find
            jobs and companies hire talent. We believe in creating meaningful
            connections that drive careers and help businesses grow.
          </p>
        </section>

        <section className={styles.stats}>
          <div className={styles.statCard}>
            <Users className={styles.icon} />
            <h3>1M+</h3>
            <p>Active Users</p>
          </div>
          <div className={styles.statCard}>
            <Building className={styles.icon} />
            <h3>50K+</h3>
            <p>Companies</p>
          </div>
          <div className={styles.statCard}>
            <Globe className={styles.icon} />
            <h3>100+</h3>
            <p>Countries</p>
          </div>
          <div className={styles.statCard}>
            <Award className={styles.icon} />
            <h3>500K+</h3>
            <p>Success Stories</p>
          </div>
        </section>

        <section className={styles.features}>
          <h2>Why Choose JobPortal</h2>
          <div className={styles.featureGrid}>
            <div className={styles.feature}>
              <h3>Smart Matching</h3>
              <p>
                Our AI-powered algorithm matches candidates with the perfect
                opportunities based on skills, experience, and preferences.
              </p>
            </div>
            <div className={styles.feature}>
              <h3>Verified Companies</h3>
              <p>
                All companies on our platform are thoroughly verified to ensure
                a safe and reliable job search experience.
              </p>
            </div>
            <div className={styles.feature}>
              <h3>Global Reach</h3>
              <p>
                Access opportunities and talent from around the world with our
                international job marketplace.
              </p>
            </div>
            <div className={styles.feature}>
              <h3>Career Resources</h3>
              <p>
                Get access to resume builders, interview tips, and career
                guidance to help you succeed.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.team}>
          <h2>Our Team</h2>
          <p>
            We're a diverse team of recruiters, developers, and industry experts
            passionate about creating the best job search platform. With decades
            of combined experience in HR and technology, we understand both
            sides of the hiring equation.
          </p>
        </section>

        <section className={styles.contact}>
          <h2>Get in Touch</h2>
          <p>
            Have questions or feedback? We'd love to hear from you. Contact our
            support team or visit our help center for assistance.
          </p>
          <button className={styles.contactBtn}>Contact Us</button>
        </section>
      </div>
    </div>
  );
};

export default About;
