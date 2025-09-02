import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/UserDetails.css";

const API_BASE = "https://jobs-backend-z4z9.onrender.com/api";

export default function UserDetails() {
  const { id } = useParams(); // userId from URL
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <p className="loading">Loading user details...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!user) return <p className="no-data">User not found.</p>;

  return (
    <div className="user-details-container">
      <button onClick={() => navigate(-1)} className="btn btn-secondary back-btn">
        ← Back
      </button>

      <div className="user-profile-header">
        <img
          src={user.profileImage || user.avatar || "/default-avatar.png"}
          alt={user.name}
          className="user-avatar-lg"
        />
        <div className="user-profile-info">
          <h1>{user.name || "Unnamed User"}</h1>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
          {user.location && <p><strong>Location:</strong> {user.location}</p>}
          {user.experience && <p><strong>Experience:</strong> {user.experience}</p>}
          <p className={`status-badge ${user.isSuspicious ? "suspicious" : "normal"}`}>
            {user.isSuspicious ? "Suspicious" : "Normal"}
          </p>
        </div>
      </div>

      {/* About */}
      {user.about && (
        <div className="user-section">
          <h3>About</h3>
          <p>{user.about}</p>
        </div>
      )}

      {/* Skills */}
      {user.skills?.length > 0 && (
        <div className="user-section">
          <h3>Skills</h3>
          <div className="skills">
            {user.skills.map((skill, idx) => (
              <span key={idx} className="skill-badge">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {user.education?.length > 0 && (
        <div className="user-section">
          <h3>Education</h3>
          <ul>
            {user.education.map((edu, idx) => (
              <li key={idx}>
                <strong>{edu.level}</strong> at {edu.institution} ({edu.startYear} - {edu.endYear})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Projects */}
      {user.projects?.length > 0 && (
        <div className="user-section">
          <h3>Projects</h3>
          <ul>
            {user.projects.map((proj, idx) => (
              <li key={idx}>
                <strong>{proj.projectName}</strong> - {proj.duration}
                {proj.liveLink && (
                  <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" className="link-btn"> [Live]</a>
                )}
                {proj.githubLink && (
                  <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" className="link-btn"> [GitHub]</a>
                )}
                <p>{proj.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Resume */}
      {user.resume && (
        <div className="user-section resume-viewer">
          <h3>Resume</h3>
          <div className="resume-actions">
            <a
              href={`https://docs.google.com/viewer?url=${encodeURIComponent(user.resume)}&embedded=true`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              View Resume
            </a>
          </div>
        </div>
      )}

      {/* Applied Jobs */}
      {user.appliedJobs?.length > 0 && (
        <div className="user-section">
          <h3>Applied Jobs</h3>
          <p>Total: {user.appliedJobs.length}</p>
        </div>
      )}
    </div>
  );
}
