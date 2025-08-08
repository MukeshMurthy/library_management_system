import React, { useState } from "react";
import axios from "axios";
import Toast from "../../../components/common/Toast/Toast";
import "./AddBook.css";

function AddBookModal({ onClose, onBookAdded }) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    total_copies: ""
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ message: "", type: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.author.trim()) newErrors.author = "Author is required";
    if (!form.category.trim()) newErrors.category = "Category is required";
    if (!form.total_copies.trim()) newErrors.total_copies = "Total copies is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/books/add", form);

      if (res.status === 201) {
        setToast({ message: "Book added successfully", type: "success" });
        onBookAdded();
        setForm({ title: "", author: "", category: "", total_copies: "" });
        setErrors({});

        setTimeout(() => {
          setToast({ message: "", type: "" });
          onClose();
        }, 1500);
      } else {
        setToast({ message: "Unexpected response from server", type: "error" });
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setToast({ message: "Duplicate book not allowed", type: "error" });
      } else {
        setToast({ message: "Failed to add book", type: "error" });
      }

      setTimeout(() => {
        setToast({ message: "", type: "" });
      }, 2000);
    }
  };

  const handleCancel = () => {
    setForm({ title: "", author: "", category: "", total_copies: "" });
    setErrors({});
    setToast({ message: "", type: "" });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Book</h2>
        <form className="add-book-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Book Title"
            value={form.title}
            onChange={handleChange}
            className={errors.title ? "error-input" : ""}
          />
          {errors.title && <span className="error-text">{errors.title}</span>}

          <input
            type="text"
            name="author"
            placeholder="Author"
            value={form.author}
            onChange={handleChange}
            className={errors.author ? "error-input" : ""}
          />
          {errors.author && <span className="error-text">{errors.author}</span>}

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className={errors.category ? "error-input" : ""}
          />
          {errors.category && <span className="error-text">{errors.category}</span>}

          <input
            type="integer"
            name="total_copies"
            placeholder="Total Copies"
            value={form.total_copies}
            onChange={handleChange}
            className={errors.total_copies ? "error-input" : ""}
          />
          {errors.total_copies && <span className="error-text">{errors.total_copies}</span>}

          <div className="modal-buttons">
            <button type="button" className="cancel1-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit">Submit</button>
          </div>

        </form>

        {toast.message && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: "", type: "" })}
          />
        )}
      </div>
    </div>
  );
}

export default AddBookModal;
