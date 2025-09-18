import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Jobs.css";

const API_BASE = "https://jobs-backend-z4z9.onrender.com/api";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const navigate = useNavigate();

  // 🔹 Fetch Jobs
  const fetchJobs = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/jobs?page=${pageNum}&limit=10`);
      setJobs(res.data.jobs || []);
      setFilteredJobs(res.data.jobs || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(page);
  }, [page]);

  // 🔹 Delete Job
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs((prev) => prev.filter((job) => job._id !== id));
      setFilteredJobs((prev) => prev.filter((job) => job._id !== id));
      setConfirmDelete(null);
    } catch (err) {
      console.error("Delete error:", err);
      setConfirmDelete(null);
      alert("Failed to delete job ❌");
    }
  };

  // 🔹 Search Filter
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (!term) return setFilteredJobs(jobs);

    const filtered = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(term) ||
        (job.location && job.location.toLowerCase().includes(term)) ||
        (job.companyName && job.companyName.toLowerCase().includes(term))
    );
    setFilteredJobs(filtered);
  };

  return (
    <div className="jobs-list-container">
      {/* Header */}
      <div className="job-header">
        <h1>Job Management</h1>
        <div className="job-header-actions">
          <input
            type="text"
            placeholder="Search jobs..."
            className="search-bar"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button
            className="add-job-btn"
            onClick={() => navigate("/jobs/add")}
          >
            + Add Job
          </button>
        </div>
      </div>

      {/* Grid of Cards */}
      {loading ? (
        <div className="spinner"></div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : filteredJobs.length === 0 ? (
        <p className="no-data">No jobs found</p>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <div key={job._id} className="job-card">
              <div className="job-card-header">
                <div className="job-logo-container">
                  {job.companyImage ? (
                    <img src={job.companyImage} alt="company logo" className="job-logo" />
                  ) : (
                    <span className="text-muted-logo">No Logo</span>
                  )}
                </div>
                <div className="job-info">
                  <h3 className="job-title">{job.title}</h3>
                  <p className="job-company">{job.companyName}</p>
                </div>
              </div>
              <div className="job-details">
                <div className="detail-item">
                  <p className="detail-label">Location:</p>
                  <p className="detail-value">{job.location}</p>
                </div>
                <div className="detail-item">
                  <p className="detail-label">Type:</p>
                  <p className="detail-value">{job.jobType}</p>
                </div>
                <div className="detail-item">
                  <p className="detail-label">Experience:</p>
                  <p className="detail-value">{job.experience}</p>
                </div>
                <div className="detail-item">
                  <p className="detail-label">Salary:</p>
                  <p className="detail-value">₹ {job.salary?.toLocaleString()}</p>
                </div>
                <div className="detail-item">
                  <p className="detail-label">Posted:</p>
                  <p className="detail-value">{new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="card-actions">
                {confirmDelete === job._id ? (
                  <>
                    <p className="confirm-text">Confirm Delete?</p>
                    <button
                      className="btn-sm btn-danger"
                      onClick={() => handleDelete(job._id)}
                    >
                      Yes
                    </button>
                    <button
                      className="btn-sm btn-secondary"
                      onClick={() => setConfirmDelete(null)}
                    >
                      No
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn-sm btn-secondary"
                      onClick={() => navigate(`/admin/jobs/${job._id}`)}
                    >
                      View
                    </button>
                    <button
                      className="btn-sm btn-danger"
                      onClick={() => setConfirmDelete(job._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-wrapper">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="page-btn"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx + 1)}
              className={`page-btn ${page === idx + 1 ? "active" : ""}`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="page-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}