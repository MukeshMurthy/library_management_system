import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AvailableBooks.css";
import UserNavbar from "../../../components/layout/UserNavbar/UserNavbar";
import Toast from "../../../components/common/Toast/Toast";
import info from "../../../assets/info-sign.png"

function AvailableBooks() {
  const [availableBooks, setAvailableBooks] = useState([]);
  const [requestedBooks, setRequestedBooks] = useState([]);
  const [activeBorrowCount, setActiveBorrowCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "" });

  const [showModal, setShowModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBookDetails, setSelectedBookDetails] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 20;

  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const [showMessage, setShowMessage] = useState(false);

  const toggleMessage = () => {
    setShowMessage(prev => !prev);
  };

  useEffect(() => {
    fetchAvailableBooks();
    fetchActiveBorrowCount();
    fetchRequestedBooks();

    const greetOnce = localStorage.getItem("showGreet");
    if (username && greetOnce === "true") {
      setToast({ message: `Hi, ${username}!`, type: "success" });
      setTimeout(() => setToast({ message: "", type: "" }), 2000);
      localStorage.removeItem("showGreet");
    }
  }, []);

  const fetchAvailableBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/books/available");
      setAvailableBooks(res.data);
    } catch (err) {
      console.error("Failed to fetch available books", err);
    }
  };

  const fetchActiveBorrowCount = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/user-borrow/request/user/${userId}`
      );
      const borrowCount = res.data.filter(
        (r) =>
          r.status === "pending" ||
          r.status === "approved" ||
          r.status === "borrowed"
      ).length;
      setActiveBorrowCount(borrowCount);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch active borrow count", err);
      setLoading(false);
    }
  };

  const fetchRequestedBooks = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/user-borrow/request/user/${userId}`
      );
      const requestedIds = res.data
        .filter(
          (r) =>
            r.status === "pending" ||
            r.status === "approved" ||
            r.status === "borrowed"
        )
        .map((r) => r.book_id);
      setRequestedBooks(requestedIds);
    } catch (err) {
      console.error("Failed to fetch request data", err);
    }
  };

  const handleRequestClick = (e, bookId) => {
    e.stopPropagation();
    setSelectedBookId(bookId);
    setShowModal(true);
  };

  const handleCardClick = (book) => {
    setSelectedBookDetails(book);
    setShowDetailModal(true);
  };

  const requestBorrowBook = async () => {
    if (activeBorrowCount >= 3) {
      setToast({
        message:
          "You already have 3 active borrow requests or books issued. Return at least one before requesting again.",
        type: "error",
      });
      setShowModal(false);
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/user-borrow/request", {
        user_id: userId,
        book_id: selectedBookId,
      });

      await fetchActiveBorrowCount();
      await fetchRequestedBooks();

      setToast({ message: "Borrow request sent to admin!", type: "success" });
      setShowModal(false);
    } catch (err) {
      setToast({
        message: err.response?.data?.error || "Request failed",
        type: "error",
      });
      setShowModal(false);
    }
  };

  const handleCancelClick = async (e, bookId) => {
    e.stopPropagation();

    try {
      const res = await axios.get(
        `http://localhost:5000/api/user-borrow/request/user/${userId}`
      );

      const requestToCancel = res.data.find(
        (r) => r.book_id === bookId && r.status === "pending"
      );

      if (!requestToCancel) {
        setToast({ message: "No pending request found.", type: "error" });
        return;
      }

      await axios.delete(
        `http://localhost:5000/api/user-borrow/request/cancel/${requestToCancel.id}`
      );

      setToast({ message: "Request cancelled successfully.", type: "success" });
      await fetchActiveBorrowCount();
      await fetchRequestedBooks();
    } catch (err) {
      console.error("Failed to cancel request", err);
      setToast({
        message: err.response?.data?.error || "Cancellation failed",
        type: "error",
      });
    }
  };

  const filteredBooks = availableBooks.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  return (
    <>
      <UserNavbar setSidebarOpen={setIsSidebarOpen} />
      <div
        className={`available-books ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"
          }`}
      >
        <h2>Available Books</h2>

        <div className="request-count tooltip-container">
          <b>
            You have {activeBorrowCount} active borrow requests.
            <span className="tooltip">
              <img src={info} alt="info" className="info-icon" />
              <span className="tooltip-text">
                You can have 3 active requests at a time. Wait for admin approval to make new requests.
              </span>
            </span>
          </b>
        </div>



        <div className="search-bar-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search book by title..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="book-list">
          {paginatedBooks.length === 0 ? (
            <p>No books match your search.</p>
          ) : (
            paginatedBooks.map((book) => {
              const isUnavailable = book.available_copies === 0;
              const isRequested = requestedBooks.includes(book.id);
              const isLimitReached = activeBorrowCount >= 3;

              return (
                <div
                  key={book.id}
                  className={`book-card ${isUnavailable ? "unavailable" : ""}`}
                  onClick={() => handleCardClick(book)}
                >
                  <h4 className={isUnavailable ? "strike" : ""}>
                    {book.title}
                  </h4>
                  <p className={isUnavailable ? "strike" : ""}>
                    Author: {book.author}
                  </p>
                  <p className={isUnavailable ? "strike" : ""}>
                    Category: {book.category}
                  </p>
                  <p className={isUnavailable ? "strike" : ""}>
                    Available Copies: {book.available_copies}
                  </p>

                  <div className="button-group">
                        <button
                      className={`btn-cancel ${!isRequested ? "readonly-btn" : ""}`}
                      onClick={(e) => isRequested && handleCancelClick(e, book.id)}
                    >
                      Cancel
                    </button>

                    <button
                      className={`btn-request ${isUnavailable || isRequested || isLimitReached ? "readonly-btn" : ""
                        }`}
                      onClick={(e) =>
                        !(isUnavailable || isRequested || isLimitReached) &&
                        handleRequestClick(e, book.id)
                      }
                    >
                      {isUnavailable
                        ? "Not Available"
                        : isRequested
                          ? "Requested"
                          : isLimitReached
                            ? "Maxed"
                            : "Borrow"}
                    </button>


                
                  </div>
                </div>
              );
            })
          )}
        </div>

        {filteredBooks.length > booksPerPage && (
          <div className="pagination-1">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="page-number">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="pagination-btn"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "" })}
        />
      )}
{showModal && (
  <div className="borrow-modal-overlay">
    <div className="borrow-modal">
      <p>Are you sure you want to send this borrow request to the admin?</p>
      <div className="borrow-modal-buttons">
         <button className="borrow-cancel-btn" onClick={() => setShowModal(false)}>
          Cancel
        </button>
        <button className="borrow-confirm-btn" onClick={requestBorrowBook}>
          Yes
        </button>
       
      </div>
    </div>
  </div>
)}

{showDetailModal && selectedBookDetails && (
  <div className="details-modal-overlay">
    <div className="details-modal">
      <h3>Book Details</h3>
      <p>
        <strong>Title:</strong> {selectedBookDetails.title}
      </p>
      <p>
        <strong>Author:</strong> {selectedBookDetails.author}
      </p>
      <p>
        <strong>Category:</strong> {selectedBookDetails.category}
      </p>
      <p>
        <strong>Available Copies:</strong> {selectedBookDetails.available_copies}
      </p>
      <div className="details-modal-buttons">
        <button
          className="details-close-btn"
          onClick={() => setShowDetailModal(false)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
}

export default AvailableBooks;
