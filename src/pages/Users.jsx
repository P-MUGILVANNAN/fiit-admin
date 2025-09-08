// src/pages/Users.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/User.css";

const API_BASE = "https://jobs-backend-z4z9.onrender.com/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.users || []);
        setFilteredUsers(res.data.users || []);
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

  // 🔍 Search handler
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(
          (u) =>
            u.name?.toLowerCase().includes(query) ||
            u.email?.toLowerCase().includes(query) ||
            u.phone?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, users]);

  // Delete user with confirm()
  const handleDeleteUser = async (userId, userName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete user "${userName}"?`
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      alert(`User "${userName}" deleted successfully ✅`);
    } catch (err) {
      console.error("Error deleting user:", err);
      alert(`❌ Failed to delete user "${userName}"`);
    }
  };

  // Toggle suspicious status with confirm()
  const handleToggleSuspicious = async (userId, currentStatus, userName) => {
    const confirmToggle = window.confirm(
      `Mark user "${userName}" as ${currentStatus ? "Normal" : "Suspicious"}?`
    );
    if (!confirmToggle) return;

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

      alert(
        `User "${userName}" marked as ${
          !currentStatus ? "Suspicious 🚨" : "Normal ✅"
        }`
      );
    } catch (err) {
      console.error("Error toggling suspicious status:", err);
      alert(`❌ Failed to update user "${userName}" status`);
    }
  };

  if (loading)
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="user-list-container">
      <div className="user-header">
        <h1>👥 User Management</h1>
        <input
          type="text"
          className="search-bar"
          placeholder="🔍 Search by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

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
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className={`${user.isSuspicious ? "suspicious-row" : ""} ${
                    index % 2 === 0 ? "striped-row" : ""
                  }`}
                >
                  <td>
                    <img
                      src={user.profileImage || user.avatar || "/default-avatar.png"}
                      alt={user.name}
                      className="table-avatar"
                    />
                  </td>
                  <td>{user.name || "Unnamed User"}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || "—"}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        user.isSuspicious ? "suspicious" : "normal"
                      }`}
                    >
                      {user.isSuspicious ? "Suspicious" : "Normal"}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      onClick={() =>
                        handleToggleSuspicious(
                          user._id,
                          user.isSuspicious,
                          user.name
                        )
                      }
                      className={`btn-sm ${
                        user.isSuspicious ? "btn-warning" : "btn-secondary"
                      }`}
                    >
                      {user.isSuspicious ? "Unflag" : "Flag"}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id, user.name)}
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
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "2rem" }}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
