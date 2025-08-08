import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "../../../components/layout/AdminNavbar/AdminNavbar";
import userDefaultImage from "../../../assets/user.png";
import "./UserDetail.css";

function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/users/${id}`);
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching user details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  // if (loading) return <p className="loading">Loading user details...</p>;
  if (!user) return <p className="loading">User not found.</p>;

  return (
    <>
      <AdminNavbar setSidebarOpen={setIsSidebarOpen} />
      <div className={`user-card-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <div className="user-card">
          <img src={userDefaultImage} alt="Profile" />
          <h2>{user.username}</h2>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Joined:</strong> {new Date(user.join_date).toLocaleDateString()}</p>
          <button onClick={() => navigate("/admin/users")} className="back-btn">
            Back
          </button>
        </div>
      </div>
    </>
  );
}

export default UserDetail;
