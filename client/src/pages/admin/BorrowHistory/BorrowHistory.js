import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../../../components/layout/AdminNavbar/AdminNavbar";
import "./BorrowHistory.css";

function BorrowHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 30;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/borrow/history");
        setHistory(res.data.history || []);
      } catch (err) {
        console.error("Error fetching borrow history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredHistory = history.filter((item) =>
    item.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredHistory.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentItems = filteredHistory.slice(startIndex, startIndex + recordsPerPage);

  return (
    <>
      <AdminNavbar setSidebarOpen={setIsSidebarOpen} />
      <div className={`borrow-history-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <h2>Borrow History</h2>
        {history.length >= 2 && (
          <div className="search-bar-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search by username, title, or author..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        )}

        {loading ? (
          <p className="borrow-loading">Loading history...</p>
        ) : currentItems.length === 0 ? (
          <p>No matching records found.</p>
        ) : (
          <>
            <table className="borrow-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Book</th>
                  <th>Author</th>
                  <th>Borrowed</th>
                  <th>Due</th>
                  <th>Returned</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={`${item.id}-${index}`}>
                    <td>{item.username}</td>
                    <td>{item.title}</td>
                    <td>{item.author}</td>
                    <td>{new Date(item.borrow_date).toLocaleDateString()}</td>
                    <td>{new Date(item.due_date).toLocaleDateString()}</td>
                    <td className={!item.return_date ? "centered-placeholder" : ""}>
                      {item.return_date ? new Date(item.return_date).toLocaleDateString() : "---"}
                    </td>

                    <td>{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            
            {totalPages > 1 && (
              <div className="pagination-controls">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>

                <span className="pagination-info">
                  {currentPage} of {totalPages} Pages
                </span>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default BorrowHistory;
