import { Link, useLocation } from "react-router-dom";
import { HouseDoor, People, Briefcase, PlusCircle, Inbox, X } from "react-bootstrap-icons";
import Logo from "../assets/Logo.png";
import "../styles/Sidebar.css";

export default function Sidebar({ isOpen, isMobile, toggleSidebar }) {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <HouseDoor /> },
    { path: "/users", label: "Users", icon: <People /> },
    { path: "/jobs", label: "Jobs", icon: <Briefcase /> },
    { path: "/jobs/add", label: "Add Job", icon: <PlusCircle /> },
    { path: "/applications", label: "Applications", icon: <Inbox /> },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <img src={Logo} alt="Logo" className="sidebar-logo" />
        {/* New: Close button visible only on mobile when sidebar is open */}
        {isMobile && isOpen && (
          <button className="sidebar-close-btn" onClick={toggleSidebar}>
            <X />
          </button>
        )}
      </div>
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
                title={item.label}
                onClick={isMobile ? toggleSidebar : undefined} // Auto-close on nav click on mobile
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}