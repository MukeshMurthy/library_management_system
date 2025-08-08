import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../../../components/layout/AdminNavbar/AdminNavbar";
import "./borrowrequest.css";

function BorrowRequest() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user-borrow/request/all");
        setRequests(response.data);
      } catch (err) {
        setError("Failed to fetch borrow requests.");
        console.error("Fetch error:", err);
      }
    };
    fetchRequests();
  }, []);

  const approveRequest = async (requestId) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/approve/${requestId}`);
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (err) {
      setError("Failed to approve request.");
      console.error("Approve request error:", err);
    }
  };

  const cancelRequest = async () => {
    try {
      await axios.put(`http://localhost:5000/api/admin/cancel/${selectedRequestId}`);
      setRequests((prev) => prev.filter((req) => req.id !== selectedRequestId));
      setShowModal(false);
    } catch (err) {
      setError("Failed to cancel request.");
      console.error("Cancel request error:", err);
    }
  };

  const handleCancelClick = (requestId) => {
    setSelectedRequestId(requestId);
    setShowModal(true);
  };

  return (
    <>
      <AdminNavbar setSidebarOpen={setIsSidebarOpen} />
      <div className={`request-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <h2 className="pending">Pending Borrow Requests</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {requests.length === 0 ? (
          <p>No pending requests.</p>
        ) : (
          <div className="card-grid">
            {requests.map((req) => (
              <div className="request-card" key={req.id}>
                <h3>{req.book_title}</h3>
                <p><strong>User:</strong> {req.user_name}</p>
                <p><strong>Status:</strong> {req.status}</p>
                <div className="button-group">
                  <button className="cancel-btn" onClick={() => handleCancelClick(req.id)}>Cancel</button>
                  <button className="approve-btn" onClick={() => approveRequest(req.id)}>Approve</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Denial</h3>
            <p>Are you sure you want to deny this borrow request?</p>
            <div className="modal-buttons">
              <button className="modal-confirm" onClick={cancelRequest}>Yes, Deny</button>
              <button className="modal-cancel" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BorrowRequest;
