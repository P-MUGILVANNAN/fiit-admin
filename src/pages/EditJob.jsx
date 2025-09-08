// src/pages/EditJob.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EditJob.css";

const API_BASE = "https://jobs-backend-z4z9.onrender.com/api";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    title: "",
    description: "",
    skills: "",
    location: "",
    salary: "",
    jobType: "",
    experience: "",
  });

  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, type: "", message: "" });

  // 🔹 Load job data
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_BASE}/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data;
        setFormData({
          companyName: data.companyName || "",
          title: data.title || "",
          description: data.description || "",
          skills: data.skills ? data.skills.join(",") : "",
          location: data.location || "",
          salary: data.salary || "",
          jobType: data.jobType || "",
          experience: data.experience || "",
        });
      })
      .catch((err) => {
        console.error("Error fetching job:", err);
        setModal({
          show: true,
          type: "error",
          message: "Failed to load job details.",
        });
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.put(`${API_BASE}/jobs/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setModal({
        show: true,
        type: "success",
        message: "Job updated successfully!",
      });
    } catch (err) {
      console.error("Error updating job:", err);
      setModal({
        show: true,
        type: "error",
        message: err.response?.data?.message || "Failed to update job",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="jobform-container">
      <h2 className="text-center mb-4">Edit Job</h2>

      <form onSubmit={handleSubmit} className="jobform-box">
        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            name="companyName"
            placeholder="Enter company name"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Job Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter job title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Enter job description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label>Skills (comma separated)</label>
          <input
            type="text"
            name="skills"
            placeholder="e.g. JavaScript, React"
            value={formData.skills}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            placeholder="Job location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Salary (₹)</label>
          <input
            type="number"
            name="salary"
            placeholder="Enter salary"
            value={formData.salary}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Job Type</label>
          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            required
          >
            <option value="">Select job type</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        <div className="form-group">
          <label>Experience</label>
          <select
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
          >
            <option value="">Select experience</option>
            <option value="Fresher">Fresher</option>
            <option value="0-1 Years">0-1 Years</option>
            <option value="1-3 Years">1-3 Years</option>
            <option value="3-5 Years">3-5 Years</option>
            <option value="5+ Years">5+ Years</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? (
            <div className="spinner"></div>
          ) : (
            "Update Job"
          )}
        </button>
      </form>

      {/* Modal */}
      {modal.show && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{modal.message}</h3>
            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setModal({ ...modal, show: false });
                  if (modal.type === "success") navigate("/jobs");
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditJob;
