import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../../../components/layout/AdminNavbar/AdminNavbar";
import "./ReturnedBooks.css";

function ReturnedBooks() {
  const [returned, setReturned] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 30;

  useEffect(() => {
    const fetchReturnedBooks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/returned");

        if (Array.isArray(res.data.returned)) {
          setReturned(res.data.returned);
        } else if (Array.isArray(res.data)) {
          setReturned(res.data);
        } else {
          console.warn("Expected array, got:", typeof res.data.returned);
          setReturned([]);
        }
      } catch (err) {
        console.error(" Error fetching returned books:", err);
        setReturned([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReturnedBooks();
  }, []);

  const filteredBooks = returned.filter((book) =>
  (book.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredBooks.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentBooks = filteredBooks.slice(startIndex, startIndex + recordsPerPage);

  return (
    <>
      <AdminNavbar setSidebarOpen={setIsSidebarOpen} />
      <div className={`returned-books-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <h2>Returned Books</h2>

        {loading ? (
          <p className="loading">Loading returned books...</p>
        ) : returned.length === 0 ? (
          <p>No returned books available.</p>
        ) : (
          <>
            {returned.length > 1 && (
              <div className="search-bar-container">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by user, title, or author..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            )}

            <table className="returned-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Book</th>
                  <th>Author</th>
                  <th>Borrow Date</th>
                  <th>Return Date</th>
                </tr>
              </thead>
              <tbody>
                {currentBooks.map((book, index) => (
                  <tr key={`${book.id}-${book.username}-${index}`}>
                    <td>{book.username ?? "Unknown"}</td>
                    <td>{book.title ?? "Untitled"}</td>
                    <td>{book.author ?? "N/A"}</td>
                    <td>{book.borrow_date ? new Date(book.borrow_date).toLocaleDateString() : "N/A"}</td>
                    <td>{book.return_date ? new Date(book.return_date).toLocaleDateString() : "---"}</td>
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

export default ReturnedBooks;
