// src/pages/Applications.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Applications.css";

const API_BASE = "https://jobs-backend-z4z9.onrender.com/api";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [confirmBox, setConfirmBox] = useState(null);
  const [notifyMsg, setNotifyMsg] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchApplications(page);
  }, [page]);

  const fetchApplications = async (pageNum) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE}/admin/applications?page=${pageNum}&limit=10`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications(res.data.applications || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (app, status) => {
    setSelectedApp(app);
    setNewStatus(status);
    setConfirmBox(`Change status to "${status}"?`);
  };

  const confirmStatusChange = async () => {
    try {
      await axios.patch(
        `${API_BASE}/admin/applications/${selectedApp._id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setConfirmBox(null);
      fetchApplications(page);
    } catch (err) {
      console.error(err);
      setNotifyMsg("Error updating status.");
    }
  };

  const handleNotify = async (appId) => {
    try {
      await axios.post(
        `${API_BASE}/admin/applications/${appId}/notify`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifyMsg("✅ Notification sent successfully!");
    } catch (err) {
      console.error(err);
      setNotifyMsg("Error sending notification.");
    }
  };

  const filteredApplications = applications.filter((app) => {
    const q = search.toLowerCase();
    return (
      app.applicant?.name?.toLowerCase().includes(q) ||
      app.applicant?.email?.toLowerCase().includes(q) ||
      app.job?.title?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="loading-spinner-container">
        <div className="spinner"></div>
        <p>Loading applications...</p>
      </div>
    );
  }

  if (error) return <p className="text-center error">{error}</p>;
  if (!applications.length)
    return <p className="text-center no-data">No applications found</p>;

  return (
    <div className="applications-container">
      <div className="header-row">
        <h2>Applications</h2>
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, email, or job..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-wrapper">
        <table className="applications-table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Email</th>
              <th>Job</th>
              <th>Status</th>
              <th>Applied On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => (
              <tr key={app._id}>
                <td>{app.applicant?.name || "N/A"}</td>
                <td>{app.applicant?.email || "N/A"}</td>
                <td>{app.job?.title || "N/A"}</td>
                <td>
                  <span className={`status-badge ${app.status}`}>
                    {app.status}
                  </span>
                </td>
                <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                <td>
                  <div className="status-actions">
                    <select
                      className="status-select"
                      value={app.status}
                      onChange={(e) =>
                        handleStatusChange(app, e.target.value)
                      }
                    >
                      <option value="applied">Applied</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleNotify(app._id)}
                    >
                      Notify
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          className="btn"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="btn"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {/* Confirm Box */}
      {confirmBox && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{confirmBox}</h3>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={confirmStatusChange}>
                Yes, Confirm
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setConfirmBox(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Message */}
      {notifyMsg && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{notifyMsg}</h3>
            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={() => setNotifyMsg(null)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
