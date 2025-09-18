// src/pages/JobDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/JobDetails.css";

const API_BASE = "https://jobs-backend-z4z9.onrender.com/api";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${API_BASE}/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        setError("Failed to load job details.");
        setShowErrorModal(true);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowDeleteModal(false);
      navigate("/jobs");
    } catch (err) {
      setError("Error deleting job.");
      setShowErrorModal(true);
    }
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job && !loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-box">
          <h3>Job not found</h3>
          <p>The job you're looking for doesn't exist or has been removed.</p>
          <button className="btn btn-primary" onClick={() => navigate("/jobs")}>
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="job-details-container">
      <div className="job-details-header">
        <div className="company-info">
          {job.companyImage && (
            <img src={job.companyImage} alt={job.company} className="company-img" />
          )}
          <div className="company-details">
            <h1>{job.title}</h1>
            <h2>{job.companyName}</h2>
            <div className="job-meta">
              <span className="location">{job.location}</span>
              <span className="job-type">{job.jobType || job.type}</span>
            </div>
          </div>
        </div>
        
        <div className="salary-badge">
          <span className="salary-amount">₹{job.salary?.toLocaleString()}</span>
          <span className="salary-label">per year</span>
        </div>
      </div>

      <div className="job-content">
        <div className="job-details-grid">
          <div className="detail-card">
            <div className="detail-icon">📁</div>
            <div className="detail-content">
              <h3>Category</h3>
              <p>{job.category}</p>
            </div>
          </div>
          
          <div className="detail-card">
            <div className="detail-icon">🎓</div>
            <div className="detail-content">
              <h3>Qualification</h3>
              <p>{job.qualification}</p>
            </div>
          </div>
        </div>
        
        <div className="description-section">
          <h3>Job Description</h3>
          <p>{job.description}</p>
        </div>
        
        <div className="job-actions">
          <button
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/admin/jobs/edit/${id}`)}
          >
            ✏️ Edit Job
          </button>
          <button
            className="btn btn-danger"
            onClick={() => setShowDeleteModal(true)}
          >
            🗑 Delete Job
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-icon">⚠️</div>
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this job posting? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="modal-overlay">
          <div className="modal-box error-box">
            <div className="modal-icon">❌</div>
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button
              className="btn btn-primary"
              onClick={() => setShowErrorModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;