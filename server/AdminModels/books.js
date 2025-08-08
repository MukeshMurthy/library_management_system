const express = require("express");
const router = express.Router();
const pool = require("../db");

const validateBookId = (req, res, next) => {
  const bookId = parseInt(req.params.id, 10);
  if (isNaN(bookId)) {
    return res.status(400).json({ message: "Invalid book ID" });
  }
  req.bookId = bookId;
  next();
};


router.get("/available", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM books WHERE is_archived = FALSE ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching available books:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/archived", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM books WHERE is_archived = TRUE ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching archived books:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/unarchive/:id", async (req, res) => {
  const bookId = req.params.id;

  try {
    await pool.query("UPDATE books SET is_archived = FALSE WHERE id = $1", [bookId]);
    res.status(200).json({ message: "Book unarchived successfully" });
  } catch (err) {
    console.error("Unarchive book error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});



router.post("/add", async (req, res) => {
  const { title, author, category, total_copies } = req.body;

  if (!title || !author || !category || !total_copies) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const duplicate = await pool.query(
      "SELECT * FROM books WHERE LOWER(title) = LOWER($1) AND LOWER(author) = LOWER($2) AND is_archived = FALSE",
      [title.trim(), author.trim()]
    );

    if (duplicate.rows.length > 0) {
      return res.status(409).json({ message: "Book with same title and author already exists" });
    }

    const available_copies = total_copies;
    const result = await pool.query(
      `INSERT INTO books (title, author, category, total_copies, available_copies, status, is_archived)
       VALUES ($1, $2, $3, $4, $5, 'available', FALSE) RETURNING *`,
      [title, author, category, total_copies, available_copies]
    );

    res.status(201).json({ message: "Book added successfully", book: result.rows[0] });
  } catch (err) {
    console.error("Add book error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/:id", validateBookId, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM books WHERE id = $1", [req.bookId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching book:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


router.delete("/:id", validateBookId, async (req, res) => {
  try {
    await pool.query("DELETE FROM books WHERE id = $1", [req.bookId]);
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("Delete book error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


router.patch("/archive/:id", validateBookId, async (req, res) => {
  try {
    await pool.query("UPDATE books SET is_archived = TRUE WHERE id = $1", [req.bookId]);
    res.status(200).json({ message: "Book archived successfully" });
  } catch (err) {
    console.error("Archive book error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


router.patch("/unarchive/:id", validateBookId, async (req, res) => {
  try {
    await pool.query("UPDATE books SET is_archived = FALSE WHERE id = $1", [req.bookId]);
    res.status(200).json({ message: "Book unarchived successfully" });
  } catch (err) {
    console.error("Unarchive book error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


router.patch("/increase/:id", validateBookId, async (req, res) => {
  try {
    await pool.query(
      "UPDATE books SET total_copies = total_copies + 1, available_copies = available_copies + 1 WHERE id = $1",
      [req.bookId]
    );
    res.status(200).json({ message: "Book copies increased" });
  } catch (err) {
    console.error("Increase copies error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


router.patch("/decrease/:id", validateBookId, async (req, res) => {
  try {
    const result = await pool.query("SELECT available_copies FROM books WHERE id = $1", [req.bookId]);
    const available = result.rows[0]?.available_copies;

    if (available === undefined) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (available <= 0) {
      return res.status(400).json({ message: "Cannot decrease below 0 available copies" });
    }

    await pool.query(
      "UPDATE books SET total_copies = total_copies - 1, available_copies = available_copies - 1 WHERE id = $1",
      [req.bookId]
    );

    res.status(200).json({ message: "Book copies decreased" });
  } catch (err) {
    console.error("Decrease copies error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
