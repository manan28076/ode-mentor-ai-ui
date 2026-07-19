const mongoose = require("mongoose");
const ai = require("../services/geminiService");
const chatSystemPrompt = require("../prompts/chatPrompt");
const Conversation = require("../models/Conversation");
const friendlyGeminiError = require("../utils/friendlyGeminiError");

const MODEL = "gemini-2.5-flash";

const buildTitle = (message) => {
    const trimmed = message.trim().replace(/\s+/g, " ");
    return trimmed.length > 48 ? `${trimmed.slice(0, 48)}…` : trimmed;
};

const sendMessage = async (req, res) => {
    try {
        const { message, conversationId } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                message: "Message is required",
            });
        }

        let conversation;

        if (conversationId) {
            if (!mongoose.Types.ObjectId.isValid(conversationId)) {
                return res.status(400).json({
                    message: "Invalid conversation id",
                });
            }

            conversation = await Conversation.findOne({
                _id: conversationId,
                userId: req.user._id,
            });

            if (!conversation) {
                return res.status(404).json({
                    message: "Conversation not found",
                });
            }
        } else {
            conversation = await Conversation.create({
                userId: req.user._id,
                title: buildTitle(message),
                messages: [],
            });
        }

        // Build Gemini conversation history (existing messages + new user message)
        const contents = [
            { role: "user", parts: [{ text: chatSystemPrompt() }] },
            { role: "model", parts: [{ text: "Understood. I'm ready to help with code reviews and programming questions." }] },
            ...conversation.messages.map((m) => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: m.content }],
            })),
            { role: "user", parts: [{ text: message }] },
        ];

        const response = await ai.models.generateContent({
            model: MODEL,
            contents,
        });

        const replyText = response.text;

        const now = new Date();

        conversation.messages.push({ role: "user", content: message, timestamp: now });
        conversation.messages.push({ role: "assistant", content: replyText, timestamp: new Date() });

        if (conversation.messages.length === 2) {
            conversation.title = buildTitle(message);
        }

        await conversation.save();

        res.status(200).json({
            success: true,
            conversationId: conversation._id,
            reply: replyText,
        });
    } catch (error) {
        console.error("chat sendMessage error:", error);
        const { status, message } = friendlyGeminiError(error);
        res.status(status).json({ message });
    }
};

const listConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({ userId: req.user._id })
            .select("title updatedAt createdAt")
            .sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            conversations,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getConversation = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid conversation id",
            });
        }

        const conversation = await Conversation.findOne({
            _id: id,
            userId: req.user._id,
        });

        if (!conversation) {
            return res.status(404).json({
                message: "Conversation not found",
            });
        }

        res.status(200).json({
            success: true,
            conversation,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    sendMessage,
    listConversations,
    getConversation,
};