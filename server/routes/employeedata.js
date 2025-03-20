import express from "express";
import query from "../config/db.js"; // Ensure this is your database connection

const router = express.Router();

router.get("/api/employee/:user_id", async (req, res) => {
  const { user_id } = req.params;
  console.log("Fetching data for user_id:", user_id); // Log the user_id

  try {
    // SQL query to fetch employee data based on user_id
    const sql = `
    SELECT 
      e.user_id, e.user_email, e.user_mobile, e.is_verified,
      er.hiringFor, er.companyName, er.industry, er.employeeCount,
      er.designation, er.pincode, er.address, er.companyLogo,
      j.title
    FROM employee e
    LEFT JOIN EmployeeRegistration er ON e.user_id = er.user_id
    LEFT JOIN jobs j ON e.user_id = j.user_id
    WHERE e.user_id = ?
   
  `;

    // const sql = `
    //     SELECT
    //       e.user_id, e.user_email, e.user_mobile, e.is_verified,
    //       er.hiringFor, er.companyName, er.industry, er.employeeCount,
    //       er.designation, er.pincode, er.address, er.companyLogo
    //     FROM employee e
    //     LEFT JOIN EmployeeRegistration er ON e.user_id = er.user_id
    //     WHERE e.user_id = ?;
    //   `;

    const result = await query(sql, [user_id]);
    console.log("Query result:", result); // Log query result for debugging

    if (result.length === 0) {
      console.log("No employee found for user_id:", user_id); // Log if no data is found
      return res
        .status(404)
        .json({ status: "error", message: "Employee not found." });
    }

    // Return the first result from the query
    res.status(200).json({ status: "success", data: result[0] });
  } catch (error) {
    console.error("Error fetching employee data:", error);
    res
      .status(500)
      .json({ status: "error", message: "Internal server error." });
  }
});

// ✅ Update Employee Data
router.put("/api/employee/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const {
    hiringFor,
    companyName,
    industry,
    employeeCount,
    designation,
    pincode,
    address,
    companyLogo,
    user_email,
    user_mobile,
    is_verified,
  } = req.body;

  console.log("Received Update Request for:", user_id);
  console.log("Request Body:", req.body);

  try {
    if (!user_email) {
      return res.status(400).json({ error: "Email is required." });
    }

    // ✅ Ensure `user_mobile` is not null
    let mobileNumber = user_mobile?.trim(); // Trim to remove spaces

    if (!mobileNumber) {
      // Fetch existing mobile number if not provided
      const existingUser = await query(
        "SELECT user_mobile FROM employee WHERE user_id = ?",
        [user_id]
      );

      if (existingUser.length > 0 && existingUser[0].user_mobile) {
        mobileNumber = existingUser[0].user_mobile; // Retain existing value
      } else {
        mobileNumber = "Not Provided"; // Set a default value
      }
    }

    console.log("Using Mobile Number:", mobileNumber);

    // ✅ Ensure `user_mobile` is not NULL
    if (!mobileNumber || mobileNumber.toLowerCase() === "null") {
      return res.status(400).json({ error: "Invalid mobile number." });
    }

    // ✅ Update `employee` table
    const updateEmployeeSQL = `
      UPDATE employee 
      SET 
          user_email = ?, 
          user_mobile = ?, 
          is_verified = ?
      WHERE user_id = ?;
    `;

    const employeeResult = await query(updateEmployeeSQL, [
      user_email,
      mobileNumber, // Ensured non-null value
      is_verified,
      user_id,
    ]);

    if (employeeResult.affectedRows === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    console.log("Employee table updated successfully.");

    // ✅ Update `EmployeeRegistration` table
    const updateRegistrationSQL = `
      UPDATE EmployeeRegistration 
      SET 
          hiringFor = ?, 
          companyName = ?, 
          industry = ?, 
          employeeCount = ?, 
          designation = ?, 
          pincode = ?, 
          address = ?, 
          companyLogo = ?
      WHERE user_id = ?;
    `;

    const registrationResult = await query(updateRegistrationSQL, [
      hiringFor || null, // Use null for optional fields
      companyName || null,
      industry || null,
      employeeCount || null,
      designation || null,
      pincode || null,
      address || null,
      companyLogo || null,
      user_id,
    ]);

    if (registrationResult.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Employee registration not found" });
    }

    console.log("EmployeeRegistration table updated successfully.");

    res
      .status(200)
      .json({ status: "success", message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating employee data:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

export default router;
