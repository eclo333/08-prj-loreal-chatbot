/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Keep the full conversation history so the AI remembers context
const messages = [
  {
    role: "system",
    content: `You are a friendly and knowledgeable L'Oréal Beauty Advisor.
You only answer questions related to L'Oréal products, skincare routines,
haircare routines, makeup tips, fragrance recommendations, and beauty advice.
If a user asks about anything unrelated to L'Oréal, beauty, or personal care,
politely decline and redirect them to beauty topics.
Always mention specific L'Oréal product lines when relevant (e.g., Revitalift,
EverPure, Infallible, True Match, Elvive, Excellence, etc.).`,
  },
];

// Helper: append a message bubble to the chat window
function addMessage(role, text) {
  const div = document.createElement("div");
  div.classList.add("msg", role === "user" ? "user" : "ai");
  div.textContent = (role === "user" ? "You: " : "L'Oréal Advisor: ") + text;
  chatWindow.appendChild(div);
  // Scroll to the latest message
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Show a welcome message when the page loads
addMessage(
  "ai",
  "Bonjour! 💄 I'm your L'Oréal Beauty Advisor. Ask me anything about skincare, haircare, makeup, or fragrances!",
);

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get and clear the user's input
  const userText = userInput.value.trim();
  if (!userText) return;
  userInput.value = "";

  // Display the user's message in the chat window
  addMessage("user", userText);

  // Add the user's message to the conversation history
  messages.push({ role: "user", content: userText });

  // Show a temporary "thinking" indicator
  const thinkingDiv = document.createElement("div");
  thinkingDiv.classList.add("msg", "ai");
  thinkingDiv.textContent = "L'Oréal Advisor: ...";
  chatWindow.appendChild(thinkingDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  // Send the conversation to the OpenAI API
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: messages,
    }),
  });

  const data = await response.json();

  // Remove the "thinking" indicator
  chatWindow.removeChild(thinkingDiv);

  // Extract the AI's reply and display it
  const aiReply = data.choices[0].message.content;
  addMessage("ai", aiReply);

  // Add the AI's reply to the conversation history
  messages.push({ role: "assistant", content: aiReply });
});
