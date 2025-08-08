import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "../../../components/layout/AdminNavbar/AdminNavbar";
import Toast from "../../../components/common/Toast/Toast";
import "./BookDetails.css";

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [borrowers, setBorrowers] = useState([]);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    fetchBook();
    fetchBorrowers();
  }, []);

  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => {
        setToast({ message: "", type: "" });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toast.message]);

  const fetchBook = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/books/${id}`);
      setBook(res.data);
    } catch (err) {
      console.error("Error fetching book:", err);
      setToast({ message: "Failed to load book", type: "error" });
    }
  };

  const fetchBorrowers = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/borrowers/book/${id}`);
      setBorrowers(res.data);
    } catch (err) {
      console.error("Error fetching borrowers:", err);
    }
  };

  const updateCopies = async (type) => {
    try {
      const url = `http://localhost:5000/api/books/${type}/${id}`;
      await axios.patch(url);
      setToast({ message: `Book ${type}d successfully`, type: "success" });
      fetchBook();
    } catch (err) {
      setToast({ message: "Failed to update copies", type: "error" });
    }
  };

  if (!book) return <p>Loading...</p>;

  return (
    <>
      <AdminNavbar setSidebarOpen={setIsSidebarOpen} />
      <div className={`book-details-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>

        <div className="book-info-card">
          <h2>{book.title}</h2>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Category:</strong> {book.category}</p>
          <p><strong>Total Copies:</strong> {book.total_copies}</p>
          <p><strong>Available Copies:</strong> {book.available_copies}</p>
          <p><strong>Update Book Quantity</strong></p>
          <div className="copy-controls">
           <button onClick={() => updateCopies("decrease")} className="decrease-btn">-</button>
            <p> {book.total_copies}</p>
            
             <button onClick={() => updateCopies("increase")} className="increase-btn">+</button>
          </div>
        </div>

        
        <div className="borrower-card">
          <h3>Users Currently Borrowing This Book</h3>
          {borrowers.length === 0 ? (
            <p>No users currently have this book.</p>
          ) : (
            <ul>
              {borrowers.map((b) => (
                <li key={b.id}>
                  {b.username} — Borrowed on {new Date(b.borrow_date).toLocaleDateString()}
                </li>
              ))}
            </ul>
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
    </>
  );
}

export default BookDetails;
