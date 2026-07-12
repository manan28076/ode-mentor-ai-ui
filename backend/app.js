const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const explainRoutes = require("./routes/explainRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/explain", explainRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
// Test Route
app.get("/", (req, res) => {
    res.send("🚀 AI Code Reviewer Backend is Running...");
});

module.exports = app;