const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ["user", "assistant"],
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false }
);

const conversationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            default: "New chat",
        },
        messages: {
            type: [messageSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Conversation", conversationSchema);