// Maps a raw error from the Gemini API into a safe, user-friendly
// { status, message } pair instead of leaking raw provider errors.
function friendlyGeminiError(error) {
    const raw = `${error?.message || ""} ${error?.status || ""} ${error?.code || ""}`.toLowerCase();

    if (raw.includes("429") || raw.includes("quota") || raw.includes("resource_exhausted") || raw.includes("rate limit")) {
        return {
            status: 503,
            message: "The AI review service is busy right now (rate limit reached). Please try again in a minute.",
        };
    }

    if (raw.includes("timeout") || raw.includes("deadline")) {
        return {
            status: 504,
            message: "The AI took too long to respond. Please try again.",
        };
    }

    if (raw.includes("safety") || raw.includes("blocked")) {
        return {
            status: 400,
            message: "This code couldn't be reviewed as submitted. Please check it doesn't contain sensitive content.",
        };
    }

    return {
        status: 500,
        message: "Something went wrong while generating the review. Please try again.",
    };
}

module.exports = friendlyGeminiError;