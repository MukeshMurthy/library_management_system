import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ReturnBooks.css";
import UserNavbar from "../../../components/layout/UserNavbar/UserNavbar";
import Toast from "../../../components/common/Toast/Toast";

function ReturnBook() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const booksPerPage = 4;
  const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  useEffect(() => {
    const filtered = borrowedBooks.filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
    setCurrentPage(1); 
  }, [searchTerm, borrowedBooks]);

  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => {
        setToast({ message: "", type: "" });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [toast.message]);

  const fetchBorrowedBooks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/return/${userId}`);
      setBorrowedBooks(res.data);
      setFilteredBooks(res.data);
    } catch (err) {
      console.error("Error fetching borrowed books", err);
    } finally {
      setLoading(false);
    }
  };

  const returnBook = async (bookId) => {
    try {
      await axios.post("http://localhost:5000/api/return", {
        userId,
        bookId,
      });
      setToast({ message: "Book returned successfully!", type: "success" });
      fetchBorrowedBooks(); 
    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Failed to return the book.",
        type: "error",
      });
    }
  };

  
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + booksPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <UserNavbar setSidebarOpen={setIsSidebarOpen} />
      <div className={`return-books-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <h2 className="return-books-title">Books You've Borrowed</h2>
        <input
          type="text"
          placeholder="Search by book title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        {loading ? (
          <p>Loading...</p>
        ) : filteredBooks.length === 0 ? (
          <p>You have no borrowed books to return.</p>
        ) : (
          <>
            <div className="return-book-list">
              {paginatedBooks.map((book) => (
                <div key={book.id} className="return-book-card">
                  <h4>{book.title}</h4>
                  <p><strong>Author:</strong> {book.author}</p>
                  <button onClick={() => returnBook(book.id)}>Return</button>
                </div>
              ))}
            </div>

        
            {totalPages > 1 && (
              <div className="pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                  Prev
                </button>
                <span>{`Page ${currentPage} of ${totalPages}`}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "" })}
        />
      )}
    </>
  );
}

export default ReturnBook;
