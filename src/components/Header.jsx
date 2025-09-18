import { useNavigate } from "react-router-dom";
import { Bell, BoxArrowRight, List } from "react-bootstrap-icons";
import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import "../styles/Header.css";

const DISMISSED_KEY = "dismissedNotifications";

function readDismissed() {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function persistDismissed(addIds = []) {
  const cur = readDismissed();
  addIds.forEach((id) => id && cur.add(id));
  localStorage.setItem(DISMISSED_KEY, JSON.stringify([...cur]));
}

export default function Header({ toggleSidebar }) {
  const navigate = useNavigate();
  const { logout } = useContext(AdminContext);
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          "https://jobs-backend-z4z9.onrender.com/api/admin/applications?page=1&limit=10",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const apps = res.data?.applications || [];
        const dismissed = readDismissed();
        const filtered = apps.filter((n) => n && !dismissed.has(n._id));
        setNotifications(filtered);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    logout();
    navigate("/");
  };

  const clearNotifications = () => {
    persistDismissed(notifications.map((n) => n?._id).filter(Boolean));
    setNotifications([]);
  };

  return (
    <header className="topbar-header">
      <div className="d-flex justify-content-between align-items-center w-100">
        <button
          className="sidebar-toggle-btn"
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <List />
        </button>

        <div className="d-flex align-items-center gap-3 action-buttons">
          <div className="notification-wrapper">
            <button
              type="button"
              className="position-relative notif-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <Bell />
              {notifications.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill notif-badge">
                  {notifications.length}
                </span>
              )}
            </button>

            {dropdownOpen && (
              <div className="notification-dropdown shadow">
                <div className="dropdown-header d-flex justify-content-between align-items-center">
                  <span>Notifications</span>
                  <button className="btn clear-btn" onClick={clearNotifications}>
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
                  <p className="text-muted text-center p-2 m-0 no-notifs">
                    No new notifications
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className="btn btn-sm btn-logout d-flex align-items-center gap-1"
            onClick={handleLogout}
            title="Logout"
          >
            <BoxArrowRight />
            <span className="d-none d-sm-inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}