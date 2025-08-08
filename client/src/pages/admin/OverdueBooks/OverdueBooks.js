import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../../../components/layout/AdminNavbar/AdminNavbar";
import "./OverdueBooks.css";

function OverdueBooks() {
  const [overdue, setOverdue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOverdueBooks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/overdue");
        if (Array.isArray(res.data.overdue)) {
          setOverdue(res.data.overdue);
        } else if (Array.isArray(res.data)) {
          setOverdue(res.data);
        } else {
          console.warn("Unexpected data structure:", res.data);
        }
      } catch (err) {
        console.error(" Error fetching overdue books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverdueBooks();
  }, []);

  const filteredBooks = overdue.filter((book) =>
    `${book.username} ${book.title} ${book.author}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <AdminNavbar setSidebarOpen={setIsSidebarOpen} />
      <div className={`overdue-books-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <h2>Overdue Books</h2>
        {overdue.length >= 2 && (
          <div className="search-bar-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search by user, book, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}



        {loading ? (
          <p className="loading">Loading overdue books...</p>
        ) : filteredBooks.length === 0 ? (
          <p>No matching overdue books found.</p>
        ) : (
          <table className="overdue-table">
            <thead>
              <tr>
              
                <th>User</th>
                <th>Book</th>
                <th>Author</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.id}>
                  
                  <td>{book.username}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{new Date(book.borrow_date).toLocaleDateString()}</td>
                  <td>{new Date(book.due_date).toLocaleDateString()}</td>
                  <td>{book.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default OverdueBooks;
