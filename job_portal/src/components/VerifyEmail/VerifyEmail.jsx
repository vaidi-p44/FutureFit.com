import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState("Verifying email...");
  const [statusType, setStatusType] = useState("loading");

  useEffect(() => {
    // ✅ Extract token manually
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    console.log("Extracted Token from URL:", token); // Debugging log

    if (!token) {
      setStatusMessage("Invalid verification link.");
      setStatusType("error");
      return;
    }

    axios
      .get(`http://localhost:8081/verify-email?token=${token}`)
      .then((res) => {
        if (res.data.status === "success") {
          setStatusMessage("✅ Email Verified Successfully!");
          setStatusType("success");

          // ✅ Update Local Storage
          localStorage.setItem("isEmailVerified", "true");

          setTimeout(() => {
            navigate("/aboutyou");
          }, 2000);
        }
      })
      .catch(() => {
        setStatusMessage("❌ Invalid or Expired Token.");
        setStatusType("error");
      });
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      {statusType === "loading" && <h2>🔄 {statusMessage}</h2>}
      {statusType === "success" && (
        <h2 style={{ color: "green" }}>{statusMessage}</h2>
      )}
      {statusType === "error" && (
        <h2 style={{ color: "red" }}>{statusMessage}</h2>
      )}
    </div>
  );
};

export default VerifyEmail;
