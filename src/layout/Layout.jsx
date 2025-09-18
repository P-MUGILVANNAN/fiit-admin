import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Footer from "../components/Footer.jsx";
import "../styles/Layout.css";

export default function Layout() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 992);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth <= 992;
      setIsMobile(mobileView);
      // Automatically close sidebar on mobile, open on desktop
      setSidebarOpen(!mobileView);
    };

    window.addEventListener("resize", handleResize);
    // Initial check
    handleResize(); 
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`app-layout ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      {/* The clickable overlay for mobile view */}
      {isSidebarOpen && isMobile && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      <Sidebar 
        isOpen={isSidebarOpen} 
        isMobile={isMobile}
        toggleSidebar={toggleSidebar} 
      />
      
      <div className="main-content-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        <main className="app-main">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}