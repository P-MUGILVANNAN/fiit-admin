// src/pages/Users.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/User.css";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://jobs-backend-z4z9.onrender.com/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const navigate = useNavigate();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Extract unique categories from users
  const categories = [...new Set(users.map(user => user.category).filter(Boolean))];

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

  // 🔍 Search and category filter handler
  useEffect(() => {
    let filtered = users;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name?.toLowerCase().includes(query) ||
          u.email?.toLowerCase().includes(query) ||
          u.phone?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter((u) => u.category === categoryFilter);
    }

    setFilteredUsers(filtered);
  }, [searchQuery, categoryFilter, users]);

  // Format category display
  const formatCategory = (category) => {
    if (!category) return "—";
    
    // Convert camelCase or snake_case to Title Case with spaces
    return category
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim();
  };

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

  // Mobile User Card Component
  const MobileUserCard = ({ user, index }) => (
    <div className={`mobile-user-card ${user.isSuspicious ? "suspicious-card" : ""}`}>
      <div className="mobile-card-header">
        <img
          src={user.profileImage || user.avatar || "/default-avatar.png"}
          alt={user.name}
          className="mobile-user-avatar"
        />
        <div className="mobile-user-info">
          <h3 className="mobile-user-name">{user.name || "Unnamed User"}</h3>
          <p className="mobile-user-email">{user.email}</p>
        </div>
      </div>
      
      <div className="mobile-card-details">
        <div className="detail-row">
          <span className="detail-label">Phone:</span>
          <span className="detail-value">{user.phone || "—"}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Category:</span>
          <span className={`category-badge ${user.category ? 'has-category' : 'no-category'}`}>
            {formatCategory(user.category)}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Status:</span>
          <span className={`status-badge ${user.isSuspicious ? "suspicious" : "normal"}`}>
            {user.isSuspicious ? "Suspicious" : "Normal"}
          </span>
        </div>
      </div>
      
      <div className="mobile-card-actions">
        <button
          onClick={() =>
            handleToggleSuspicious(
              user._id,
              user.isSuspicious,
              user.name
            )
          }
          className={`mobile-action-btn ${user.isSuspicious ? "warning" : "secondary"}`}
        >
          {user.isSuspicious ? "Unflag" : "Flag"}
        </button>
        <button
          onClick={() => handleDeleteUser(user._id, user.name)}
          className="mobile-action-btn danger"
        >
          Delete
        </button>
        <button
          onClick={() => navigate(`/admin/users/${user._id}`)}
          className="mobile-action-btn primary"
        >
          View
        </button>
      </div>
    </div>
  );

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
        
        <div className="filters-container">
          <input
            type="text"
            className="search-bar"
            placeholder="🔍 Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <select
            className="category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {formatCategory(category)}
              </option>
            ))}
          </select>

          {categoryFilter && (
            <button
              className="clear-filter-btn"
              onClick={() => setCategoryFilter("")}
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {isMobile ? (
        // Mobile View - Cards
        <div className="mobile-users-grid">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <MobileUserCard key={user._id} user={user} index={index} />
            ))
          ) : (
            <div className="no-users-message">
              {searchQuery || categoryFilter ? "No users match your filters." : "No users found."}
            </div>
          )}
        </div>
      ) : (
        // Desktop View - Table
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Category</th>
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
                      <span className={`category-badge ${user.category ? 'has-category' : 'no-category'}`}>
                        {formatCategory(user.category)}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          user.isSuspicious ? "suspicious" : "normal"
                        }`}
                      >
                        {user.isSuspicious ? "Suspicious" : "Normal"}
                      </span>
                    </td>
                    <td className="actions-cell mt-2">
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
                          navigate(`/admin/users/${user._id}`)
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
                  <td colSpan="7" style={{ textAlign: "center", padding: "2rem" }}>
                    {searchQuery || categoryFilter ? "No users match your filters." : "No users found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}