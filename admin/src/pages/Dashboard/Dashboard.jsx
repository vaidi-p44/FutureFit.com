import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./Dashboard.module.css";
// import useAuth from "../../components/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
  const [period, setPeriod] = useState("monthly");
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem("admin_token");

    if (!adminToken) {
      alert("Unauthorized! Please log in through the job portal.");
      window.close(); // Close the tab if unauthorized
    }
  }, []);

  const stats = [
    { title: "Total Employees", count: 150, increase: "+12%" },
    { title: "Active Job Seekers", count: 1250, increase: "+25%" },
    { title: "Posted Jobs", count: 85, increase: "+10%" },
    { title: "Applications", count: 450, increase: "+18%" },
  ];

  const chartData = [
    { name: "Jan", applications: 65, hires: 28 },
    { name: "Feb", applications: 85, hires: 32 },
    { name: "Mar", applications: 95, hires: 40 },
    { name: "Apr", applications: 75, hires: 30 },
    { name: "May", applications: 110, hires: 45 },
    { name: "Jun", applications: 130, hires: 55 },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className={styles.periodSelect}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <h3>{stat.title}</h3>
            <div className={styles.statInfo}>
              <span className={styles.count}>{stat.count}</span>
              <span className={styles.increase}>{stat.increase}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.charts}>
        <div className={styles.chartCard}>
          <h3>Applications Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="applications" fill="#4154f1" />
              <Bar dataKey="hires" fill="#2eca6a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h3>Hiring Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="hires" stroke="#4154f1" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
