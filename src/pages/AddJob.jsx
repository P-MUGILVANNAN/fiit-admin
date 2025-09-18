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
    qualification: "",
    category: "",
    location: "",
    salary: "",
    jobType: "",
    experience: "",
    companyImage: null,
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation
  const validate = () => {
    let temp = {};
    if (!formData.companyName.trim()) temp.companyName = "Company name is required";
    if (!formData.title.trim()) temp.title = "Job title is required";
    if (!formData.description.trim()) temp.description = "Description is required";
    if (!formData.skills.trim()) temp.skills = "At least 1 skill is required";
    if (!formData.qualification.trim()) temp.qualification = "Qualification is required";
    if (!formData.category.trim()) temp.category = "Category is required";
    if (!formData.location.trim()) temp.location = "Location is required";
    if (!formData.jobType.trim()) temp.jobType = "Job type is required";
    if (!formData.experience.trim()) temp.experience = "Experience is required";
    if (!formData.salary.trim() || isNaN(formData.salary))
      temp.salary = "Valid salary is required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "companyImage") {
      setFormData({ ...formData, companyImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });

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
        qualification: "",
        category: "",
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
      <div className="jobform-header">
        <h2>Add New Job</h2>
        <p>Fill in the details below to post a new job opening</p>
      </div>

      {submitted && (
        <div className="alert-success">
          <span className="success-icon">✓</span>
          Job posted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="job-form">
        <div className="form-row">
          {/* Company name */}
          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className={errors.companyName ? "is-invalid" : ""}
              placeholder="Enter company name"
            />
            {errors.companyName && <div className="invalid-feedback">{errors.companyName}</div>}
          </div>

          {/* Title */}
          <div className="form-group">
            <label>Job Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? "is-invalid" : ""}
              placeholder="Enter job title"
            />
            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
          </div>
        </div>

        {/* Description */}
        <div className="form-group full-width">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className={errors.description ? "is-invalid" : ""}
            placeholder="Describe the job responsibilities and requirements"
          ></textarea>
          {errors.description && <div className="invalid-feedback">{errors.description}</div>}
        </div>

        <div className="form-row">
          {/* Skills */}
          <div className="form-group">
            <label>Skills (comma separated)</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className={errors.skills ? "is-invalid" : ""}
              placeholder="e.g. JavaScript, React, Node.js"
            />
            {errors.skills && <div className="invalid-feedback">{errors.skills}</div>}
          </div>

          {/* Qualification */}
          <div className="form-group">
            <label>Qualification</label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className={errors.qualification ? "is-invalid" : ""}
              placeholder="Required qualifications"
            />
            {errors.qualification && (
              <div className="invalid-feedback">{errors.qualification}</div>
            )}
          </div>
        </div>

        <div className="form-row">
          {/* Category */}
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? "is-invalid" : ""}
            >
              <option value="">Select category</option>
              <option value="Networking">Networking</option>
              <option value="Linux">Linux</option>
              <option value="AWS">AWS</option>
              <option value="Accounts">Accounts</option>
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="DevOps">DevOps</option>
              <option value="Testing">Testing</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="Data Scientist">Data Scientist</option>
            </select>
            {errors.category && (
              <div className="invalid-feedback">{errors.category}</div>
            )}
          </div>

          {/* Location */}
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={errors.location ? "is-invalid" : ""}
              placeholder="e.g. New York, Remote"
            />
            {errors.location && <div className="invalid-feedback">{errors.location}</div>}
          </div>
        </div>

        <div className="form-row">
          {/* Job Type */}
          <div className="form-group">
            <label>Job Type</label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className={errors.jobType ? "is-invalid" : ""}
            >
              <option value="">Select type</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
            {errors.jobType && <div className="invalid-feedback">{errors.jobType}</div>}
          </div>

          {/* Experience */}
          <div className="form-group">
            <label>Experience</label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className={errors.experience ? "is-invalid" : ""}
            >
              <option value="">Select experience</option>
              <option value="Fresher">Fresher</option>
              <option value="0-1 Years">0-1 Years</option>
              <option value="1-3 Years">1-3 Years</option>
              <option value="3-5 Years">3-5 Years</option>
              <option value="5+ Years">5+ Years</option>
            </select>
            {errors.experience && <div className="invalid-feedback">{errors.experience}</div>}
          </div>
        </div>

        <div className="form-row">
          {/* Salary */}
          <div className="form-group">
            <label>Salary ($)</label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className={errors.salary ? "is-invalid" : ""}
              placeholder="Annual salary"
            />
            {errors.salary && <div className="invalid-feedback">{errors.salary}</div>}
          </div>

          {/* Company Image */}
          <div className="form-group">
            <label>Company Image</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                name="companyImage"
                accept="image/*"
                onChange={handleChange}
                id="companyImage"
              />
              <label htmlFor="companyImage" className="file-input-label">
                Choose File
              </label>
              {formData.companyImage && (
                <span className="file-name">{formData.companyImage.name}</span>
              )}
            </div>
          </div>
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner"></span>
              Posting...
            </>
          ) : (
            "Add Job"
          )}
        </button>
      </form>
    </div>
  );
}

export default AddJob;