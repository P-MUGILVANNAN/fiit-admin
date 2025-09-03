// src/context/AdminContext.jsx
import { createContext, useState, useEffect } from "react";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      // optionally verify token with backend
      setAdmin({ email: "admin" }); 
    }
  }, [token]);

  const login = (tokenValue, adminData) => {
    localStorage.setItem("token", tokenValue);
    setToken(tokenValue);
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ admin, token, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};
