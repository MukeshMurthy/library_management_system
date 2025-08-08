const express = require("express");
const pool = require("../../db");
const router = express.Router();


router.post("/signup", async (req, res) => {
  const { username, email, password, role = "user", adminSecret } = req.body;

  try {
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists. Please sign in.", flag: false });
    }

    if (role === "admin") {
      const adminPassword = adminSecret;

      const validAdmin = await pool.query(
        "SELECT * FROM users WHERE role = 'admin' AND password = $1",
        [adminPassword]
      );

      if (validAdmin.rows.length === 0) {
        return res.status(401).json({ message: "Invalid admin verification password.", flag: false });
      }
    }

    await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)",
      [username, email, password, role]
    );

    return res.status(201).json({
      message: `Account created successfully as ${role}. Welcome, ${username}!`,
      flag: true,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error. Try again later.", flag: false });
  }
});



router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "No user found. Please sign up first.",
        flag: false,
      });
    }

    const user = result.rows[0];

    if (user.password !== password) {
      return res.status(401).json({
        message: "Incorrect credentials.",
        flag: false,
      });
    }

    return res.status(200).json({
      message: `Welcome, ${user.username}! Logged in successfully as ${user.role}.`,
      flag: true,
      role: user.role,
      userId: user.id,
      username: user.username,
    });
  } catch (err) {
    console.error("Signin error:", err);
    return res.status(500).json({
      message: "Server error. Try again later.",
      flag: false,
    });
  }
});

module.exports = router;
