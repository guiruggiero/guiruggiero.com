import "https://cdn.jsdelivr.net/npm/typed.js/dist/typed.umd.min.js";

// Initialization
export let chatWindowExpanded = false;

// DOM elements
export const elements = {
    header: document.querySelector("header"),
    logo: document.querySelector("#logo"),
    chatContainer: document.querySelector("#chat-container"),
    chatWindow: document.querySelector("#chat-window"),
    messagesContainer: null,
    inputContainer: document.querySelector("#input-container"),
    input: document.querySelector("input"),
    submit: document.querySelector("#submit"),
    suggestions: document.querySelector("#suggestions")
};

// Focus on input without opening virtual keyboard
export function inputFocus() {
    elements.input.setAttribute("readonly", "readonly");
    elements.input.focus();
    elements.input.removeAttribute("readonly");
}

// Type input placeholder and then focus
export function inputPlaceholderAndFocus() {
    // eslint-disable-next-line no-undef
    new Typed(elements.input, {
        strings: ["^500 Ask me anything about Gui..."], // Waits 500ms before typing
        contentType: "null",
        attr: "placeholder",
        typeSpeed: 10,
        showCursor: false,
        onComplete: inputFocus
    });
}

// Allow/forbid submit button
export function toggleSubmitButton() {
    const hasContent = elements.input.value.trim().length > 0;
    elements.submit.classList.toggle("active", hasContent);
}

// Clear input box
export function clearInput() {
    elements.input.value = "";
}

// Close virtual keyboard
export function closeKeyboard() {
    elements.input.blur();
}

// Change input placeholder
export function changePlaceholder(text) {
    elements.input.placeholder = text;
}

// Allow/forbid input
export function toggleInput() {
    const currentState = elements.input.disabled;
    elements.input.disabled = !currentState;
}

// Expand chat window
export function expandChatWindow() {
    // Get initial positions and sizes relative to viewport
    const initialTop = elements.chatContainer.getBoundingClientRect().top;
    
    // Set initial size to match input container
    elements.chatContainer.style.width = `${elements.inputContainer.offsetWidth}px`;
    elements.chatContainer.style.height = `${elements.inputContainer.offsetHeight}px`;
    
    // Set position to fixed immediately, but maintain current position
    elements.chatContainer.style.position = "fixed";
    elements.chatContainer.style.top = `${initialTop}px`;
    
    // Force a reflow
    elements.chatContainer.offsetHeight;

    // Expand to full size and move to final position
    elements.chatContainer.style.maxWidth = "750px";
    elements.chatContainer.style.width = "90%";
    elements.chatContainer.style.maxHeight = "600px";
    elements.chatContainer.style.minHeight = "265px";
    elements.chatContainer.style.height = "calc(100dvh - 130px)";
    elements.chatContainer.style.top = "70px";

    // Input container styles
    elements.inputContainer.style.padding = "10px";
    elements.inputContainer.style.backgroundColor = "#262626";

    // Fade in inner content and hide logo/suggestions
    setTimeout(() => {
        elements.chatWindow.style.height = "calc(100% - 80px)";
        elements.chatWindow.style.opacity = "1";
        elements.chatWindow.style.padding = "0px 9px 0px 15px";
        elements.chatWindow.style.marginTop = "20px";
        elements.logo.style.opacity = "0";
        elements.suggestions.style.opacity = "0";

        // Show header after slight delay
        setTimeout(elements.header.classList.add("visible"), 300);
    }, 0);

    chatWindowExpanded = true;

    // Create messages container for correct scrolling
    let messagesContainer = document.createElement("div");
    messagesContainer.className = "messages-container";
    elements.chatWindow.appendChild(messagesContainer);
    elements.messagesContainer = messagesContainer;
}

// Animate the element in, regardless of content
function animateElement(element) {
    elements.messagesContainer.appendChild(element);

    // Animate the element in
    element.style.opacity = "0";
    element.style.transform = "translateY(10px)";
    element.offsetHeight;
    element.style.transition = "all 0.5s ease";
    element.style.opacity = "1";
    element.style.transform = "translateY(0)";
    
    // Scroll to bottom
    elements.chatWindow.scrollTop = elements.chatWindow.scrollHeight;
}

// Add message to chat window
export function addMessage(type, message, existingContainer = null) {
    if (type == "user") {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", "user-message");
        messageElement.textContent = message;
        animateElement(messageElement);
    } else if (type == "bot") {
        let messageElement = existingContainer;
        messageElement.removeAttribute("id");
        messageElement.innerHTML = "";

        // Replace the & character so Typed doesn't stop
        message = message.replace(/&/g, "&amp;");

        // Scroll to bottom if height changes
        const resizeObserver = new ResizeObserver(() => {
            elements.chatWindow.scrollTop = elements.chatWindow.scrollHeight;
        });

        // Type response
        // eslint-disable-next-line no-undef
        new Typed(messageElement, {
            strings: [message],
            contentType: "html",
            typeSpeed: 10,
            showCursor: false,
            onBegin: () => {
                resizeObserver.observe(messageElement);
            },
            onComplete: () => {
                resizeObserver.disconnect();
            }
        });
    } else { // Error message
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", "error-message");
        messageElement.textContent = message;
        animateElement(messageElement);
    }
}

// Show loader
export function showLoader() {
    // Create loader container with bot message styling
    const loaderContainer = document.createElement("div");
    loaderContainer.id = "loader-container";
    loaderContainer.classList.add("message", "bot-message");
    
    // Create loader element
    const loaderElement = document.createElement("div");
    loaderElement.id = "loader";
    loaderContainer.appendChild(loaderElement);
    animateElement(loaderContainer);
    
    // For reuse with bot message
    return loaderContainer;
}