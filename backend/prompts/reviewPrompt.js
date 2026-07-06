const reviewPrompt = (code) => {
return `
You are a Senior Software Engineer and Code Reviewer.

Analyze the following code thoroughly.

Code:
${code}

Return ONLY valid JSON.

{
  "overallScore": 0,
  "logic": "",
  "performance": "",
  "codeExplanation": "",
  "bugs": [
    {
      "id": 1,
      "name": "",
      "line": 0,
      "message": "",
      "severity": "low"
    }
  ],
  "complexity": {
    "time": "",
    "space": "",
    "optimal": ""
  },
  "optimizedCode": "",
  "optimizationExplanation": "",
  "bestPractices": [],
  "errorExplanation": "",
  "howToAvoid": "",
  "edgeCases": [],
  "unitTests": ""
}

Rules:

- overallScore should be between 0 and 100.
- Maximum 3 bugs.
- Every bug must contain:
  - id
  - name
  - line
  - message
  - severity (low | medium | high)
- bestPractices maximum 3.
- edgeCases maximum 3.
- unitTests should be valid code.
- optimizedCode should be complete code.
- Keep every explanation concise.
- Do NOT return markdown.
- Do NOT use backticks.
- Return ONLY valid JSON.
`;
};

module.exports = reviewPrompt;