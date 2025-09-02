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
        setShowErrorModal(true); // 🔹 show error modal
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
      navigate("/jobs"); // ✅ go back to jobs
    } catch (err) {
      setError("Error deleting job.");
      setShowErrorModal(true); // 🔹 show error modal
    }
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-box">
          <h3>Loading job details...</h3>
        </div>
      </div>
    );
  }

  if (!job && !loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-box">
          <h3>Job not found</h3>
          <button className="btn btn-primary" onClick={() => navigate("/jobs")}>
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="job-details-container">
      <h2>{job.title}</h2>

      {job.companyImage && (
        <img src={job.companyImage} alt={job.company} className="company-img" />
      )}

      <div className="job-info">
        <p><span>Company:</span> {job.companyName}</p>
        <p><span>Location:</span> {job.location}</p>
        <p><span>Type:</span> {job.jobType || job.type}</p>
        <p><span>Salary:</span> ₹ {job.salary?.toLocaleString()}</p>
        <p><span>Description:</span> {job.description}</p>
      </div>

      {job.requirements?.length > 0 && (
        <div className="job-requirements">
          <h4>Requirements</h4>
          <ul>
            {job.requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="job-actions">
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/admin/jobs/edit/${id}`)}
        >
          Edit Job
        </button>
        <button
          className="btn btn-danger"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete Job
        </button>
      </div>

      {/* 🔹 Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Are you sure you want to delete this job?</h3>
            <div className="modal-actions">
              <button className="btn btn-danger" onClick={handleDelete}>
                Yes, Delete
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Error Modal */}
      {showErrorModal && (
        <div className="modal-overlay">
          <div className="modal-box error-box">
            <h3>⚠️ Oops!</h3>
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
