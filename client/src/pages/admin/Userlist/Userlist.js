import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../../components/layout/AdminNavbar/AdminNavbar";
import Toast from "../../../components/common/Toast/Toast";
import "./Userlist.css";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 12;

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users");
      setUsers(res.data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
      setToast({ message: "Failed to fetch users", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setPendingDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/users/${pendingDeleteId}`);
      setToast({ message: "User deleted successfully.", type: "success" });
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      setToast({ message: "Failed to delete user.", type: "error" });
    } finally {
      setPendingDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setPendingDeleteId(null);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <>
      <AdminNavbar setSidebarOpen={setIsSidebarOpen} />

      <div className={`user-list-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <h2>Registered Users</h2>
        <div className="table-responsive">
          <table className="user-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Join Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => navigate(`/admin/users/${user.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.join_date).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(user.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length > usersPerPage && (
            <div className="pagination1">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="page-btn"
              >
                Prev
              </button>
              <span className="page-info">
                 {currentPage} of {totalPages} Pages
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "" })}
        />
      )}

      {pendingDeleteId && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-box">
            <p>Are you sure you want to delete this user?</p>
            <div className="confirm-actions">
              <button className="cancel-btn" onClick={confirmDelete}>
                Yes
              </button>
              <button className="confirm-btn" onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserList;
