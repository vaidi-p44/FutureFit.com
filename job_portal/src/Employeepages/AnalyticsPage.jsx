import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  Download,
  TrendingUp,
  Users,
  Briefcase,
  CheckCircle,
} from "lucide-react";
import styles from "./AnalyticsPage.module.css";

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("last30");

  const metrics = [
    {
      icon: <Users />,
      label: "Total Applications",
      value: "1,234",
      trend: "+12%",
      positive: true,
    },
    {
      icon: <Briefcase />,
      label: "Active Jobs",
      value: "45",
      trend: "+5%",
      positive: true,
    },
    {
      icon: <CheckCircle />,
      label: "Hired Candidates",
      value: "89",
      trend: "+8%",
      positive: true,
    },
    {
      icon: <TrendingUp />,
      label: "Response Rate",
      value: "68%",
      trend: "-2%",
      positive: false,
    },
  ];

  const applicationData = [
    { name: "Week 1", applications: 120, shortlisted: 45, hired: 12 },
    { name: "Week 2", applications: 150, shortlisted: 55, hired: 15 },
    { name: "Week 3", applications: 180, shortlisted: 65, hired: 18 },
    { name: "Week 4", applications: 210, shortlisted: 75, hired: 22 },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Recruitment Analytics</h1>
        <div className={styles.headerActions}>
          <div className={styles.dateSelector}>
            <Calendar size={20} />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="last7">Last 7 days</option>
              <option value="last30">Last 30 days</option>
              <option value="last90">Last 90 days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <button className={styles.downloadButton}>
            <Download size={20} />
            Export Report
          </button>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        {metrics.map((metric, index) => (
          <div key={index} className={styles.metricCard}>
            <div className={styles.metricIcon}>{metric.icon}</div>
            <div className={styles.metricInfo}>
              <span className={styles.metricLabel}>{metric.label}</span>
              <span className={styles.metricValue}>{metric.value}</span>
              <span
                className={`${styles.metricTrend} ${metric.positive ? styles.positive : styles.negative}`}
              >
                {metric.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chartsSection}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Application Trends</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={applicationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="applications"
                fill="#2563eb"
                name="Total Applications"
              />
              <Bar dataKey="shortlisted" fill="#10b981" name="Shortlisted" />
              <Bar dataKey="hired" fill="#6366f1" name="Hired" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
