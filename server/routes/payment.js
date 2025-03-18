import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import query from "../config/db.js"; // Ensure correct DB connection

const router = express.Router();

const razorpay = new Razorpay({
  key_id: "rzp_test_Zth6TBEqyhnUN9", // ✅ Ensure this is correct
  key_secret: "F2jJKQBuTNqPqkAd9sGiAzYU", // ✅ Replace with your actual secret key
});

/**
 * 📌 1️⃣ Create Order (Frontend Calls This API Before Payment)
 */
router.post("/create-order", async (req, res) => {
  const { amount, user_id } = req.body;

  try {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: `order_${user_id}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ order_id: order.id });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to create order" });
  }
});

/**
 * 📌 2️⃣ Verify Payment and Store in Database
 */
router.post("/verify-payment", async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    user_id,
    request_data, // ✅ Receive request data from frontend
  } = req.body;

  try {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", "F2jJKQBuTNqPqkAd9sGiAzYU") // ✅ Use correct secret key
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ status: "error", message: "Payment verification failed" });
    }

    // ✅ Store Request in Database After Payment
    const { work_status, current_post, skills } = request_data;
    const insertRequestSql = `
      INSERT INTO job_seeker_requests (user_id, work_status, current_post, skills, created_at) 
      VALUES (?, ?, ?, ?, NOW())
    `;

    query(
      insertRequestSql,
      [user_id, work_status, current_post, skills],
      (err, result) => {
        if (err) {
          console.error("Database error (request):", err);
          return res.status(500).json({
            status: "error",
            message: "Database error while storing request",
          });
        }

        const request_id = result.insertId; // ✅ Get inserted request ID

        // 🔹 Store Payment in Database
        const insertPaymentSql = `
        INSERT INTO payments (user_id, razorpay_payment_id, razorpay_order_id, status, request_id, created_at) 
        VALUES (?, ?, ?, 'success', ?, NOW())
      `;

        query(
          insertPaymentSql,
          [user_id, razorpay_payment_id, razorpay_order_id, request_id],
          (err2) => {
            if (err2) {
              console.error("Database error (payment):", err2);
              return res.status(500).json({
                status: "error",
                message: "Database error while storing payment",
              });
            }

            res.json({
              status: "success",
              message: "Payment and request successfully stored!",
            });
          }
        );
      }
    );
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res
      .status(500)
      .json({ status: "error", message: "Payment verification failed" });
  }
});

router.post("/create-job-plan-order", async (req, res) => {
  const { amount, employee_id, plan_type } = req.body;

  if (!employee_id || isNaN(employee_id)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid Employee ID" });
  }

  const validPlans = ["Standard", "Classified", "Hot vacancy"];
  if (!validPlans.includes(plan_type)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid Plan Type" });
  }

  try {
    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `jobplan_${employee_id}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({ order_id: order.id });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to create order" });
  }
});

router.post("/verify-job-plan-payment", async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    employee_id,
    plan_type,
    amount,
  } = req.body;

  console.log("Received employee_id:", employee_id); // Debugging

  if (!employee_id || isNaN(employee_id)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid Employee ID" });
  }

  const validPlans = ["Standard", "Classified", "Hot vacancy"];
  if (!validPlans.includes(plan_type)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid Plan Type" });
  }

  try {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ status: "error", message: "Payment verification failed" });
    }

    // Set plan expiry based on the selected plan type
    const expires_at = new Date();
    if (plan_type === "Standard") {
      expires_at.setDate(expires_at.getDate() + 15); // Standard expires in 15 days
    } else {
      expires_at.setDate(expires_at.getDate() + 30); // Other plans expire in 30 days
    }

    const insertPlanSql = `
      INSERT INTO job_posting_plans (employee_id, plan_type, amount, payment_id, order_id, status, purchased_at, expires_at) 
      VALUES (?, ?, ?, ?, ?, 'success', NOW(), ?)
    `;

    query(
      insertPlanSql,
      [
        employee_id,
        plan_type,
        amount,
        razorpay_payment_id,
        razorpay_order_id,
        expires_at,
      ],
      (err) => {
        if (err) {
          console.error("Database error (job posting plan):", err);
          return res.status(500).json({
            status: "error",
            message: "Database error while storing job plan",
          });
        }

        res.json({
          status: "success",
          message: "Plan purchased successfully!",
        });
      }
    );
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res
      .status(500)
      .json({ status: "error", message: "Payment verification failed" });
  }
});

router.get("/get-purchased-plans", async (req, res) => {
  const { employee_id } = req.query;

  if (!employee_id || isNaN(employee_id)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid Employee ID" });
  }

  const selectPlansSql = `
    SELECT plan_type, amount, purchased_at, expires_at FROM job_posting_plans 
    WHERE employee_id = ? AND status = 'success'
  `;

  query(selectPlansSql, [employee_id], (err, results) => {
    if (err) {
      console.error("Database error (fetch plans):", err);
      return res.status(500).json({
        status: "error",
        message: "Database error while fetching plans",
      });
    }

    res.json(results);
  });
});

router.get("/get-all-job-plans", async (req, res) => {
  try {
    const sql = `
      SELECT jp.employee_id, jp.plan_type, jp.amount, jp.purchased_at, jp.expires_at, 
             j.title, j.company, j.status AS job_status
      FROM job_posting_plans jp
      LEFT JOIN jobs j ON jp.id = j.job_posting_plan_id  -- ✅ Corrected JOIN condition
      ORDER BY jp.purchased_at DESC
    `;

    query(sql, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ status: "error", message: "Database error" });
      }
      res.json(results);
    });
  } catch (error) {
    console.error("Error fetching job plans:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error fetching job plans" });
  }
});

export default router;

// import express from "express";
// import Razorpay from "razorpay";
// import crypto from "crypto";
// import query from "../config/db.js"; // Ensure correct DB connection

// const router = express.Router();

// const razorpay = new Razorpay({
//   key_id: "rzp_test_Zth6TBEqyhnUN9", // ✅ Ensure this is correct
//   key_secret: "F2jJKQBuTNqPqkAd9sGiAzYU", // ✅ Replace with your actual secret key
// });

// /**
//  * 📌 1️⃣ Create Order (Frontend Calls This API Before Payment)
//  */
// router.post("/create-order", async (req, res) => {
//   const { amount, user_id } = req.body;

//   try {
//     const options = {
//       amount: amount * 100, // Razorpay expects amount in paise
//       currency: "INR",
//       receipt: `order_${user_id}_${Date.now()}`,
//     };

//     const order = await razorpay.orders.create(options);
//     res.json({ order_id: order.id });
//   } catch (error) {
//     console.error("Razorpay Order Error:", error);
//     res
//       .status(500)
//       .json({ status: "error", message: "Failed to create order" });
//   }
// });

// /**
//  * 📌 2️⃣ Verify Payment and Store in Database
//  */
// router.post("/verify-payment", async (req, res) => {
//   const {
//     razorpay_payment_id,
//     razorpay_order_id,
//     razorpay_signature,
//     user_id,
//     request_data, // ✅ Receive request data from frontend
//   } = req.body;

//   try {
//     const body = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = crypto
//       .createHmac("sha256", "F2jJKQBuTNqPqkAd9sGiAzYU") // ✅ Use correct secret key
//       .update(body.toString())
//       .digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//       return res
//         .status(400)
//         .json({ status: "error", message: "Payment verification failed" });
//     }

//     // 🔹 Store Payment in Database
//     const insertPaymentSql = `
//       INSERT INTO payments (user_id, razorpay_payment_id, razorpay_order_id, status, created_at)
//       VALUES (?, ?, ?, 'success', NOW())
//     `;

//     query(
//       insertPaymentSql,
//       [user_id, razorpay_payment_id, razorpay_order_id],
//       (err) => {
//         if (err) {
//           console.error("Database error (payment):", err);
//           return res
//             .status(500)
//             .json({ status: "error", message: "Database error" });
//         }

//         // ✅ Store Request in Database After Payment
//         const { work_status, current_post, skills } = request_data;
//         const insertRequestSql = `
//         INSERT INTO job_seeker_requests (user_id, work_status, current_post, skills, created_at)
//         VALUES (?, ?, ?, ?, NOW())
//       `;

//         query(
//           insertRequestSql,
//           [user_id, work_status, current_post, skills],
//           (err2) => {
//             if (err2) {
//               console.error("Database error (request):", err2);
//               return res
//                 .status(500)
//                 .json({ status: "error", message: "Database error" });
//             }

//             res.json({
//               status: "success",
//               message: "Payment and request successful!",
//             });
//           }
//         );
//       }
//     );
//   } catch (error) {
//     console.error("Payment Verification Error:", error);
//     res
//       .status(500)
//       .json({ status: "error", message: "Payment verification failed" });
//   }
// });
// export default router;
