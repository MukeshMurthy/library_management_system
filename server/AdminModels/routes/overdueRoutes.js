
const express = require("express");
const router = express.Router();
const { getOverdueBooks } = require("../../controllers/overdueController");

router.get("/", getOverdueBooks); 

module.exports = router;
