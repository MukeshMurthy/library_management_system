const express = require("express");
const router = express.Router();
const { getBorrowHistory } = require("../../controllers/booksController");


router.get("/history", getBorrowHistory);

module.exports = router;
