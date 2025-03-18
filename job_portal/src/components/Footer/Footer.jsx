import React from "react";
import { Link } from "react-router-dom";

import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <h3 className={styles.connectTitle}>Connect with us</h3>
          </div>

          <div className={styles.links}>
            <Link href="#" className={styles.link}>
              About us
            </Link>
            <Link href="#" className={styles.link}>
              Careers
            </Link>
            <Link href="#" className={styles.link}>
              Employer home
            </Link>
          </div>

          <div className={styles.links}>
            <Link href="#" className={styles.link}>
              Help center
            </Link>
            <Link href="#" className={styles.link}>
              Summons/Notices
            </Link>
            <Link href="#" className={styles.link}>
              Grievances
            </Link>
          </div>

          <div className={styles.download}>
            <div>
              <h3 className={styles.downloadTitle}>Apply on the go</h3>
              <p className={styles.downloadText}>
                Get real-time job updates on our App
              </p>
            </div>
            <div className={styles.appButtons}>
              {/* <Link href="#">
                <Image
                  src="/placeholder.svg?height=40&width=120"
                  alt="Get it on Google Play"
                  width={120}
                  height={40}
                  className={styles.appButton}
                />
              </Link>
              <Link href="#">
                <Image
                  src="/placeholder.svg?height=40&width=120"
                  alt="Download on the App Store"
                  width={120}
                  height={40}
                  className={styles.appButton}
                />
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
