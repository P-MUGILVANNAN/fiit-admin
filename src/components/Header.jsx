// src/components/Header.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HouseDoor,
  People,
  Briefcase,
  PlusCircle,
  Inbox,
  Bell,
  BoxArrowRight,
} from "react-bootstrap-icons";
import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import "../styles/Header.css";
import Logo from "../assets/Logo.png";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AdminContext);

  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <HouseDoor /> },
    { path: "/users", label: "Users", icon: <People /> },
    { path: "/jobs", label: "Jobs", icon: <Briefcase /> },
    { path: "/jobs/add", label: "Add Job", icon: <PlusCircle /> },
    { path: "/applications", label: "Applications", icon: <Inbox /> },
  ];

  // Fetch latest applications for notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          "https://jobs-backend-z4z9.onrender.com/api/applications?limit=5&sort=desc"
        );
        if (res.data?.applications) {
          setNotifications(res.data.applications);
        }
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchNotifications();

    // Poll every 20 seconds
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const nav = document.getElementById("mainNav");
    if (nav && nav.classList.contains("show")) {
      nav.classList.remove("show");
    }

    logout();
    navigate("/");
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <nav className="header-navbar navbar navbar-expand-lg sticky-top shadow-sm">
      <div className="container-fluid">
        {/* Brand */}
        <Link
          className="navbar-brand d-flex align-items-center gap-2"
          to="/dashboard"
        >
          <img src={Logo} alt="Logo" className="brand-logo" />
          <span className="fw-bold company-name">FIIT JOBS</span>
        </Link>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler custom-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="toggler-icon">☰</span>
        </button>

        {/* Collapsible nav */}
        <div className="collapse navbar-collapse" id="mainNav">
          {/* Center links */}
          <ul className="navbar-nav mx-auto gap-lg-2 text-center">
            {menuItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link d-flex align-items-center gap-1 ${
                    location.pathname === item.path ? "active" : ""
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side actions */}
          <div className="d-flex align-items-center gap-3 action-buttons position-relative">
            {/* Notification Dropdown */}
            <div className="notification-wrapper">
              <button
                type="button"
                className="btn btn-sm btn-outline-light position-relative"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <Bell />
                {notifications.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {notifications.length}
                  </span>
                )}
              </button>

              {dropdownOpen && (
                <div className="notification-dropdown shadow">
                  <div className="dropdown-header d-flex justify-content-between align-items-center">
                    <span>Notifications</span>
                    <button
                      className="btn btn-link btn-sm text-danger"
                      onClick={clearNotifications}
                    >
                      Clear All
                    </button>
                  </div>
                  {notifications.length > 0 ? (
                    <ul className="list-unstyled m-0 p-0">
                      {notifications.map((n) => (
                        <li key={n._id} className="notification-item">
                          <strong>{n.applicant?.name || "User"}</strong> applied
                          for <em>{n.job?.title || "a job"}</em>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted text-center p-2">
                      No notifications
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              type="button"
              className="btn btn-sm btn-logout d-flex align-items-center gap-1"
              onClick={handleLogout}
              title="Logout"
            >
              <BoxArrowRight className="me-1" /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
