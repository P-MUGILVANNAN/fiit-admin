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
  const [confirmDelete, setConfirmDelete] = useState(null); // job id waiting for confirm

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

      {/* Table */}
      {loading ? (
        <div className="spinner"></div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : filteredJobs.length === 0 ? (
        <p className="no-data">No jobs found</p>
      ) : (
        <div className="table-wrapper">
          <table className="jobs-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Company</th>
                <th>Title</th>
                <th>Location</th>
                <th>Type</th>
                <th>Experience</th>
                <th>Salary</th>
                <th>Posted</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job, index) => (
                <tr key={job._id}>
                  <td>{index + 1 + (page - 1) * 10}</td>
                  <td>
                    {job.companyImage ? (
                      <img
                        src={job.companyImage}
                        alt="company"
                        className="table-avatar"
                      />
                    ) : (
                      <span className="text-muted">No Logo</span>
                    )}
                  </td>
                  <td>{job.title}</td>
                  <td>{job.location}</td>
                  <td>
                    <span className="status-badge normal">{job.jobType}</span>
                  </td>
                  <td>
                    <span className="status-badge normal">{job.experience}</span>
                  </td>
                  <td>₹ {job.salary?.toLocaleString()}</td>
                  <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                  <td className="actions-cell mt-2">
                    {confirmDelete === job._id ? (
                      <>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
