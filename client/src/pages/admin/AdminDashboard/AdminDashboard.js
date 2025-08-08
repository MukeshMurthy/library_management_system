import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../../components/layout/AdminNavbar/AdminNavbar";
import Toast from "../../../components/common/Toast/Toast";
import AddBookModal from "../AddBook/AddBook";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [pendingArchiveId, setPendingArchiveId] = useState(null); 
  const [showAddPopup, setShowAddPopup] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [viewArchived, setViewArchived] = useState(false);
  const recordsPerPage = 19;

  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  useEffect(() => {
    fetchBooks();
    const greetOnce = localStorage.getItem("showGreet");
    if (greetOnce === "true" && username) {
      setToast({ message: `Welcome back, ${username}!`, type: "success" });
      setTimeout(() => setToast({ message: "", type: "" }), 2000);
      localStorage.removeItem("showGreet");
    }
  }, [viewArchived]);

  const fetchBooks = async () => {
    try {
      const url = viewArchived
        ? "http://localhost:5000/api/books/archived"
        : "http://localhost:5000/api/books/available";
      const res = await axios.get(url);
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching books:", err);
      setBooks([]);
    }
  };

 const archiveBook = async () => {
  try {
    await axios.patch(`http://localhost:5000/api/books/archive/${pendingArchiveId}`);
    setToast({ message: "Book archived ", type: "success" });

    const updatedBooks = books.filter(book => book.id !== pendingArchiveId);
    const filtered = updatedBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const newTotalPages = Math.ceil(filtered.length / recordsPerPage);
    const newPage = currentPage > newTotalPages ? newTotalPages : currentPage;

    setCurrentPage(newPage || 1);
    fetchBooks();
  } catch (err) {
    console.error("Error archiving book:", err);
    setToast({ message: "Failed to archive book", type: "error" });
  } finally {
    setPendingArchiveId(null);
    setTimeout(() => setToast({ message: "", type: "" }), 1500);
  }
};


  const deleteBookPermanently = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/books/${pendingDeleteId}`);
      setToast({ message: "Book permanently deleted", type: "success" });
      fetchBooks();
    } catch (err) {
      console.error("Error deleting book", err);
      setToast({ message: "Failed to delete book", type: "error" });
    } finally {
      setPendingDeleteId(null);
      setTimeout(() => setToast({ message: "", type: "" }), 1500);
    }
  };

  const unarchiveBook = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/books/unarchive/${id}`);
      setToast({ message: "Book unarchived ", type: "success" });
      fetchBooks();
    } catch (err) {
      console.error("Error unarchiving book", err);
      setToast({ message: "Failed to unarchive book", type: "error" });
    } finally {
      setTimeout(() => setToast({ message: "", type: "" }), 1500);
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBooks.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentBooks = filteredBooks.slice(startIndex, startIndex + recordsPerPage);

  return (
    <div>
      <AdminNavbar setSidebarOpen={setIsSidebarOpen} />
      <div className={`admin-dashboard-content ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <div className="dashboard-header">
          <h2>{viewArchived ? "Archived Books" : "Available Books"}</h2>
          <button
            className="archive-toggle-btn"
            onClick={() => setViewArchived((prev) => !prev)}
          >
            {viewArchived ? "Back to Available Books" : "View Archived Books"}
          </button>
        </div>

        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search by title, author, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {currentBooks.length === 0 ? (
          <p>No matching books found.</p>
        ) : (
          <div className="book-list">
            {!viewArchived && (
              <div className="add-book-card" onClick={() => setShowAddPopup(true)}>
                <span className="plus-icon">+</span>
                <p>Add Book</p>
              </div>
            )}

            {currentBooks.map((book) => (
              <div
                key={book.id}
                className="book-card"
                onClick={() => navigate(`/admin/book/${book.id}`)}
                style={{ cursor: "pointer" }}
              >
                <h4>{book.title}</h4>
                <p>Author: {book.author}</p>
                <p>Category: {book.category}</p>
                <p>Available: {book.available_copies}</p>

                {viewArchived ? (
                  <div className="archived-actions" onClick={(e) => e.stopPropagation()}>
                    <button className="unarchive-btn" onClick={() => unarchiveBook(book.id)}>
                      Unarchive
                    </button>
                    <button className="delete1-btn" onClick={() => setPendingDeleteId(book.id)}>
                      Delete 
                    </button>
                  </div>
                ) : (
                  <button
                    className="arch-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPendingArchiveId(book.id);
                    }}
                  >
                    Archive Book
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination-controls">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
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
              <p>Delete this book permanently?</p>
              <div className="confirm-actions">
                <button className="confirm-btn" onClick={deleteBookPermanently}>
                   Delete
                </button>
                <button className="cancel-btn" onClick={() => setPendingDeleteId(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        
        {pendingArchiveId && (
          <div className="delete-confirm-overlay">
            <div className="delete-confirm-box">
              <p>Archive this book?</p>
              <div className="confirm-actions">
                <button className="confirm-btn" onClick={archiveBook}>
                  Yes
                </button>
                <button className="cancel-btn" onClick={() => setPendingArchiveId(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        
        {showAddPopup && (
          <AddBookModal
            onClose={() => setShowAddPopup(false)}
            onBookAdded={fetchBooks}
          />
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
