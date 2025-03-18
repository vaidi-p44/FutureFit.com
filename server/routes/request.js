import express from "express";
import query from "../config/db.js"; // Ensure correct DB connection

const router = express.Router();

router.post("/send-request", async (req, res) => {
  try {
    const { work_status, current_post, skills, user_id } = req.body;

    // 🔹 Step 1: Check how many requests the user has made
    const requestCheckSql = `SELECT COUNT(*) AS request_count FROM job_seeker_requests WHERE user_id = ?`;
    query(requestCheckSql, [user_id], (reqErr, reqResult) => {
      if (reqErr) {
        console.error("Database error (Request Check):", reqErr);
        return res
          .status(500)
          .json({ status: "error", message: "Database error" });
      }

      const requestCount = reqResult[0].request_count;

      // 🔹 Step 2: Allow first request for free
      if (requestCount === 0) {
        insertRequest();
      } else {
        // 🔹 Step 3: Check if user has made a successful payment before allowing additional requests
        const paymentCheckSql = `SELECT COUNT(*) AS payment_count FROM payments WHERE user_id = ? AND status = 'success'`;
        query(paymentCheckSql, [user_id], (payErr, payResult) => {
          if (payErr) {
            console.error("Database error (Payment Check):", payErr);
            return res
              .status(500)
              .json({ status: "error", message: "Database error" });
          }

          const hasPaid = payResult[0].payment_count > 0;

          if (!hasPaid) {
            return res.status(400).json({
              status: "error",
              message:
                "Payment required. Please complete the payment to send a request.",
              payment_required: true, // ✅ Send flag for frontend handling
            });
          }

          insertRequest();
        });
      }
    });

    // Function to insert the request
    function insertRequest() {
      const insertSql = `INSERT INTO job_seeker_requests (user_id, work_status, current_post, skills, created_at) 
                         VALUES (?, ?, ?, ?, NOW())`;
      query(
        insertSql,
        [user_id, work_status, current_post, skills],
        (insertErr) => {
          if (insertErr) {
            console.error("Insert error:", insertErr);
            return res
              .status(500)
              .json({ status: "error", message: "Database error" });
          }

          res.json({
            status: "success",
            message: "Request sent successfully!",
          });
        }
      );
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

/**
 * 📌 2️⃣ API to Get the Latest Request for a User
 */
router.get("/get-request/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const sql = `
      SELECT work_status, current_post, skills, created_at
      FROM job_seeker_requests
      WHERE user_id = ? AND status IN ('Active', 'Expired')
      ORDER BY created_at DESC
      LIMIT 1
    `;

    query(sql, [user_id], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ status: "error", message: "Database error" });
      }

      if (result.length === 0) {
        return res.json({
          status: "not_found",
          message: "No previous request found.",
        });
      }

      res.json({ status: "success", data: result[0] });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

/**
 * 📌 3️⃣ API to Get All Requests by User
 */
router.get("/get-requests/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const sql = "SELECT * FROM job_seeker_requests WHERE user_id = ?";

    query(sql, [user_id], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ status: "error", message: "Database error" });
      }

      res.json({ status: "success", data: result });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});
// Fetch All Employee Requests with Payment Status
router.get("/get-all-requests", async (req, res) => {
  try {
    const sql = `
  SELECT 
    jr.id, 
    jr.user_id, 
    jr.work_status, 
    jr.current_post, 
    jr.skills, 
    jr.created_at, 
    COALESCE(er.companyName, 'N/A') AS company_name,
    COALESCE(p.status, 'Not Paid') AS payment_status,
    -- 🔹 Use the actual status from job_seeker_requests
    CASE 
      WHEN jr.status = 'Cancelled' THEN 'Cancelled'  -- ✅ Preserve "Cancelled" requests
      WHEN p.status = 'success' AND jr.created_at < NOW() - INTERVAL 5 DAY THEN 'Expired'
      WHEN p.status = 'success' THEN 'Active'
      ELSE 'Not Paid'
    END AS status  
FROM job_seeker_requests jr
LEFT JOIN (
    SELECT user_id, status 
    FROM payments 
    WHERE status = 'success' 
    ORDER BY created_at DESC 
    LIMIT 1  
) p ON jr.user_id = p.user_id
LEFT JOIN EmployeeRegistration er ON jr.user_id = er.user_id
ORDER BY jr.created_at DESC;

    `;

    query(sql, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ status: "error", message: "Database error" });
      }

      res.json({ status: "success", data: results });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

router.put("/accept-request/:id", async (req, res) => {
  try {
    const requestId = req.params.id;

    // Check if the request exists
    const checkSql = "SELECT * FROM job_seeker_requests WHERE id = ?";
    query(checkSql, [requestId], (checkErr, checkResult) => {
      if (checkErr) {
        console.error("Database error (Check Request):", checkErr);
        return res
          .status(500)
          .json({ status: "error", message: "Database error" });
      }

      if (checkResult.length === 0) {
        return res
          .status(404)
          .json({ status: "error", message: "Request not found." });
      }

      // Update the request status
      const updateSql =
        "UPDATE job_seeker_requests SET status = 'Active' WHERE id = ?";
      query(updateSql, [requestId], (updateErr, updateResult) => {
        if (updateErr) {
          console.error("Error updating request:", updateErr);
          return res
            .status(500)
            .json({ status: "error", message: "Database update failed" });
        }

        return res.json({
          status: "success",
          message: "Request accepted successfully.",
        });
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

router.put("/cancel-request/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const sqlUpdate = `UPDATE job_seeker_requests SET status = 'Cancelled' WHERE id = ?`;
    query(sqlUpdate, [id], async (err, result) => {
      if (err) {
        console.error("Error updating request:", err);
        return res.status(500).json({ message: "Failed to cancel request." });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Request not found." });
      }

      // Fetch latest request data from DB to confirm update
      const sqlSelect = `SELECT * FROM job_seeker_requests WHERE id = ?`;
      query(sqlSelect, [id], (err, updatedResult) => {
        if (err) {
          console.error("Error fetching updated request:", err);
          return res
            .status(500)
            .json({ message: "Error fetching updated request." });
        }
        console.log("🔹 Updated Request:", updatedResult[0]); // Check if status is actually updated
        return res.status(200).json({
          message: "Request cancelled successfully.",
          data: updatedResult[0],
        });
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;

// import express from "express";
// import query from "../config/db.js"; // Ensure this is correctly configured

// const router = express.Router();

// // 📌 1️⃣ API to Send a Job Seeker Request
// router.post("/send-request", async (req, res) => {
//   try {
//     const { work_status, current_post, skills, user_id } = req.body;

//     // Check the number of requests in the last 2 months
//     const checkSql = `
//       SELECT COUNT(*) AS request_count
//       FROM job_seeker_requests
//       WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 2 MONTH)
//     `;

//     query(checkSql, [user_id], (err, result) => {
//       if (err) {
//         console.error("Database error:", err);
//         return res
//           .status(500)
//           .json({ status: "error", message: "Database error" });
//       }

//       const requestCount = result[0].request_count;

//       if (requestCount >= 2) {
//         return res.status(400).json({
//           status: "error",
//           message:
//             "Request limit reached. You can send a new request after 2 months.",
//         });
//       }

//       // Insert the new request
//       const insertSql = `
//         INSERT INTO job_seeker_requests (user_id, work_status, current_post, skills, created_at)
//         VALUES (?, ?, ?, ?, NOW())
//       `;

//       query(
//         insertSql,
//         [user_id, work_status, current_post, skills],
//         (insertErr) => {
//           if (insertErr) {
//             console.error("Insert error:", insertErr);
//             return res
//               .status(500)
//               .json({ status: "error", message: "Database error" });
//           }

//           res.json({
//             status: "success",
//             message: "Request sent successfully!",
//           });
//         }
//       );
//     });
//   } catch (error) {
//     console.error("Server error:", error);
//     res.status(500).json({ status: "error", message: "Internal server error" });
//   }
// });

// // 📌 2️⃣ API to Get the Latest Request for a User
// router.get("/get-request/:user_id", async (req, res) => {
//   const { user_id } = req.params;

//   try {
//     const sql = `
//       SELECT work_status, current_post, skills, created_at
//       FROM job_seeker_requests
//       WHERE user_id = ?
//       ORDER BY created_at DESC
//       LIMIT 1
//     `;

//     query(sql, [user_id], (err, result) => {
//       if (err) {
//         console.error("Database error:", err);
//         return res
//           .status(500)
//           .json({ status: "error", message: "Database error" });
//       }

//       if (result.length === 0) {
//         return res.json({
//           status: "not_found",
//           message: "No previous request found.",
//         });
//       }

//       res.json({ status: "success", data: result[0] });
//     });
//   } catch (error) {
//     console.error("Server error:", error);
//     res.status(500).json({ status: "error", message: "Internal server error" });
//   }
// });

// // 📌 3️⃣ API to Get All Requests by User
// router.get("/get-requests/:user_id", async (req, res) => {
//   const { user_id } = req.params;

//   try {
//     const sql = "SELECT * FROM job_seeker_requests WHERE user_id = ?";

//     query(sql, [user_id], (err, result) => {
//       if (err) {
//         console.error("Database error:", err);
//         return res
//           .status(500)
//           .json({ status: "error", message: "Database error" });
//       }

//       res.json({ status: "success", data: result });
//     });
//   } catch (error) {
//     console.error("Server error:", error);
//     res.status(500).json({ status: "error", message: "Internal server error" });
//   }
// });

// export default router;
