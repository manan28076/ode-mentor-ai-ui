const express = require("express");

const router = express.Router();

const {
    sendMessage,
    listConversations,
    getConversation,
} = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, sendMessage);
router.get("/conversations", protect, listConversations);
router.get("/conversations/:id", protect, getConversation);

module.exports = router;