import { Link, useLocation } from "react-router-dom";
import {
  HouseDoor,
  People,
  Briefcase,
  PlusCircle,
  Inbox,
  Bell,
  PersonCircle,
  BoxArrowRight,
} from "react-bootstrap-icons";
import "../styles/Header.css";

export default function Header({ onLogout }) {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <HouseDoor /> },
    { path: "/users", label: "Users", icon: <People /> },
    { path: "/jobs", label: "Jobs", icon: <Briefcase /> },
    { path: "/jobs/add", label: "Add Job", icon: <PlusCircle /> },
    { path: "/applications", label: "Applications", icon: <Inbox /> },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 shadow-sm sticky-top">
      {/* Brand */}
      <Link className="navbar-brand d-flex align-items-center gap-2" to="/dashboard">
        <span className="brand-logo">⚡</span>
        <span className="fw-bold">Admin Panel</span>
      </Link>

      {/* Mobile toggle */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNav"
        aria-controls="mainNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Collapsible nav */}
      <div className="collapse navbar-collapse" id="mainNav">
        {/* Center links */}
        <ul className="navbar-nav mx-auto">
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
        <div className="d-flex align-items-center gap-3">
          {/* Search (hidden on mobile) */}
          <form className="d-none d-md-block">
            <input
              type="search"
              className="form-control form-control-sm"
              placeholder="Search…"
            />
          </form>

          {/* Notification */}
          <button className="btn btn-sm btn-outline-light position-relative">
            <Bell />
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              3
            </span>
          </button>

          {/* User dropdown */}
          <div className="dropdown">
            <button
              className="btn btn-sm btn-outline-light d-flex align-items-center gap-1 dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <PersonCircle />
              <span className="d-none d-md-inline">Admin</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <Link className="dropdown-item" to="/profile">
                  Profile
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/settings">
                  Settings
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button className="dropdown-item text-danger" onClick={onLogout}>
                  <BoxArrowRight className="me-2" /> Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
