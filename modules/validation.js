// Sanitize potentially harmful characters
export function sanitizeInput(input) {
    let sanitizedInput = input.replace(/[\s\t\r\n]+/g, " "); // Normalize whitespace
    sanitizedInput = sanitizedInput.trim(); // Remove whitespace from both ends
    sanitizedInput = sanitizedInput.replace(/<[^>]+>/g, ""); // Remove HTML tags

    return sanitizedInput;
}

// Assess guardrails
export function validateInput(input) {
    // Empty input
    if (!input || input == " ") {
        return {
            assessment: "Empty",
            errorMessage: ""
        };
    }

    // Length limit
    if (input.length > 200) {
        return {
            assessment: "Too long",
            errorMessage: "⚠️ Oops! Would you mind shortening your message a bit, please?"
        };
    }

    // Character set
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,!?;:'’"()-]+$/.test(input)) { // Excludes @$%&/+
        return {
            assessment: "Forbidden characters",
            errorMessage: "⚠️ Oops! Please use only letters, numbers, and common punctuation."
        };
    }

    return {
        assessment: "OK",
        errorMessage: ""
    };
}