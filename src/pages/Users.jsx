import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/User.css";

const API_BASE = "https://jobs-backend-z4z9.onrender.com/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.users || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        if (err.response?.status === 401) {
          setError("Unauthorized. Admin login required.");
        } else if (err.response?.status === 403) {
          setError("Access forbidden. Admin role required.");
        } else {
          setError("Failed to load users. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      alert("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    }
  };

  const handleToggleSuspicious = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_BASE}/admin/users/${userId}/toggle-suspicious`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isSuspicious: !currentStatus } : u
        )
      );

      alert(`User marked as ${!currentStatus ? "suspicious" : "normal"}`);
    } catch (err) {
      console.error("Error toggling suspicious status:", err);
      alert("Failed to update user status");
    }
  };

  if (loading) return <p className="loading">Loading users...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!users.length) return <p className="no-data">No users found.</p>;

  return (
    <div className="user-list-container">
      <h1>User Management</h1>
      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className={user.isSuspicious ? "suspicious-row" : ""}
              >
                <td data-label="Photo">
                  <img
                    src={user.profileImage || user.avatar || "/default-avatar.png"}
                    alt={user.name}
                    className="table-avatar"
                  />
                </td>
                <td data-label="Name">{user.name || "Unnamed User"}</td>
                <td data-label="Email">{user.email}</td>
                <td data-label="Phone">{user.phone || "—"}</td>
                <td data-label="Status">
                  <span
                    className={`status-badge ${
                      user.isSuspicious ? "suspicious" : "normal"
                    }`}
                  >
                    {user.isSuspicious ? "Suspicious" : "Normal"}
                  </span>
                </td>
                <td data-label="Actions" className="actions-cell">
                  <button
                    onClick={() =>
                      handleToggleSuspicious(user._id, user.isSuspicious)
                    }
                    className={`btn-sm ${
                      user.isSuspicious ? "btn-warning" : "btn-secondary"
                    }`}
                  >
                    {user.isSuspicious ? "Unflag" : "Flag"}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="btn-sm btn-danger"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() =>
                      (window.location.href = `/admin/users/${user._id}`)
                    }
                    className="btn-sm btn-primary"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
