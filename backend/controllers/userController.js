const User = require("../models/User");
const Review = require("../models/Review");

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const reviews = await Review.find({ user: user._id });

        const totalReviews = reviews.length;

        const averageScore =
            totalReviews === 0
                ? 0
                : Math.round(
                      reviews.reduce(
                          (sum, review) =>
                              sum + (review.aiReview?.overallScore || 0),
                          0
                      ) / totalReviews
                  );

        const linesReviewed = reviews.reduce(
            (sum, review) =>
                sum +
                (review.originalCode
                    ? review.originalCode.split("\n").length
                    : 0),
            0
        );

        const projectsReviewed = new Set(
            reviews.map((r) => r.language)
        ).size;

        res.status(200).json({
            success: true,
            name: user.name,
            email: user.email,
            githubUsername: user.githubUsername || "",
            location: user.location || "",
            createdAt: user.createdAt,
            stats: {
                totalReviews,
                averageScore,
                linesReviewed,
                projectsReviewed,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    getUserProfile,
};