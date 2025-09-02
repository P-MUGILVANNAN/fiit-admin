import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import "../styles/Login.css";
import Logo from "../assets/Logo.png";
import { motion, AnimatePresence } from "framer-motion";

// Real-time emoji reactions
const reactions = {
  initial: "👋",
  thinking: "🤔",
  typingEmail: "✉️",
  typingPassword: "🔒",
  validating: "🔍",
  success: "🎉",
  error: "😢",
  empty: "👀",
  ready: "😎"
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emoji, setEmoji] = useState(reactions.initial);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const { login } = useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) setEmoji(reactions.validating);
    else if (success) setEmoji(reactions.success);
    else if (error) setEmoji(reactions.error);
    else if (isFocused.email && !email) setEmoji(reactions.typingEmail);
    else if (isFocused.password && !password) setEmoji(reactions.typingPassword);
    else if (email && password) setEmoji(reactions.ready);
    else if (!email && !password) setEmoji(reactions.initial);
    else setEmoji(reactions.empty);
  }, [email, password, loading, error, success, isFocused]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(
        "https://jobs-backend-z4z9.onrender.com/api/auth/login",
        { email, password }
      );

      if (response.data?.token) {
        login(response.data.token, { email });
        setSuccess(true);
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setError("Invalid login response");
      }
    } catch {
      setError("Invalid credentials or server error");
    } finally {
      setLoading(false);
    }
  };

  const emojiVariants = {
    idle: { scale: 1, rotate: 0 },
    bounce: { scale: [1, 1.4, 1], rotate: [0, 20, -20, 0] },
    shake: { rotate: [0, 15, -15, 10, -10, 0] }
  };

  return (
    <div className="login-container">
      {/* Motion wrapper for card */}
      <motion.div
        className="login-card"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        {/* Logo */}
        <motion.div
          className="logo-container"
          whileHover={{ rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img src={Logo} alt="Logo" className="login-logo" />
        </motion.div>

        {/* Panel title */}
        <motion.h2
          className="panel-title"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Admin Panel
        </motion.h2>

        {/* Emoji display */}
        <motion.div
          className="emoji-display"
          key={emoji}
          variants={emojiVariants}
          animate={error ? "shake" : success ? "bounce" : "idle"}
          transition={{ duration: 0.8 }}
        >
          {emoji}
        </motion.div>

        <motion.p
          className="welcome-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Welcome back! Please login to your account.
        </motion.p>

        {/* Error alert */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              className="alert alert-danger"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              key="error"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login form */}
        <form onSubmit={handleSubmit}>
          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label>Email</label>
            <div className="input-container">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused({ ...isFocused, email: true })}
                onBlur={() => setIsFocused({ ...isFocused, email: false })}
                placeholder="Enter your email"
                disabled={loading}
                required
              />
              <span className="input-icon">✉️</span>
            </div>
          </motion.div>

          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label>Password</label>
            <div className="input-container">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsFocused({ ...isFocused, password: true })}
                onBlur={() => setIsFocused({ ...isFocused, password: false })}
                placeholder="Enter your password"
                disabled={loading}
                required
              />
              <span className="input-icon">🔒</span>
            </div>
          </motion.div>

          <motion.button
            type="submit"
            className="btn-login"
            disabled={loading || !email || !password}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {loading ? (
              <>
                <span className="spinner"></span> Logging in...
              </>
            ) : (
              "Login"
            )}
          </motion.button>
        </form>

        {/* Success Toast */}
        <AnimatePresence>
          {success && (
            <motion.div
              className="success-toast"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
            >
              <span className="toast-icon">✅</span>
              Successfully Logged In
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default Login;
