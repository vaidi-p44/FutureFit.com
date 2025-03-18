import React, { useState } from 'react';
import styles from './Subscriptions.module.css';

function Subscriptions() {
  const [subscriptions] = useState([
    {
      id: 1,
      plan: 'Enterprise',
      status: 'Active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      price: '$999/year',
      features: ['Unlimited users', 'Priority support', 'Custom integrations']
    },
    {
      id: 2,
      plan: 'Developer Tools',
      status: 'Active',
      startDate: '2024-02-15',
      endDate: '2024-08-15',
      price: '$299/6months',
      features: ['CI/CD pipeline', 'Code analytics', 'Team collaboration']
    }
  ]);

  return (
    <div className={styles.container}>
      <h1>My Subscriptions</h1>
      <div className={styles.subscriptionsList}>
        {subscriptions.map(sub => (
          <div key={sub.id} className={styles.subscriptionCard}>
            <div className={styles.header}>
              <h2>{sub.plan}</h2>
              <span className={`${styles.status} ${styles[sub.status.toLowerCase()]}`}>
                {sub.status}
              </span>
            </div>
            <div className={styles.details}>
              <p className={styles.price}>{sub.price}</p>
              <div className={styles.dates}>
                <p>Start: {sub.startDate}</p>
                <p>End: {sub.endDate}</p>
              </div>
              <div className={styles.features}>
                <h3>Features:</h3>
                <ul>
                  {sub.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={styles.actions}>
              <button className={styles.renewButton}>Renew Subscription</button>
              <button className={styles.manageButton}>Manage Plan</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Subscriptions;