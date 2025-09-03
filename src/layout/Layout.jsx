import React from "react";
import { Outlet } from "react-router-dom"; // ✅ important
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import "../styles/Layout.css";

/**
 * Layout
 * Wrap your pages with this component.
 * React Router v6 renders child routes via <Outlet />
 */
export default function Layout() {
  return (
    <div className="app-layout">
      {/* Top Navbar / Header */}
      <Header />

      {/* Main content */}
      <main className="app-main container">
        <Outlet /> {/* ← This renders the child route, e.g., Dashboard */}
      </main>

      {/* Sticky Footer */}
      <Footer />
    </div>
  );
}
