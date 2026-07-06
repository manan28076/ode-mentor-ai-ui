const ai = require("../services/geminiService");
const explainPrompt = require("../prompts/explainPrompt");

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
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    explainCode,
};