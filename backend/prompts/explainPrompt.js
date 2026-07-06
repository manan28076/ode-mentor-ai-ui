const explainPrompt = (code) => {
    return `
You are an expert programming teacher.

Explain the following code in a simple way suitable for beginners.

Code:
${code}

Return ONLY valid JSON.

{
    "summary": "",
    "lineByLineExplanation": [],
    "importantConcepts": [],
    "commonMistakes": [],
    "interviewTips": []
}

Rules:
- Summary should be under 80 words.
- Explain each important line simply.
- Maximum 5 important concepts.
- Maximum 5 common mistakes.
- Maximum 5 interview tips.
- Return ONLY JSON.
- Do NOT use markdown.
- Do NOT use backticks.
`;
};

module.exports = explainPrompt;