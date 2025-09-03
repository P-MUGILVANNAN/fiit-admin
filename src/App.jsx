import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AdminProvider } from "./context/AdminContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// Users
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";

// Jobs
import Jobs from "./pages/Jobs";
import AddJob from "./pages/AddJob";
import EditJob from "./pages/EditJob"
import JobDetails from "./pages/JobDetails";

import Layout from "./layout/Layout";
import Applications from "./pages/Applications";  

function App() {
  return (
    <AdminProvider>
      <Router>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Admin routes wrapped in Layout */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Users */}
            <Route path="/users" element={<Users />} />
            <Route path="/admin/users/:id" element={<UserDetails />} />

            {/* Jobs */}
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/add" element={<AddJob />} />
            <Route path="/admin/jobs/edit/:id" element={<EditJob />} />
            <Route path="/admin/jobs/:id" element={<JobDetails />} /> 

            {/* 🔹 Applications management route */}
            <Route path="/applications" element={<Applications />} /> 
          </Route>
        </Routes>
      </Router>
    </AdminProvider>
  );
}

export default App;
