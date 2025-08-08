const express = require("express");
const router = express.Router();
const { getReturnedBooks } = require("../../controllers/returnedController");

router.get("/", getReturnedBooks); 

module.exports = router;
