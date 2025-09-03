import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const { token } = useContext(AdminContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          "https://jobs-backend-z4z9.onrender.com/api/admin/dashboard/stats",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStats(response.data.stats);
      } catch (err) {
        setError("Failed to fetch dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading)
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );

  if (error)
    return (
      <div className="dashboard-error">
        <div className="error-icon">⚠️</div>
        <p>{error}</p>
        <button className="retry-btn" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );

  if (!stats) return null;

  const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back! Here's what's happening with your job platform.</p>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-cards">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💼</div>
          <div className="stat-content">
            <h3>{stats.totalJobs}</h3>
            <p>Total Jobs</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{stats.totalApplications}</h3>
            <p>Applications</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.openJobs}</h3>
            <p>Open Jobs</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <h3>{stats.closedJobs}</h3>
            <p>Closed Jobs</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="dashboard-charts">
        <div className="chart-card">
          <h2>Job Categories</h2>
          <p>Distribution by category</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.jobCategories}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {stats.jobCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} jobs`, "Count"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Applications per Job</h2>
          <p>Number of applicants</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.applicationsPerJob}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="title"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} applicants`, "Total"]} />
              <Legend />
              <Bar
                dataKey="totalApplicants"
                fill="#4f46e5"
                radius={[4, 4, 0, 0]}
                name="Applicants"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
