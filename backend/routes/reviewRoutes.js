const express = require("express");

const router = express.Router();

const {
    reviewCode,
    getReviewHistory,
    getDashboardStats,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, reviewCode);
router.get("/history", protect, getReviewHistory);
router.get("/dashboard", protect, getDashboardStats);
module.exports = router;