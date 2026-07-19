const ai = require("../services/geminiService");
const reviewPrompt = require("../prompts/reviewPrompt");
const Review = require("../models/Review");
const mongoose = require("mongoose");
const reviewCode = async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({
                message: "Code is required",
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: reviewPrompt(code),
        });

        const review = JSON.parse(response.text);

        const savedReview = await Review.create({
            user: req.user._id,
            language: req.body.language || "Unknown",
            originalCode: code,
            aiReview: review,
        });

        res.status(200).json({
            success: true,
            review: savedReview,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
const getReviewHistory = async (req, res) => {
    try {
        const reviews = await Review.find({
            user: req.user._id,
        })
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            reviews,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
const getDashboardStats = async (req, res) => {
    try {

        const reviews = await Review.find({
            user: req.user._id,
        }).sort({ createdAt: -1 });

        const totalReviews = reviews.length;

        const averageScore =
            totalReviews === 0
                ? 0
                : Math.round(
                      reviews.reduce(
                          (sum, review) =>
                              sum +(review.aiReview?.overallScore || 0),0
                      ) / totalReviews
                  );

        const languagesReviewed = new Set(
            reviews.map((r) => r.language)
        ).size;

        const linesReviewed = reviews.reduce(
            (sum, review) =>
                sum +
                (review.originalCode
                    ? review.originalCode.split("\n").length
                    : 0),
            0
        );

        res.status(200).json({
            success: true,
            totalReviews,
            averageScore,
            languagesReviewed,
            linesReviewed,
            recentReviews: reviews.slice(0, 5),
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};
const getReviewById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid review id",
            });
        }

        const review = await Review.findOne({
            _id: id,
            user: req.user._id,
        });

        if (!review) {
            return res.status(404).json({
                message: "Review not found",
            });
        }

        res.status(200).json({
            success: true,
            review,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
module.exports = {
    reviewCode,
    getReviewHistory,
    getDashboardStats,
    getReviewById,
};