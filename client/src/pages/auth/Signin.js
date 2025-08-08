import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../../components/common/Toast/Toast";
import logo from "../../assets/logo.png"; 
import "./authform.css"; 

function Signin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  const navigate = useNavigate();

  const showToast = (msg, type = "error") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (value.trim() !== "") {
      setTouched((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = form;

    const newTouched = {
      email: !email.trim(),
      password: !password.trim(),
    };
    setTouched(newTouched);

    if (!email || !password) {
      return showToast("Please fill out every field before submitting.", "error");
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/signin", form);

      const { flag, message, role, username, userId } = res.data;

      if (flag) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);
        localStorage.setItem("role", role);
        localStorage.setItem("userId", userId);
        localStorage.setItem("showGreet", "true");

        showToast(message || "Signin successful!", "success");

        setTimeout(() => {
          if (role === "admin") {
            navigate("/admin");
          } else {
            navigate("/user");
          }
        }, 1500);
      } else {
        showToast("Signin failed.", "error");
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Signin failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="left-half">
        <h1 className="welcome-title glitter-text">Welcome Back!</h1>
        <p className="welcome-message">

        </p>
        <img src={logo} alt="Logo" className="signin-logo" />
      </div>


      <div className="right-half">
        <div className="signup-container">
          <h2>SignIn</h2>
          <form className="signup-form" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className={touched.email ? "input-error" : ""}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={touched.password ? "input-error" : ""}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="welcome-text">
            New user? <Link to="/signup">Create an account</Link>
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

export default Signin;
