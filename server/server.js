import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import loginRoutes from "./routes/loginlogout.js";
import registerRoutes from "./routes/register.js";
import educationRoutes from "./routes/education.js";
import aboutyouRouter from "./routes/aboutyou.js";
import careerPreferencesRoutes from "./routes/CareerPreferences.js";
import skill_or_languages from "./routes/skill_and_languages.js";
import employeeRoutes from "./routes/EmployeeRegistration.js";
import resumeRoutes from "./routes/resume.js";
import candidatesRoutes from "./routes/candidates.js";
import jobs from "./routes/jobs.js";
import employeeRouter from "./routes/employeedata.js";
import passwordResetRoutes from "./routes/passwordReset.js";
import applyJobRoutes from "./routes/applyjobs.js";
import feedbackRoutes from "./routes/feedback.js";
// import authRoutes from "./routes/authRoutes.js";
import google from "./routes/google.js";
import requestroute from "./routes/request.js";
import payment from "./routes/payment.js";
import "./routes/cronJobs.js";

const app = express();
app.use(express.json());
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);

app.use(cookieParser());
app.timeout = 60000;

app.use(express.urlencoded({ extended: true }));
app.use("/", loginRoutes);
app.use(registerRoutes);
app.use("/api", aboutyouRouter);
app.use("/api", educationRoutes);
app.use("/api", careerPreferencesRoutes);
app.use("/api", skill_or_languages);
app.use("/api", employeeRoutes);
app.use("/api", resumeRoutes);
app.use("/api", candidatesRoutes);
app.use("/api", jobs);
app.use(employeeRouter);
app.use("/api", passwordResetRoutes);
app.use("/api", applyJobRoutes);
app.use("/api", google);
app.use("/api", feedbackRoutes);
app.use("/api", requestroute);
app.use("/api", payment);
// app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
