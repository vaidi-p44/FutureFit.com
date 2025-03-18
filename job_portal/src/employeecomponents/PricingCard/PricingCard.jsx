import styles from "./PricingCard.module.css";
import { Check } from "lucide-react";

export default function PricingCard({
  type,
  price,
  features,
  validity,
  discount,
}) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.type}>{type}</h3>
        <div className={styles.price}>
          <span className={styles.currency}>₹</span>
          {price}
        </div>
      </div>

      <div className={styles.features}>
        {features.map((feature, index) => (
          <div key={index} className={styles.feature}>
            <Check className={styles.checkIcon} />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <div className={styles.validity}>Job validity {validity}</div>

      <div className={styles.discount}>{discount}</div>

      <button className={styles.buyButton}>Buy now</button>
    </div>
  );
}
