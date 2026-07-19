const express = require("express");

const router = express.Router();

const {
    reviewCode,
    getReviewHistory,
    getDashboardStats,
    getReviewById,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, reviewCode);
router.get("/history", protect, getReviewHistory);
router.get("/dashboard", protect, getDashboardStats);
router.get("/:id", protect, getReviewById);
module.exports = router;