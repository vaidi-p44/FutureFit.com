import query from "../config/db.js";
import cron from "node-cron";

// 🔹 Run every day at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    console.log("Running request expiration job...");

    // Expire requests older than 5 days
    const updateRequestsSql = `
      UPDATE job_seeker_requests 
      SET status = 'Expired' 
      WHERE created_at < NOW() - INTERVAL 5 DAY 
      AND status != 'Expired'
    `;

    await new Promise((resolve, reject) => {
      query(updateRequestsSql, (err, result) => {
        if (err) {
          console.error("Error updating job_seeker_requests:", err);
          reject(err);
        } else {
          console.log(`✅ Expired ${result.affectedRows} job seeker requests.`);
          resolve();
        }
      });
    });

    console.log("🎯 Cron job completed successfully!");
  } catch (error) {
    console.error("❌ Cron job error:", error);
  }
});

export default cron;
