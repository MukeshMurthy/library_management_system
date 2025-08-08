import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../../components/common/Toast/Toast";
import "./authform.css";
import logo from "../../assets/logo.png"; 

function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    adminSecret: ""
  });

  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
    adminSecret: false
  });

  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  const navigate = useNavigate();

  const showToast = (msg, type = "error") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (value.trim() !== "") {
      setTouched((prev) => ({ ...prev, [name]: false }));
    }
  };

  const validatePasswordRules = (password) => ({
    length: password.length >= 8,
    number: /[0-9]/.test(password),
    uppercase: /[A-Z]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword, role, adminSecret } = form;
    const rules = validatePasswordRules(password);

    const newTouched = {
      username: !username.trim(),
      email: !email.trim(),
      password: !password.trim(),
      confirmPassword: !confirmPassword.trim(),
      adminSecret: role === "admin" && !adminSecret.trim()
    };
    setTouched(newTouched);

    if (!username || !email || !password || !confirmPassword || (role === "admin" && !adminSecret)) {
      return showToast("All required fields must be filled.", "error");
    }

    if (password !== confirmPassword) {
      return showToast("Passwords do not match.", "error");
    }

    if (!Object.values(rules).every(Boolean)) {
      return showToast("Password does not meet the requirements.", "error");
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/signup", {
        username,
        email,
        password,
        role,
        adminSecret
      });

      setForm({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
        adminSecret: ""
      });

      setTouched({ username: false, email: false, password: false, confirmPassword: false, adminSecret: false });

      showToast("Signup completed... redirecting to sign in page", "success");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      showToast(err.response?.data?.message || "Signup failed.", "error");
      setLoading(false);
    }
  };

  const passwordRules = validatePasswordRules(form.password);

  return (
    <div className="page-container">
      <div className="left-half">
        <h1 className="welcome-title glitter-text">Welcome</h1>
        <p className="welcome-message">
          Please sign up to create a new account.
        </p>
        <img src={logo} alt="Library Logo" className="signin-logo" />
      </div>


      <div className="right-half">
        <div className="signup-container">
          <h2>SignUp</h2>
          <form className="signup-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className={touched.username ? "input-error" : ""}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className={touched.email ? "input-error" : ""}
            />
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            {form.role === "admin" && (
              <input
                type="password"
                name="adminSecret"
                placeholder="Enter existing Admin password"
                value={form.adminSecret}
                onChange={handleChange}
                className={touched.adminSecret ? "input-error" : ""}
              />
            )}

            <div className="password-field">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                className={touched.password ? "input-error" : ""}
              />
              {passwordFocused && (
                <div className="password-rules-right">
                  <p className={passwordRules.length ? "valid" : "invalid"}>At least 8 characters</p>
                  <p className={passwordRules.number ? "valid" : "invalid"}>At least one number</p>
                  <p className={passwordRules.uppercase ? "valid" : "invalid"}>At least one uppercase</p>
                  <p className={passwordRules.special ? "valid" : "invalid"}>At least one special</p>
                </div>
              )}
            </div>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className={touched.confirmPassword ? "input-error" : ""}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
          <p className="welcome-text">
            Existing user? <Link to="/">Signin</Link>
          </p>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "" })}
      />
    </div>
  );
}

export default Signup;
