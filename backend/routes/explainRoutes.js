const express = require("express");

const router = express.Router();

const { explainCode } = require("../controllers/explainController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, explainCode);

module.exports = router;