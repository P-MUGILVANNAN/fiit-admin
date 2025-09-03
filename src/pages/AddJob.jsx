// src/pages/AddJob.jsx
import React, { useState } from "react";
import axios from "axios";
import "../styles/AddJob.css";

const API_BASE = "https://jobs-backend-z4z9.onrender.com/api";

function AddJob() {
  const [formData, setFormData] = useState({
    companyName: "",
    title: "",
    description: "",
    skills: "",
    location: "",
    salary: "",
    jobType: "",
    experience: "",
    companyImage: null,
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Validation
  const validate = () => {
    let temp = {};
    if (!formData.companyName.trim()) temp.companyName = "Company name is required";
    if (!formData.title.trim()) temp.title = "Job title is required";
    if (!formData.description.trim()) temp.description = "Description is required";
    if (!formData.skills.trim()) temp.skills = "At least 1 skill is required";
    if (!formData.location.trim()) temp.location = "Location is required";
    if (!formData.jobType.trim()) temp.jobType = "Job type is required";
    if (!formData.experience.trim()) temp.experience = "Experience is required";
    if (!formData.salary.trim() || isNaN(formData.salary))
      temp.salary = "Valid salary is required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "companyImage") {
      setFormData({ ...formData, companyImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const data = new FormData();
      data.append("companyName", formData.companyName);
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("location", formData.location);
      data.append("salary", formData.salary);
      data.append("jobType", formData.jobType);
      data.append("experience", formData.experience);
      if (formData.companyImage) data.append("companyImage", formData.companyImage);

      // ✅ Send skills as plain CSV string
      data.append("skills", formData.skills);

      await axios.post(`${API_BASE}/jobs`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSubmitted(true);
      setFormData({
        companyName: "",
        title: "",
        description: "",
        skills: "",
        location: "",
        salary: "",
        jobType: "",
        experience: "",
        companyImage: null,
      });
      setErrors({});
    } catch (error) {
      console.error("Job creation failed:", error);
      alert(error.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="jobform-container">
      <h2 className="mb-4 text-center">Add New Job</h2>

      {submitted && (
        <div className="alert alert-success">Job posted successfully!</div>
      )}

      <form onSubmit={handleSubmit} className="p-4 rounded shadow-sm bg-light">
        {/* Company name */}
        <div className="mb-3">
          <label className="form-label">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className={`form-control ${errors.companyName ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.companyName}</div>
        </div>

        {/* Title */}
        <div className="mb-3">
          <label className="form-label">Job Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`form-control ${errors.title ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.title}</div>
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className={`form-control ${errors.description ? "is-invalid" : ""}`}
          ></textarea>
          <div className="invalid-feedback">{errors.description}</div>
        </div>

        {/* Skills */}
        <div className="mb-3">
          <label className="form-label">Skills (comma separated)</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className={`form-control ${errors.skills ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.skills}</div>
        </div>

        {/* Location */}
        <div className="mb-3">
          <label className="form-label">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`form-control ${errors.location ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.location}</div>
        </div>

        {/* Job Type */}
        <div className="mb-3">
          <label className="form-label">Job Type</label>
          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            className={`form-select ${errors.jobType ? "is-invalid" : ""}`}
          >
            <option value="">Select type</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
          <div className="invalid-feedback">{errors.jobType}</div>
        </div>

        {/* Experience */}
        <div className="mb-3">
          <label className="form-label">Experience</label>
          <select
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className={`form-select ${errors.experience ? "is-invalid" : ""}`}
          >
            <option value="">Select experience</option>
            <option value="Fresher">Fresher</option>
            <option value="0-1 Years">0-1 Years</option>
            <option value="1-3 Years">1-3 Years</option>
            <option value="3-5 Years">3-5 Years</option>
            <option value="5+ Years">5+ Years</option>
          </select>
          <div className="invalid-feedback">{errors.experience}</div>
        </div>

        {/* Salary */}
        <div className="mb-3">
          <label className="form-label">Salary</label>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className={`form-control ${errors.salary ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.salary}</div>
        </div>

        {/* Company Image */}
        <div className="mb-3">
          <label className="form-label">Company Image</label>
          <input
            type="file"
            name="companyImage"
            accept="image/*"
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Posting..." : "Add Job"}
        </button>
      </form>
    </div>
  );
}

export default AddJob;
