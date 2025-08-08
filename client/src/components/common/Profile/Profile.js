import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../../layout/AdminNavbar/AdminNavbar";
import UserNavbar from "../../layout/UserNavbar/UserNavbar";
import userDefaultImage from "../../../assets/user.png";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/profile/${userId}`);
        setProfile(res.data.profile);
      } catch (err) {
        console.error(" Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const handleBack = () => {
    if (role === "admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/user/available";
    }
  };

  if (!profile) return <p className="loading">No profile found.</p>;

  return (
    <>
      {role === "admin" ? (
        <AdminNavbar setSidebarOpen={setIsSidebarOpen} />
      ) : (
        <UserNavbar setSidebarOpen={setIsSidebarOpen} />
      )}

      <div className={`profile-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <h2>{role === "admin" ? "Admin" : "User"} Profile</h2>
        <div className="profile-card">
          <div className="image-container">
            <img src={userDefaultImage} alt="Profile" className="profile-image" />
          </div>
          <p><strong>Name:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Joined:</strong> {new Date(profile.join_date).toLocaleDateString()}</p>

          {role === "user" && (
            <>
              <h4>Borrowed Books:</h4>
              <ul>
                {profile.borrowedBooks?.length > 0 ? (
                  profile.borrowedBooks.map((book, i) => (
                    <li key={i}>
                      {book.title} by {book.author} — Status: {book.status}
                    </li>
                  ))
                ) : (
                  <li>No borrowed books.</li>
                )}
              </ul>
            </>
          )}
        </div>

        <button onClick={handleBack} className="back-btn">Back</button>
      </div>
    </>
  );
}

export default Profile;
