import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserBorrowHistory.css";
import UserNavbar from "../../../components/layout/UserNavbar/UserNavbar";

function UserBorrowHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/history/${userId}`);
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(history.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleRecords = history.slice(startIndex, startIndex + itemsPerPage);

  

  return (
    <>
      <UserNavbar setSidebarOpen={setIsSidebarOpen} />
      <div className={`available-books ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <h2>Your Borrow & Return History</h2>

        {visibleRecords.length === 0 ? (
          <p>You haven’t borrowed any books yet.</p>
        ) : (
          <div className="book-list">
            {visibleRecords.map((record, index) => (
              <div key={index} className="book-card">
                <h4>{record.title}</h4>
                <p><strong>Author:</strong> {record.author}</p>
                <p><strong>Borrowed On:</strong> {new Date(record.borrow_date).toLocaleDateString()}</p>
                <p><strong>Due Date:</strong> {new Date(record.due_date).toLocaleDateString()}</p>
                <p><strong>Returned On:</strong> {record.return_date ? new Date(record.return_date).toLocaleDateString() : "Not returned yet"}</p>
                <p><strong>Status:</strong> {record.status}</p>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span> {currentPage} of {totalPages} Pages</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default UserBorrowHistory;
