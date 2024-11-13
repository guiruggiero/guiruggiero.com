// Sanitize potentially harmful characters
export function sanitizeInput(input) {
    input = input.replace(/[\s\t\r\n]+/g, " "); // Normalize whitespace
    input = input.trim(); // Remove whitespace from both ends
    input = input.replace(/<[^>]+>/g, ""); // Remove HTML tags

    return input;
}

// Assess guardrails
export function validateInput(input) {
    // Empty input
    if (!input || input == " ") {
        return {
            assessment: "Empty",
            message: ""
        };
    }

    // Length limit
    if (input.length > 200) {
        return {
            assessment: "Too long",
            message: "⚠️ Oops! Would you mind shortening your message a bit, please?"
        };
    }

    // Character set
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,!?;:'’"()-]+$/.test(input)) { // Excludes @$%&/+
        return {
            assessment: "Forbidden characters",
            message: "⚠️ Oops! Please use only letters, numbers, and common punctuation."
        };
    }

    return {
        assessment: "OK",
        message: ""
    };
}