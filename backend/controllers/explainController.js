const ai = require("../services/geminiService");
const explainPrompt = require("../prompts/explainPrompt");
const friendlyGeminiError = require("../utils/friendlyGeminiError");

const explainCode = async (req, res) => {
    try {

        const { code } = req.body;

        if (!code) {
            return res.status(400).json({
                message: "Code is required"
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: explainPrompt(code),
        });

        res.status(200).json({
            explanation: response.text,
        });

    } catch (error) {
        console.error("explainCode error:", error);
        const { status, message } = friendlyGeminiError(error);
        res.status(status).json({ message });
    }
};

module.exports = {
    explainCode,
};