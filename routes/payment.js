// import express from "express";
// import Razorpay from "razorpay";
// import crypto from "crypto";
// import dotenv from "dotenv";

// dotenv.config();
// const router = express.Router();

// // Initialize Razorpay instance
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

// // Create a new payment order
// router.post("/create-order", async (req, res) => {
//   try {
//     const options = {
//       amount: req.body.amount, // Amount in paisa (₹500 = 50000)
//       currency: "INR",
//       receipt: crypto.randomBytes(10).toString("hex"),
//     };

//     const order = await razorpay.orders.create(options);
//     res.status(200).json({ orderId: order.id });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).json({ error: "Failed to create Razorpay order" });
//   }
// });

// // Verify payment signature
// router.post("/verify-payment", (req, res) => {
//   const { order_id, payment_id, signature } = req.body;

//   const generatedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_SECRET)
//     .update(order_id + "|" + payment_id)
//     .digest("hex");

//   if (generatedSignature === signature) {
//     res.status(200).json({ status: "success", message: "Payment verified" });
//   } else {
//     res.status(400).json({ status: "error", message: "Payment verification failed" });
//   }
// });

// export default router;
